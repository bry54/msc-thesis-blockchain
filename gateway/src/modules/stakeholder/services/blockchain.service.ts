import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Stakeholder } from '../entities/stakeholder.entity';
import { FabricService } from '../../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';
import { ChaincodeOperations } from '../../../utils/enums/chaincode-operations.enum';

const CHAINCODE_NAME = 'stakeholders';

@Injectable()
export class BlockchainService {
  constructor(
    private readonly fabricService: FabricService,
    private readonly logger: PinoLogger,
  ) {}

  async findMany() {
    try {
      return this.fabricService.evaluateTransaction(CHAINCODE_NAME, ChaincodeOperations.QUERY_ALL);
    } catch (error: any) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: ${ChaincodeOperations.QUERY_ALL}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async findOne(id: string) {
    try {
      return this.fabricService.evaluateTransaction(CHAINCODE_NAME, ChaincodeOperations.QUERY_ONE, [id]);
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: ${ChaincodeOperations.QUERY_ONE}}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async removeOne(id: string) {
    try {
      await this.fabricService.submitTransaction(CHAINCODE_NAME, ChaincodeOperations.DELETE_ONE, JSON.stringify({ ID: id }));
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: ${ChaincodeOperations.DELETE_ONE}}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async updateOne(id: string, dto) {
    try {
      const chaincodeDto = {
        ID: id,
        ...dto,
      };

      await this.fabricService.submitTransaction(CHAINCODE_NAME, ChaincodeOperations.UPDATE_ONE, JSON.stringify(chaincodeDto));
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} transaction: ${ChaincodeOperations.UPDATE_ONE}`);
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
      await this.fabricService.submitTransaction(CHAINCODE_NAME, ChaincodeOperations.CREATE_ONE, JSON.stringify(chaincodeDto));
    } catch (error) {
      this.logger.error(error, `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: ${ChaincodeOperations.CREATE_ONE}`);
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async history(id: string) {
    try {
      const history: any[] = await this.fabricService.evaluateTransaction(CHAINCODE_NAME, ChaincodeOperations.QUERY_HISTORY, [
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
        `BLOCKCHAIN ERROR: {chaincode: ${CHAINCODE_NAME} | transaction: ${ChaincodeOperations.QUERY_HISTORY}`,
      );
      throw new HttpException(error?.details[0]?.message, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
