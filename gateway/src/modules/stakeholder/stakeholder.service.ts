import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Stakeholder } from './entities/stakeholder.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { CrudRequest } from '@dataui/crud';
import { ChaincodeNames } from '../../utils/enums/chaincode-operations.enum';
import { BlockchainService } from '../fabric/services/blockchain.service';

@Injectable()
export class StakeholderService extends TypeOrmCrudService<Stakeholder> {
  constructor(
    @InjectRepository(Stakeholder) repo: Repository<Stakeholder>,
    private blockchainService: BlockchainService,
    private readonly logger: PinoLogger,
  ) {
    super(repo);
  }

  async createOne(
    req: CrudRequest,
    dto: DeepPartial<Stakeholder>,
  ): Promise<Stakeholder> {
    const res = await super.createOne(req, dto);
    await this.blockchainService.createOne(ChaincodeNames.STAKEHOLDERS, res);
    return res;
  }

  async updateOne(
    req: CrudRequest,
    dto: DeepPartial<Stakeholder>,
  ): Promise<Stakeholder> {
    const res = await super.updateOne(req, dto);
    await this.blockchainService.updateOne(
      ChaincodeNames.STAKEHOLDERS,
      res.id,
      dto,
    );
    return res;
  }

  async deleteOne(req: CrudRequest): Promise<void | Stakeholder> {
    const id = req.parsed.paramsFilter.find(
      (item) => item.field === 'id',
    ).value;
    let rec;
    const res = await super.deleteOne(req).then(async (res) => {
      rec = await this.repo.findOne({ where: { id: id }, withDeleted: true });
      return res;
    });
    await this.blockchainService.updateOne(ChaincodeNames.STAKEHOLDERS, id, {
      deletedDate: rec.deletedDate,
    });
    return res;
  }
}
