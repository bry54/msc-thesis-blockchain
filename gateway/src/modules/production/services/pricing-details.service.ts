import { Injectable, NotFoundException } from '@nestjs/common';
import { Production } from '../entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { PricingDetail } from '../dto/create-production.dto';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from '../../fabric/services/blockchain.service';
import { ChaincodeNames } from '../../../utils/enums/chaincode-operations.enum';
import {User} from "../../users/entities/user.entity";

@Injectable()
export class PricingDetailsService {
  constructor(
    @InjectRepository(Production) private repo: Repository<Production>,
    private readonly blockchainService: BlockchainService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly logger: PinoLogger,
  ) {}

  async getAll(productionId: string): Promise<PricingDetail[] | void> {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    return production.pricingDetail;
  }

  async createOne(
      productionId: string,
      dto: PricingDetail,
      authenticated: any
  ) {
    let production = await this.repo.findOne({ where: { id: productionId } });
    let user = await this.userRepo.findOne({ where: { id: authenticated.userId }, relations: ['stakeholder'] });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    dto.id = uuidv4();
    dto.date = new Date().toISOString()

    if (user){
      dto.signedBy = {
        id: user.id,
        fullName: user.fullName,
      }

      if (user.stakeholder) {
        const {id, name, type, contactNumber, location} = user.stakeholder;
        dto.stakeHolder = {id, name, type, contactNumber, location}
      }
    }

    if (!production.pricingDetail) {
      production.pricingDetail = [dto];
    } else {
      production.pricingDetail.push(dto);
    }
    production = await this.repo.save(production);

    await this.blockchainService.updateOne(
      ChaincodeNames.PRODUCTIONS,
      production.id,
      {
        pricingDetail: production.pricingDetail,
      } as Partial<Production>,
    );

    return dto;
  }

  async updateOne(
    productionId: string,
    pricingId: string,
    dto: PricingDetail,
  ): Promise<PricingDetail> {
    let production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const index = production.pricingDetail.findIndex(
      (pricing) => pricing.id === pricingId,
    );

    if (index === -1) {
      throw new NotFoundException('Pricing detail not found');
    }

    production.pricingDetail[index] = {
      ...production.pricingDetail[index],
      ...dto,
    };

    production = await this.repo.save(production);

    await this.blockchainService.updateOne(
      ChaincodeNames.PRODUCTIONS,
      production.id,
      {
        pricingDetail: production.pricingDetail,
      } as Partial<Production>,
    );

    return production.pricingDetail[index];
  }

  async deleteOne(productionId: string, pricingId: string) {
    let production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const index = production.pricingDetail.findIndex(
      (pricing) => pricing.id === pricingId,
    );

    if (index === -1) {
      throw new NotFoundException('Pricing detail not found');
    }

    production.pricingDetail.splice(index, 1);

    production = await this.repo.save(production);

    await this.blockchainService.updateOne(
      ChaincodeNames.PRODUCTIONS,
      production.id,
      {
        pricingDetail: production.pricingDetail,
      } as Partial<Production>,
    );

    return;
  }
}
