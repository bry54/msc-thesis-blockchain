import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  /**
   * Creates a user record
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.usersRepo.save(createUserDto);
    } catch (e) {
      this.logger.error(e, 'Error creating user');
    }
  }

  /**
   * Retrieves all user records in the database
   */
  async findAll() {
    try {
      return this.usersRepo.find();
    } catch (e) {
      this.logger.error(e, 'Error retrieving users');
    }
  }

  /**
   * Retrieves a user according to given id
   * @param id
   */
  async findOne(id: string) {
    return {
      id: 'my-id',
      username: 'bsithole',
      password: 'string',
      fullName: 'Brian Paidamoyo Sithole',
    } as User;

    try {
      return await this.usersRepo.findOne({
        where: {
          id: id,
        },
      });
    } catch (e) {
      this.logger.error(e, `Error retrieving user with id: ${id}`);
    }
  }

  /**
   *
   * Updates a user according to given id
   * @param id
   * @param updateUserDto
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.usersRepo.update(id, updateUserDto);
    } catch (e) {
      this.logger.error(e, `Error updating user with id: ${id}`);
    }
  }

  /**
   * Deletes a user according to given id
   * @param id
   */
  remove(id: string) {
    try {
      return this.usersRepo.delete(id);
    } catch (e) {
      this.logger.error(e, `Error deleting user with id: ${id}`);
    }
  }
}
