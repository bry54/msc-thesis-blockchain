import { ApiProperty } from '@nestjs/swagger';
import {Column, Entity, OneToMany} from 'typeorm';
import { BaseEntity } from '../../../utils/helpers/base.entity';
import {User} from "../../users/entities/user.entity";
import {StakeholderTypes} from "../../../utils/enums/stakeholder-types.enum";

@Entity()
export class Stakeholder extends BaseEntity{

  @ApiProperty()
  @Column('text')
  public name: string;

  @ApiProperty({enum: StakeholderTypes})
  @Column('enum', { enum: StakeholderTypes })
  public type: StakeholderTypes; // e.g., "farm", "wholesaler", "market", "regulatory organization"

  @ApiProperty()
  @Column('text')
  public contactNumber: string;

  @ApiProperty()
  @Column('text')
  public location: string;

  @OneToMany(() => User, (rel) => rel.stakeholder)
  users: User[];
}
