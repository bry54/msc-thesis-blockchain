import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Production } from './entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { FabricService } from '../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';
import { CrudRequest } from '@dataui/crud';
import { ChaincodeNames } from '../../utils/enums/chaincode-operations.enum';
import { BlockchainService } from '../fabric/services/blockchain.service';

@Injectable()
export class ProductionService extends TypeOrmCrudService<Production> {
  constructor(
    @InjectRepository(Production) repo: Repository<Production>,
    private readonly fabricService: FabricService,
    private blockchainService: BlockchainService,
    private readonly logger: PinoLogger,
  ) {
    super(repo);
  }

  async createOne(
    req: CrudRequest,
    dto: DeepPartial<Production>,
  ): Promise<Production> {
    const res = await super.createOne(req, dto);
    await this.blockchainService.createOne(ChaincodeNames.PRODUCTIONS, res);
    return res;
  }

  async updateOne(
    req: CrudRequest,
    dto: DeepPartial<Production>,
  ): Promise<Production> {
    const res = await super.updateOne(req, dto);
    await this.blockchainService.updateOne(
      ChaincodeNames.PRODUCTIONS,
      res.id,
      dto,
    );
    return res;
  }

  async deleteOne(req: CrudRequest): Promise<void | Production> {
    const id = req.parsed.paramsFilter.find(
      (item) => item.field === 'id',
    ).value;
    let rec;
    const res = await super.deleteOne(req).then(async (res) => {
      rec = await this.repo.findOne({ where: { id: id }, withDeleted: true });
      return res;
    });
    await this.blockchainService.updateOne(ChaincodeNames.PRODUCTIONS, id, {
      deletedDate: rec.deletedDate,
    });
    return res;
  }
}
