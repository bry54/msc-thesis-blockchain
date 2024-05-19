import { Module } from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { StakeholderController } from './stakeholder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stakeholder } from './entities/stakeholder.entity';
import { BlockchainService } from './services/blockchain.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stakeholder])],
  controllers: [StakeholderController],
  providers: [StakeholderService, BlockchainService],
  exports: [StakeholderService],
})
export class StakeholderModule {}
