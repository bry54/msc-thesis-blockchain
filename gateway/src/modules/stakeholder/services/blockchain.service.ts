import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Stakeholder } from '../entities/stakeholder.entity';
import { FabricService } from '../../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';

const CHAINCODE_NAME = 'stakeholders';

@Injectable()
export class BlockchainService {
  constructor(
    private readonly fabricService: FabricService,
    private readonly logger: PinoLogger,
  ) {}

  async findMany() {
    try {
      return this.fabricService.evaluateTransaction(CHAINCODE_NAME, 'queryAllStakeholders');
    } catch (error: any) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: queryAllStakeholders}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async findOne(id: string) {
    try {
      return this.fabricService.evaluateTransaction(CHAINCODE_NAME, 'queryStakeholder', [id]);
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: queryStakeholder}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async removeOne(id: string) {
    try {
      await this.fabricService.submitTransaction(CHAINCODE_NAME, 'deleteStakeholder', JSON.stringify({ ID: id }));
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: deleteStakeholder}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async updateOne(id: string, dto) {
    try {
      const chaincodeDto = {
        ID: id,
        ...dto,
      };

      await this.fabricService.submitTransaction(CHAINCODE_NAME, 'updateStakeholder', JSON.stringify(chaincodeDto));
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} transaction: updateStakeholder}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async createOne(res: Stakeholder) {
    try {
      const chaincodeDto = {
        ID: res.id,
        ...res,
      };
      delete chaincodeDto.id;
      await this.fabricService.submitTransaction(CHAINCODE_NAME, 'createStakeholder', JSON.stringify(chaincodeDto));
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: createStakeholder}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async history(id: string) {
    try {
      const history: any[] = await this.fabricService.evaluateTransaction(CHAINCODE_NAME, 'queryStakeholderHistory', [
        id,
      ]);

      return history.map((rec) => {
        return {
          ...rec,
          Record: JSON.parse(rec.Record),
        };
      });
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: queryStakeholderHistory}`,
      );
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
