import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BlockchainService } from './services/blockchain.service';
import { BlockchainController } from './controllers/blockchain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, BlockchainController],
  providers: [UsersService, BlockchainService],
  exports: [UsersService],
})
export class UsersModule {}
