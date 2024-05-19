import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production } from './entities/production.entity';
import { RegulatoryChecksController } from './controllers/regulatory-checks.controller';
import { RegulatoryChecksService } from './services/regulatory-checks.service';
import { BlockchainController } from './controllers/blockchain.controller';
import { TransportationDetailsService } from './services/transportation-details.service';
import { TransportationDetailsController } from './controllers/transportation-details.controller';
import { PricingDetailsService } from './services/pricing-details.service';
import { PricingDetailsController } from './controllers/pricing-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Production])],
  controllers: [
    ProductionController,
    BlockchainController,
    RegulatoryChecksController,
    TransportationDetailsController,
    PricingDetailsController,
  ],
  providers: [
    ProductionService,
    BlockchainController,
    RegulatoryChecksService,
    TransportationDetailsService,
    PricingDetailsService,
  ],
})
export class ProductionModule {}
