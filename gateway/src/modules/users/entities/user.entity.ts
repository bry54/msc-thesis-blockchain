import {Column, Entity, ManyToOne} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../utils/helpers/base.entity';
import {Stakeholder} from "../../stakeholder/entities/stakeholder.entity";

@Entity()
export class User extends BaseEntity {

  @ApiProperty()
  @Column()
  fullName: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ManyToOne(() => Stakeholder, (rel) => rel.users,{
    nullable: true,
  })
  stakeholder: Stakeholder;
}
