import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StakeholderTypes } from '../../../utils/enums/stakeholder-types.enum';

export class CreateStakeholderDto {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  @IsEnum(StakeholderTypes)
  public type: string; // e.g., "farm", "wholesaler", "market", "regulatory organization"

  @ApiProperty()
  public contactNumber: string;

  @ApiProperty()
  public location: string;
}
