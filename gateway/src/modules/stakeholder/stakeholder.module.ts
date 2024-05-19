import { Module } from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { StakeholderController } from './stakeholder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stakeholder } from './entities/stakeholder.entity';
import { BlockchainController } from './controllers/blockchain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stakeholder])],
  controllers: [StakeholderController, BlockchainController],
  providers: [StakeholderService],
  exports: [StakeholderService],
})
export class StakeholderModule {}
