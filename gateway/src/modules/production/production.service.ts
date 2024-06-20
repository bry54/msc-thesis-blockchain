import {BadRequestException, Injectable} from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Production } from './entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { FabricService } from '../fabric/fabric.service';
import { PinoLogger } from 'nestjs-pino';
import { CrudRequest } from '@dataui/crud';
import { ChaincodeNames } from '../../utils/enums/chaincode-operations.enum';
import { BlockchainService } from '../fabric/services/blockchain.service';
import {Stakeholder} from "../stakeholder/entities/stakeholder.entity";
import {User} from "../users/entities/user.entity";

@Injectable()
export class ProductionService extends TypeOrmCrudService<Production> {
  constructor(
    @InjectRepository(Production) repo: Repository<Production>,
    @InjectRepository(User) private userRepo: Repository<User>,
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
    const authenticated = dto.authenticated;

    delete dto.authenticated;

    if (!dto.origin?.id){
      const user = await this.userRepo.findOne({
        where: {id: authenticated.userId},
        relations: ['stakeholder'],
      });

      if (user.stakeholder) {
        const {id, name, type, location, contactNumber} = user.stakeholder;
        dto.origin = {
          id, name, type, location, contactNumber
        }
      }
    }

    if (!dto.origin?.id){
      throw new BadRequestException('Provide product origin');
    }

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
