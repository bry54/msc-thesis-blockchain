import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
    private configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    super(repo);
    this.logger.setContext(UsersService.name);
  }
}
