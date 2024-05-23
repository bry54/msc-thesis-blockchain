import { ApiProperty } from '@nestjs/swagger';
import {Column, Entity, OneToMany} from 'typeorm';
import { BaseEntity } from '../../../utils/helpers/base.entity';
import {User} from "../../users/entities/user.entity";

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

  @OneToMany(() => User, (rel) => rel.stakeholder)
  users: User[];
}
