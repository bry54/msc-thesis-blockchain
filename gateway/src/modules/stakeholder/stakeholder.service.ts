import { Injectable } from '@nestjs/common';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';

@Injectable()
export class StakeholderService {
  create(createStakeholderDto: CreateStakeholderDto) {
    return 'This action adds a new stakeholder';
  }

  findAll() {
    return `This action returns all stakeholder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stakeholder`;
  }

  update(id: number, updateStakeholderDto: UpdateStakeholderDto) {
    return `This action updates a #${id} stakeholder`;
  }

  remove(id: number) {
    return `This action removes a #${id} stakeholder`;
  }
}
