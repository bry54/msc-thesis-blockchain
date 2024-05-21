import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
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
import { BaseEntity } from '../../../utils/helpers/base.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Production extends BaseEntity {

  @ApiProperty({ type: Product })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column('json')
  product: Product;

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


}
