/*
* SPDX-License-Identifier: Apache-2.0
*/
// Deterministic JSON.stringify()

import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { User } from './user';
const logger = require('pino')()

@Info({ title: 'UserManager', description: 'Smart contract for managing User items' })
export class UserManagerContract extends Contract{

    @Transaction()
    public async initLedger(ctx: Context): Promise<void> {
        //Implement any logic to initialise the ledger
    }

    @Transaction()
    @Returns('void')
    public async createOne(ctx: Context, recData: string): Promise<void> {
        const rec: User = JSON.parse(recData);
        await ctx.stub.putState(rec.ID, Buffer.from(JSON.stringify(rec)));
    }

    @Transaction(false)
    @Returns('string')
    public async queryOne(ctx: Context, recId: string): Promise<string>{
        const recAsBytes = await ctx.stub.getState(recId);
        if (!recAsBytes || recAsBytes.length === 0) {
            throw new Error(`${recId} does not exist`);
        }
        return recAsBytes.toString();
    }

    @Transaction(false)
    @Returns('string')
    public async queryAll(ctx: Context): Promise<string> {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record: string;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    @Returns('string')
    @Transaction(false)
    async updateOne(ctx: Context, recData: string) {
        const updateData: User = JSON.parse(recData);

        const found = await this.queryOne(ctx, updateData.ID);
        if (!found || found.length === 0) {
            throw new Error(`${updateData.ID} does not exist`);
        }
        let rec = JSON.parse(found);
        rec = {
            ...rec,
            ...updateData
        }

        await ctx.stub.putState(rec.ID, Buffer.from(JSON.stringify(rec)));
    }

    @Transaction()
    async deleteOne(ctx: Context, recData: string): Promise<void> {
        const toDelete: User = JSON.parse(recData);

        const found = await this.queryOne(ctx, toDelete.ID);
        if (!found || found.length === 0) {
            throw new Error(`${toDelete.ID} does not exist`);
        }

        ctx.stub.deleteState(toDelete.ID).then((res) => {
            console.log(`${toDelete.ID} deleted`)
        });
    }

    @Transaction(false)
    async queryHistory(ctx: Context, id: string): Promise<string> {
        const iterator = await ctx.stub.getHistoryForKey(id);
        const allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const Record = res.value.value.toString();
                allResults.push({ TxId: res.value.txId, Timestamp: res.value.timestamp, Record });
            }
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(allResults);
    }
}
