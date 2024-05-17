import { Test, TestingModule } from '@nestjs/testing';
import { StakeholderController } from './stakeholder.controller';
import { StakeholderService } from './stakeholder.service';

describe('StakeholderController', () => {
  let controller: StakeholderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StakeholderController],
      providers: [StakeholderService],
    }).compile();

    controller = module.get<StakeholderController>(StakeholderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
