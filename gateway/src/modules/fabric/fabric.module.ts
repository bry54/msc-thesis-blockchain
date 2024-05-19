import { Global, Module } from '@nestjs/common';
import { FabricService } from './fabric.service';
import { FabricController } from './fabric.controller';
import { WalletsService } from './services/wallets.service';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainService } from './services/blockchain.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [FabricController],
  providers: [FabricService, BlockchainService, WalletsService],
  exports: [FabricService, BlockchainService, WalletsService],
})
export class FabricModule {}
