import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production } from './entities/production.entity';
import { RegulatoryChecksController } from './controllers/regulatory-checks.controller';
import { RegulatoryChecksService } from './services/regulatory-checks.service';
import { BlockchainController } from './controllers/blockchain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Production])],
  controllers: [
    ProductionController,
    BlockchainController,
    RegulatoryChecksController,
  ],
  providers: [
    ProductionService,
    BlockchainController,
    RegulatoryChecksService],
})
export class ProductionModule {}
