/*
SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from 'fabric-contract-api';

@Object()
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
