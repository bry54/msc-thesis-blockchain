import { Global, Module } from '@nestjs/common';
import { FabricService } from './fabric.service';
import { FabricController } from './fabric.controller';
import { WalletsService } from './wallets.service';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [FabricController],
  providers: [FabricService, WalletsService],
  exports: [FabricService, WalletsService],
})
export class FabricModule {}
