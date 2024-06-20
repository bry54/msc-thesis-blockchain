import { ApiProperty } from '@nestjs/swagger';
import { Stakeholder } from '../../stakeholder/entities/stakeholder.entity';
import { User } from '../../users/entities/user.entity';

export class Product {
  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;
}

export class Planting {
  @ApiProperty()
  quantity: string;

  @ApiProperty()
  date: Date;
}

export class Harvesting {
  @ApiProperty()
  quantity: string;

  @ApiProperty()
  date: Date;
}

export class RegulatoryCheck {
  id: string;

  date: string;

  signedBy: Partial<User>;

  @ApiProperty()
  notes: string;
}

export class HoldingArea {
  @ApiProperty()
  notes: string;

  @ApiProperty()
  stakeholderId: string

  date: string;

  stakeholder: Partial<Stakeholder>;

  responsiblePerson: Partial<User>;
}

export class TransportationDetail {
  id: string;

  @ApiProperty()
  departure: HoldingArea;

  @ApiProperty()
  destination: HoldingArea;
}

export class PricingDetail {
  id: string;

  date: string;

  stakeHolder: Partial<Stakeholder>;

  signedBy: Partial<User>;

  @ApiProperty()
  pricePerUnit: string;
}
