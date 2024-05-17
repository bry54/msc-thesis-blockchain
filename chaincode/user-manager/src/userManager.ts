/*
* SPDX-License-Identifier: Apache-2.0
*/
// Deterministic JSON.stringify()

import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

@Info({ title: 'UserManager', description: 'Smart contract for managing User items' })
export class UserManagerContract extends Contract{

    @Transaction()
    public async initLedger(ctx: Context): Promise<void> {
        //Implement any logic to initialise the ledger
    }
}
