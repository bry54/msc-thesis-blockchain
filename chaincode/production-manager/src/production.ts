/*
SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from 'fabric-contract-api';

export class Product {
    @Property()
    name: string;

    @Property()
    category: string;
}

export class Planting {
    @Property()
    quantity: string;

    @Property()
    date: Date;
}

export class Harvesting {
    @Property()
    quantity: string;

    @Property()
    date: Date;
}

export class RegulatoryCheck {
    @Property()
    id: string;

    @Property()
    notes: string;

    @Property()
    date: string;

    @Property()
    signedBy: User;
}

export class HoldingArea {
    @Property()
    name: string;

    @Property()
    address: string;

    @Property()
    arrivalTime: string;

    @Property()
    departureTime: string;
}

export class TransportationDetail {
    @Property()
    id: string;

    @Property()
    notes: string;

    @Property()
    departure: HoldingArea;

    @Property()
    destination: HoldingArea;
}

export class PricingDetail {
    @Property()
    id: string;

    @Property()
    stakeHolder: Stakeholder;

    @Property()
    pricePerUnit: string;
}

export class User {
    @Property()
    public ID: string;

    @Property()
    public fullname: string;

    @Property()
    public username: string;
}

export class Stakeholder {

    @Property()
    public ID: string;

    @Property()
    public name: string;

    @Property()
    public type: string; // e.g., "farm", "wholesaler", "market", "regulatory organization"

    @Property()
    public contactNumber: string;

    @Property()
    public location: string;
}

@Object()
export class Production {

    @Property()
    public ID: string;

    @Property()
    product: Product;

    @Property()
    origin: Stakeholder;

    @Property()
    planting: Planting;

    @Property()
    harvesting: Harvesting;

    @Property()
    regulatoryChecks: RegulatoryCheck[];

    @Property()
    transportationDetail: TransportationDetail[];

    @Property()
    pricingDetail: PricingDetail[];
}
