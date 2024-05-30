import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../utils/helpers/base.entity';
import {Stakeholder} from "../../stakeholder/entities/stakeholder.entity";
import {Roles} from "../../../utils/enums/stakeholder-types.enum";
import {IsEnum, IsOptional, IsUUID} from "class-validator";

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

  @ApiProperty()
  @IsUUID('4')
  @IsOptional()
  @Column({ nullable: true})
  stakeholderId: string;

  @ApiProperty({enum: Roles})
  @IsOptional()
  @IsEnum(Roles, {groups: Object.values(Roles)})
  @Column({type: "enum", enum: Roles, nullable: true})
  role: Roles;

  @ManyToOne(() => Stakeholder, (rel) => rel.users,{
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({name: 'stakeholder_id'})
  stakeholder: Stakeholder;
}
