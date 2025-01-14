import {BadRequestException, ConflictException, Injectable, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {DeepPartial, Repository} from 'typeorm';
import {PinoLogger} from 'nestjs-pino';
import {TypeOrmCrudService} from '@dataui/crud-typeorm';
import {CrudRequest} from '@dataui/crud';
import {ChaincodeNames} from '../../utils/enums/chaincode-operations.enum';
import {BlockchainService} from '../fabric/services/blockchain.service';
import * as bcrypt from 'bcrypt';
import {Roles} from "../../utils/enums/stakeholder-types.enum";

@Injectable()
export class UsersService extends TypeOrmCrudService<User> implements OnModuleInit{
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
    private blockchainService: BlockchainService,
    private configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    super(repo);
    this.logger.setContext(UsersService.name);
  }

  async createOne(req: CrudRequest, dto: DeepPartial<User>): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        username: dto.username,
      },
      withDeleted: true,
    });

    if (user) {
      throw new BadRequestException('Username is already taken')
    }

    let res;
    dto.password = bcrypt.hashSync(dto.password, 10);
    if (req) {
      res = await super.createOne(req, dto);
    } else {
      res = await this.repo.save(dto);
    }
    await this.blockchainService.createOne(ChaincodeNames.USERS, res);
    return res;
  }

  async updateOne(req: CrudRequest, dto: DeepPartial<User>): Promise<User> {
    try {
      if (dto.password) {
        dto.password = bcrypt.hashSync(dto.password, 10);
      }
      const res = await super.updateOne(req, dto);
      await this.blockchainService.updateOne(ChaincodeNames.USERS, res.id, dto);
      return res;
    } catch (e){
      if (e.code == '23505' || e.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Unique constraint violation. Email is possibly taken');
      }
      throw e;
    }
  }

  async deleteOne(req: CrudRequest): Promise<void | User> {
    const id = req.parsed.paramsFilter.find(
      (item) => item.field === 'id',
    ).value;
    let rec;
    const res = await super.deleteOne(req).then(async (res) => {
      rec = await this.repo.findOne({ where: { id: id }, withDeleted: true });
      return res;
    });
    await this.blockchainService.updateOne(ChaincodeNames.USERS, id, {
      deletedDate: rec.deletedDate,
    });
    return res;
  }

  async onModuleInit(): Promise<any> {
    const users = await this.repo.find()
    if (!users.length) {
      await this.repo.save({
        fullName: 'Administrator',
        username: 'admin@root.com',
        password: bcrypt.hashSync('1', 10),
        role: Roles.ADMINISTRATOR
      })
    }
  }
}
