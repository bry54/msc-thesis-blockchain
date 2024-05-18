/*
* SPDX-License-Identifier: Apache-2.0
*/
// Deterministic JSON.stringify()

import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import {Stakeholder} from "./stakeholder";

@Info({ title: 'StakeholderManager', description: 'Smart contract for managing Stakeholder items' })
export class StakeholderManagerContract extends Contract{

    @Transaction()
    public async initLedger(ctx: Context): Promise<void> {
        //Implement any logic to initialise the ledger
    }

    @Transaction()
    @Returns('void')
    public async createStakeholder(ctx: Context, stakeholderData: string): Promise<void> {
        const stakeholder: Stakeholder = JSON.parse(stakeholderData);
        await ctx.stub.putState(stakeholder.ID, Buffer.from(JSON.stringify(stakeholder)));
    }

    @Transaction(false)
    @Returns('string')
    public async queryStakeholder(ctx: Context, stakeholderId: string): Promise<string>{
        const stakeholderAsBytes = await ctx.stub.getState(stakeholderId);
        if (!stakeholderAsBytes || stakeholderAsBytes.length === 0) {
            throw new Error(`Stakeholder ${stakeholderId} does not exist`);
        }
        return stakeholderAsBytes.toString();
    }

    @Transaction(false)
    @Returns('string')
    public async queryAllStakeholders(ctx: Context): Promise<string> {
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
    async updateStakeholder(ctx: Context, stakeholderData: string) {
        const updateData: Stakeholder = JSON.parse(stakeholderData);

        const found = await this.queryStakeholder(ctx, updateData.ID);
        if (!found || found.length === 0) {
            throw new Error(`${updateData.ID} does not exist`);
        }
        let stakeholder = JSON.parse(found);
        stakeholder = {
            ...stakeholder,
            ...updateData
        }

        await ctx.stub.putState(stakeholder.ID, Buffer.from(JSON.stringify(stakeholder)));
    }

    @Transaction()
    async deleteStakeholder(ctx: Context, stakeholderData: string): Promise<void> {
        const toDelete: Stakeholder = JSON.parse(stakeholderData);

        const found = await this.queryStakeholder(ctx, toDelete.ID);
        if (!found || found.length === 0) {
            throw new Error(`${toDelete.ID} does not exist`);
        }

        ctx.stub.deleteState(toDelete.ID).then((res) => {
            console.log(`The stakeholder ${toDelete.ID} deleted`)
        });
    }

    @Transaction(false)
    async queryStakeholderHistory(ctx: Context, id: string): Promise<string> {
        console.log(id)
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
