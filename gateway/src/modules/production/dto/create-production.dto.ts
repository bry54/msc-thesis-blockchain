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

  @ApiProperty()
  notes: string;

  date: string;

  @ApiProperty()
  signedBy: User;
}

export class HoldingArea {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  notes: string;
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

  @ApiProperty()
  stakeHolder: Stakeholder;

  @ApiProperty()
  pricePerUnit: string;
}
