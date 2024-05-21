import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FabricService } from '../fabric.service';
import { ChaincodeNames, ChaincodeOperations } from '../../../utils/enums/chaincode-operations.enum';

@Injectable()
export class BlockchainService {
  constructor(
    private readonly fabricService: FabricService,
    private readonly logger: PinoLogger,
  ) {}

  async findMany(chaincodeName: ChaincodeNames) {
    try {
      return this.fabricService.evaluateTransaction(
        chaincodeName,
        ChaincodeOperations.QUERY_ALL,
      );
    } catch (error: any) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${chaincodeName} | transaction: ${ChaincodeOperations.QUERY_ALL}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async findOne(chaincodeName: ChaincodeNames, id: string) {
    try {
      return this.fabricService.evaluateTransaction(
        chaincodeName,
        ChaincodeOperations.QUERY_ONE,
        [id],
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${chaincodeName} | transaction: ${ChaincodeOperations.QUERY_ONE}}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async removeOne(chaincodeName: ChaincodeNames, id: string) {
    try {
      await this.fabricService.submitTransaction(
        chaincodeName,
        ChaincodeOperations.DELETE_ONE,
        JSON.stringify({ ID: id }),
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${chaincodeName} | transaction: ${ChaincodeOperations.DELETE_ONE}}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async updateOne(chaincodeName: ChaincodeNames, id: string, dto) {
    try {
      const chaincodeDto = {
        ID: id,
        ...dto,
      };

      await this.fabricService.submitTransaction(
        chaincodeName,
        ChaincodeOperations.UPDATE_ONE,
        JSON.stringify(chaincodeDto),
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${chaincodeName} transaction: ${ChaincodeOperations.UPDATE_ONE}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async createOne(chaincodeName: ChaincodeNames, res: any) {
    try {
      const chaincodeDto = {
        ID: res.id,
        ...res,
      };
      delete chaincodeDto.id;
      await this.fabricService.submitTransaction(
        chaincodeName,
        ChaincodeOperations.CREATE_ONE,
        JSON.stringify(chaincodeDto),
      );
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${chaincodeName} | transaction: ${ChaincodeOperations.CREATE_ONE}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async history(chaincodeName: ChaincodeNames, id: string) {
    try {
      const history: any[] = await this.fabricService.evaluateTransaction(
        chaincodeName,
        ChaincodeOperations.QUERY_HISTORY,
        [id],
      );

      return history.map((rec) => {
        return {
          ...rec,
          Record: JSON.parse(rec.Record),
        };
      });
    } catch (error) {
      this.logger.error(
        error,
        `BLOCKCHAIN ERROR: {chaincode: ${chaincodeName} | transaction: ${ChaincodeOperations.QUERY_HISTORY}`,
      );
      throw new HttpException(
        error?.details[0]?.message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
