import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Production } from './entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { FabricService } from '../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';
import { CrudRequest } from '@dataui/crud';

@Injectable()
export class ProductionService extends TypeOrmCrudService<Production> {
  constructor(
    @InjectRepository(Production) repo: Repository<Production>,
    private readonly fabricService: FabricService,
    private readonly logger: PinoLogger,
  ) {
    super(repo);
  }

  updateOne(req: CrudRequest, dto: DeepPartial<Production>): Promise<Production> {
    return super.updateOne(req, dto);
  }
}
