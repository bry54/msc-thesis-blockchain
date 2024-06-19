import { Injectable, NotFoundException } from '@nestjs/common';
import { Production } from '../entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { TransportationDetail } from '../dto/create-production.dto';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from '../../fabric/services/blockchain.service';
import { ChaincodeNames } from '../../../utils/enums/chaincode-operations.enum';

@Injectable()
export class TransportationDetailsService {
  constructor(
    @InjectRepository(Production) private repo: Repository<Production>,
    private readonly blochchainService: BlockchainService,
    private readonly logger: PinoLogger,
  ) {}

  async getAll(productionId: string): Promise<TransportationDetail[] | void> {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    return production.transportationDetail;
  }

  async createOne(productionId: string, dto: TransportationDetail) {
    let production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    dto.id = uuidv4();

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
