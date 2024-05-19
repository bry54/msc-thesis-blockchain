import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Production } from './entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FabricService } from '../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProductionService extends TypeOrmCrudService<Production> {
  constructor(
    @InjectRepository(Production) repo: Repository<Production>,
    private readonly fabricService: FabricService,
    private readonly logger: PinoLogger,
  ) {
    super(repo);
  }
}
