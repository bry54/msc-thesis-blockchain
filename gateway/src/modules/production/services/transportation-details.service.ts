import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { Production } from '../entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { TransportationDetail } from '../dto/create-production.dto';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from '../../fabric/services/blockchain.service';
import { ChaincodeNames } from '../../../utils/enums/chaincode-operations.enum';
import {Stakeholder} from "../../stakeholder/entities/stakeholder.entity";
import {User} from "../../users/entities/user.entity";
import {use} from "passport";

@Injectable()
export class TransportationDetailsService {
  constructor(
      @InjectRepository(Production) private repo: Repository<Production>,
      @InjectRepository(Stakeholder) private stakeholderRepo: Repository<Stakeholder>,
      @InjectRepository(User) private userRepo: Repository<User>,
      private readonly blockchainService: BlockchainService,
      private readonly logger: PinoLogger,
  ) {}

  async getAll(
      productionId: string
  ): Promise<TransportationDetail[] | void> {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    return production.transportationDetail;
  }

  async createOne(
      productionId: string,
      dto: TransportationDetail,
      authenticated: any
  ) {
    let production = await this.repo.findOne({ where: { id: productionId } });
    let user = await this.userRepo.findOne({ where: { id: authenticated.userId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const departureId = dto.departure?.stakeholderId;
    const destinationId = dto.destination?.stakeholderId;

    if (!departureId || !destinationId) {
      throw new BadRequestException('Provide product origin and destination');
    }

    dto.id = uuidv4();

    if (departureId){
      let departurePlace: Stakeholder | Partial<Stakeholder> = await this.stakeholderRepo.findOne({where: {id: departureId}});

      if (!departurePlace){
        throw new NotFoundException('Origin does not exist');
      }

      let {id, name, type, contactNumber, location} = departurePlace;
      dto.departure.stakeholder = {id, name, type, contactNumber, location};

      dto.departure.responsiblePerson = {id: user.id, fullName: user.fullName };

      if (!dto.departure.date)
        dto.departure.date = new Date().toISOString();
    }

    if (destinationId){
      const destinationPlace = await this.stakeholderRepo.findOne({where: {id: destinationId}});
      if (!destinationPlace) {
        throw new NotFoundException('Destination does not exist');
      }
      const { id, name, type, contactNumber, location} = destinationPlace;

      dto.destination.stakeholder = { id, name, type, contactNumber, location };
    }

    if (!production.transportationDetail) {
      production.transportationDetail = [dto];
    } else {
      production.transportationDetail.push(dto);
    }

    production = await this.repo.save(production);

    await this.blockchainService.updateOne(
        ChaincodeNames.PRODUCTIONS,
        production.id,
        {
          transportationDetail: production.transportationDetail,
        } as Partial<Production>,
    );

    return dto;
  }

  async updateOne(
      productionId: string,
      transportationId: string,
      dto: any, //TransportationDetail | {isConfirming: boolean},
      authenticated: any
  ): Promise<TransportationDetail> {
    let production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const index = production.transportationDetail.findIndex(
        (transportation) => transportation.id === transportationId,
    );

    if (index === -1) {
      throw new NotFoundException('Transportation detail not found');
    }

    const transportationDetail = production.transportationDetail[index];

    if (dto.isConfirming){
      const user = await this.userRepo.findOne({ where: { id: authenticated.userId } });
      const {id, fullName, role} = user
      transportationDetail.destination.responsiblePerson = {id, fullName, role}
      delete dto.isConfirming;
    } else {

      const departureId = dto.departure.stakeholderId;
      const destinationId = dto.destination.stakeholderId

      if (!departureId || !destinationId){
        throw new BadRequestException('Provide product origin and destination')
      }

      let departurePlace: Stakeholder | Partial<Stakeholder> = await this.stakeholderRepo.findOne({where: {id: departureId}});
      let destinationPlace: Stakeholder | Partial<Stakeholder> = await this.stakeholderRepo.findOne({where: {id: destinationId}});

      if (!departurePlace){
        throw new NotFoundException('Origin does not exist');
      } else {
        let {id, name, type, contactNumber, location} = departurePlace;
        dto.departure.stakeholder = {id, name, type, contactNumber, location};
        dto.departure.responsiblePerson = transportationDetail.departure.responsiblePerson
        dto.departure.date = transportationDetail.departure.date;
      }

      if (!destinationPlace){
        throw new NotFoundException('Destination does not exist');
      } else {
        let {id, name, type, contactNumber, location} = destinationPlace;
        dto.destination.stakeholder = {id, name, type, contactNumber, location};
        dto.destination.responsiblePerson = transportationDetail.destination.responsiblePerson
        dto.destination.date = transportationDetail.destination.date;
      }

      production.transportationDetail[index] = {
        ...transportationDetail,
        ...dto,
      };
    }

    production = await this.repo.save(production);

    await this.blockchainService.updateOne(
        ChaincodeNames.PRODUCTIONS,
        production.id,
        {
          transportationDetail: production.transportationDetail,
        } as Partial<Production>,
    );

    return production.transportationDetail[index];
  }

  async deleteOne(productionId: string, transportationId: string) {
    let production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const index = production.transportationDetail.findIndex(
        (transportation) => transportation.id === transportationId,
    );

    if (index === -1) {
      throw new NotFoundException('Transportation detail not found');
    }

    production.transportationDetail.splice(index, 1);

    production = await this.repo.save(production);

    await this.blockchainService.updateOne(
        ChaincodeNames.PRODUCTIONS,
        production.id,
        {
          transportationDetail: production.transportationDetail,
        } as Partial<Production>,
    );

    return;
  }
}
