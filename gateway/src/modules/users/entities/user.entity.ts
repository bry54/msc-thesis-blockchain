import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../utils/helpers/base.entity';

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
}
