import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Stakeholder {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
