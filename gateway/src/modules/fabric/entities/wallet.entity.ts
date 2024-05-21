import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../utils/helpers/base.entity';

@Entity()
export class Wallet extends BaseEntity{

  @Column({ unique: true })
  label: string;

  @Column('text')
  certificate: string;

  @Column('text')
  privateKey: string;

  @Column('text')
  mspId: string;
}
