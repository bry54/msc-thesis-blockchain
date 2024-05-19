import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Harvesting,
  Planting,
  PricingDetail,
  Product,
  RegulatoryCheck,
  TransportationDetail,
} from '../dto/create-production.dto';
import { Stakeholder } from '../../stakeholder/entities/stakeholder.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Production {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ApiProperty({ type: Product })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column('json')
  product: Production;

  @ApiProperty({ type: Stakeholder })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column('json')
  origin: Stakeholder;

  @ApiProperty({ type: Planting })
  @IsOptional()
  @Column({ type: 'json', nullable: true })
  planting: Planting;

  @ApiProperty({ type: Harvesting })
  @IsOptional()
  @Column({ type: 'json', nullable: true })
  harvesting: Harvesting;

  @ApiProperty({ type: RegulatoryCheck, isArray: true })
  @IsOptional()
  @Column({ type: 'json', nullable: true })
  regulatoryChecks: RegulatoryCheck[];

  @ApiProperty({ type: TransportationDetail, isArray: true })
  @IsOptional()
  @Column({ type: 'json', nullable: true })
  transportationDetail: TransportationDetail[];

  @ApiProperty({ type: PricingDetail, isArray: true })
  @IsOptional()
  @Column({ type: 'json', nullable: true })
  pricingDetail: PricingDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
