import { Injectable, NotFoundException } from '@nestjs/common';
import { Production } from '../entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { RegulatoryCheck } from '../dto/create-production.dto';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from '../../fabric/services/blockchain.service';
import { ChaincodeNames } from '../../../utils/enums/chaincode-operations.enum';
import {User} from "../../users/entities/user.entity";
import {use} from "passport";

@Injectable()
export class RegulatoryChecksService {
  constructor(
      @InjectRepository(Production) private repo: Repository<Production>,
      private readonly blochchainService: BlockchainService,
      @InjectRepository(User) private userRepo: Repository<User>,
      private readonly logger: PinoLogger,
  ) {}

  async getAll(productionId: string) {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    return production.regulatoryChecks;
  }

  async createOne(productionId: string, dto: RegulatoryCheck, authenticated) {
    let production = await this.repo.findOne({ where: { id: productionId } });
    let user = await this.userRepo.findOne({ where: { id: authenticated.userId }, relations: ['stakeholder'] });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    if (user){
      const { id, fullName, } = user;
      dto.signedBy = {
        id,
        fullName,
      }

      if (user.stakeholder){
        dto.signedBy.stakeholder = {
          id: user.stakeholderId,
          name: user.stakeholder.name,
          type: user.stakeholder.type,
          location: user.stakeholder.location,
          contactNumber: user.stakeholder.contactNumber,
        }
      }
    }

    dto.id = uuidv4();
    dto.date = new Date().toISOString();

    if (!production.regulatoryChecks) {
      production.regulatoryChecks = [dto];
    } else {
      production.regulatoryChecks.push(dto);
    }
    production = await this.repo.save(production);
    await this.blochchainService.updateOne(
        ChaincodeNames.PRODUCTIONS,
        production.id,
        {
          regulatoryChecks: production.regulatoryChecks,
        } as Partial<Production>,
    );

    return dto;
  }

  async updateOne(
      productionId: string,
      checkId: string,
      dto: RegulatoryCheck,
  ): Promise<RegulatoryCheck> {
    let production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const regulatoryCheckIndex = production.regulatoryChecks.findIndex(
        (check) => check.id === checkId,
    );

    if (regulatoryCheckIndex === -1) {
      throw new NotFoundException('RegulatoryCheck not found');
    }

    production.regulatoryChecks[regulatoryCheckIndex] = {
      ...production.regulatoryChecks[regulatoryCheckIndex],
      ...dto,
    };

    production = await this.repo.save(production);

    await this.blochchainService.updateOne(
        ChaincodeNames.PRODUCTIONS,
        production.id,
        {
          regulatoryChecks: production.regulatoryChecks,
        } as Partial<Production>,
    );

    return production.regulatoryChecks[regulatoryCheckIndex];
  }

  async deleteOne(productionId: string, checkId: string) {
    let production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const regulatoryCheckIndex = production.regulatoryChecks.findIndex(
        (check) => check.id === checkId,
    );

    if (regulatoryCheckIndex === -1) {
      throw new NotFoundException('RegulatoryCheck not found');
    }

    production.regulatoryChecks.splice(regulatoryCheckIndex, 1);

    production = await this.repo.save(production);

    await this.blochchainService.updateOne(
        ChaincodeNames.PRODUCTIONS,
        production.id,
        {
          regulatoryChecks: production.regulatoryChecks,
        } as Partial<Production>,
    );

    return;
  }
}
