import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';

@Controller('stakeholder')
export class StakeholderController {
  constructor(private readonly stakeholderService: StakeholderService) {}

  @Post()
  create(@Body() createStakeholderDto: CreateStakeholderDto) {
    return this.stakeholderService.create(createStakeholderDto);
  }

  @Get()
  findAll() {
    return this.stakeholderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stakeholderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStakeholderDto: UpdateStakeholderDto,
  ) {
    return this.stakeholderService.update(+id, updateStakeholderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stakeholderService.remove(+id);
  }
}
