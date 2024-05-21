import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../utils/helpers/base.entity';

@Entity()
export class Stakeholder extends BaseEntity{

  @ApiProperty()
  @Column('text')
  public name: string;

  @ApiProperty()
  @Column('text')
  public type: string; // e.g., "farm", "wholesaler", "market", "regulatory organization"

  @ApiProperty()
  @Column('text')
  public contactNumber: string;

  @ApiProperty()
  @Column('text')
  public location: string;
}
