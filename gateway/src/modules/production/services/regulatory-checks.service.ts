import { Injectable, NotFoundException } from '@nestjs/common';
import { Production } from '../entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FabricService } from '../../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';
import { RegulatoryCheck } from '../dto/create-production.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegulatoryChecksService {
  constructor(
    @InjectRepository(Production) private repo: Repository<Production>,
    private readonly fabricService: FabricService,
    private readonly logger: PinoLogger,
  ) {}

  async getRegulatoryChecks(productionId: string) {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    return production.regulatoryChecks;
  }

  async createRegulatoryCheck(productionId: string, dto: RegulatoryCheck) {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    dto.id = uuidv4();
    dto.date = new Date().toISOString();

    if (!production.regulatoryChecks) {
      production.regulatoryChecks = [dto];
    } else {
      production.regulatoryChecks.push(dto);
    }
    await this.repo.save(production);

    return dto;
  }

  async updateRegulatoryCheck(productionId: string, checkId: string, dto: RegulatoryCheck): Promise<Production> {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const regulatoryCheckIndex = production.regulatoryChecks.findIndex((check) => check.id === checkId);

    if (regulatoryCheckIndex === -1) {
      throw new NotFoundException('RegulatoryCheck not found');
    }

    production.regulatoryChecks[regulatoryCheckIndex] = {
      ...production.regulatoryChecks[regulatoryCheckIndex],
      ...dto,
    };

    await this.repo.save(production);
    return production;
  }

  async deleteRegulatoryCheck(productionId: string, checkId: string) {
    const production = await this.repo.findOne({ where: { id: productionId } });

    if (!production) {
      throw new NotFoundException('Production not found');
    }

    const regulatoryCheckIndex = production.regulatoryChecks.findIndex((check) => check.id === checkId);

    if (regulatoryCheckIndex === -1) {
      throw new NotFoundException('RegulatoryCheck not found');
    }

    production.regulatoryChecks.splice(regulatoryCheckIndex);

    await this.repo.save(production);

    return;
  }
}
