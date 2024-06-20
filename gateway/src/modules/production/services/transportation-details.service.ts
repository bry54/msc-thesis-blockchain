import { Injectable, NotFoundException } from '@nestjs/common';
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
      private readonly blochchainService: BlockchainService,
      private readonly logger: PinoLogger,
  ) {}

  async getAll(
      productionId: string
  ): Promise<TransportationDetail[] | void> {

    return []
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
    let user = await this.userRepo.findOne({ where: { id: authenticated.userId }, relations: ['stakeholder'] });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const departureId = dto.departure.stakeholderId;
    const destinationId = dto.destination.stakeholderId;

    dto.id = uuidv4();

    if (departureId){
      const departurePlace = await this.stakeholderRepo.findOne({where: {id: departureId}});

      if (!departurePlace) {
        throw new NotFoundException('Origin does not exist');
      }

      let {id, name, type, contactNumber, location} = departurePlace;
      dto.departure.stakeholder = {id, name, type, contactNumber, location};

      if(user) {
        let {id, fullName, stakeholder} = user;
        dto.departure.responsiblePerson = {
          id,
          fullName,
        }

        if (user.stakeholder){
          dto.departure.responsiblePerson.stakeholder = {
            id: user.stakeholder?.id,
                name: user.stakeholder?.name,
                location: user.stakeholder?.location,
                contactNumber: user.stakeholder?.contactNumber,
          }
        }
      }

      dto.departure.date = new Date().toISOString();
    }

    if (destinationId){
      const stakeholder = await this.stakeholderRepo.findOne({where: {id: destinationId}});
      if (!stakeholder) {
        throw new NotFoundException('Destination does not exist');
      }
      const { id, name, type, contactNumber, location} = stakeholder;

      dto.destination.stakeholder = { id, name, type, contactNumber, location };
    }

    if (!production.transportationDetail) {
      production.transportationDetail = [dto];
    } else {
      production.transportationDetail.push(dto);
    }
    production = await this.repo.save(production);
    await this.blochchainService.updateOne(
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
      dto: TransportationDetail,
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

    production.transportationDetail[index] = {
      ...production.transportationDetail[index],
      ...dto,
    };

    production = await this.repo.save(production);

    await this.blochchainService.updateOne(
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

    await this.blochchainService.updateOne(
        ChaincodeNames.PRODUCTIONS,
        production.id,
        {
          transportationDetail: production.transportationDetail,
        } as Partial<Production>,
    );

    return;
  }
}
