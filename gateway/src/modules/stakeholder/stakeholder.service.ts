import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FabricService } from '../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Stakeholder } from './entities/stakeholder.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { CrudRequest } from '@dataui/crud';

const CHAINCODE_NAME = 'participants';

@Injectable()
export class StakeholderService extends TypeOrmCrudService<Stakeholder> {
  constructor(
    @InjectRepository(Stakeholder) repo: Repository<Stakeholder>,
    private readonly fabricService: FabricService,
    private readonly logger: PinoLogger,
  ) {
    super(repo);
  }

  async createOne(
    req: CrudRequest,
    dto: DeepPartial<Stakeholder>,
  ): Promise<Stakeholder> {
    const res = await super.createOne(req, dto);
    await this.blockChainCreateOne(res);
    return res;
  }

  async updateOne(
    req: CrudRequest,
    dto: DeepPartial<Stakeholder>,
  ): Promise<Stakeholder> {
    const res = await super.updateOne(req, dto);
    await this.blockchainUpdateOne(res.id, dto);
    return res;
  }

  async deleteOne(req: CrudRequest): Promise<void | Stakeholder> {
    const id = req.parsed.paramsFilter.find(
      (item) => item.field === 'id'
    ).value;
    let rec;
    const res = await super.deleteOne(req).then( async ( res) => {
      rec = await this.repo.findOne({ where: { id: id }, withDeleted: true });
      return res;
    });
    await this.blockchainUpdateOne(id, { deletedDate: rec.deletedDate });
    return res;
  }

  async blockchainFindMany() {
    try {
      return this.fabricService.evaluateTransaction(
        CHAINCODE_NAME,
        'queryAllStakeholders',
      );
    } catch (error: any) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: queryAllStakeholders}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async blockchainFindOne(id: string) {
    try {
      return this.fabricService.evaluateTransaction(
        CHAINCODE_NAME,
        'queryStakeholder',
        [id],
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: queryStakeholder}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async blockchainRemoveOne(id: string) {
    try {
      await this.fabricService.submitTransaction(
        CHAINCODE_NAME,
        'deleteStakeholder',
        JSON.stringify({ ID: id }),
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: deleteStakeholder}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async blockchainUpdateOne(id: string, dto) {
    try {
      const chaincodeDto = {
        ID: id,
        ...dto,
      };

      await this.fabricService.submitTransaction(
        CHAINCODE_NAME,
        'updateStakeholder',
        JSON.stringify(chaincodeDto),
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} transaction: updateStakeholder}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async blockChainCreateOne(res: Stakeholder) {
    try {
      const chaincodeDto = {
        ID: res.id,
        ...res,
      };
      delete chaincodeDto.id;
      await this.fabricService.submitTransaction(
        CHAINCODE_NAME,
        'createStakeholder',
        JSON.stringify(chaincodeDto),
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: createStakeholder}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async blockchainHistory(id: string){
    try {
      const history: any[] = await this.fabricService.evaluateTransaction(
        CHAINCODE_NAME,
        'queryStakeholderHistory',
        [id],
      );

      return history.map((rec) => {
        return {
          ...rec,
          Record: JSON.parse(rec.Record)
        }
      })
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: queryStakeholderHistory}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
