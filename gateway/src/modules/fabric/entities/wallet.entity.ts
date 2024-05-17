import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  label: string;

  @Column('text')
  certificate: string;

  @Column('text')
  privateKey: string;

  @Column('text')
  mspId: string;
}
