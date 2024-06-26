export type Summary = {
    [key: string]: string | Summary | Summary[];
};

export type Change = {
    field: string;
    change: string | Summary | Summary[];
};

export type RecordItem = {
    TxId: string;
    Timestamp: string;
    Record: any;
};

export type SummaryRecord = {
    TxId: string;
    Timestamp: string;
    Record: any;
    Summaries: Summary[];
};

export type TreeNode = {
    title: string;
    key: string;
    children?: TreeNode[];
};

export const compareRecords = (records: RecordItem[]): SummaryRecord[] =>{
    if (records.length === 0) return [];

    const summaryRecords: SummaryRecord[] = [];

    for (let i = 0; i < records.length; i++) {
        const currentRecordItem = records[i];
        const currentRecord = currentRecordItem.Record;
        let summaries: Summary[] = [];

        if (i === 0) {
            summaries.push({ summary: "Initial record" });
        } else {
            const previousRecord = records[i - 1].Record;
            const changes: Change[] = compareObjects(previousRecord, currentRecord);
            const summary: Summary = {};

            if (changes.length === 0) {
                summary.summary = "No changes";
            } else {
                changes.forEach((change) => {
                    summary[change.field] = change.change;
                });
            }

            summaries.push(summary);
        }

        summaryRecords.push({
            TxId: currentRecordItem.TxId,
            Timestamp: currentRecordItem.Timestamp,
            Record: currentRecord,
            Summaries: summaries,
        });
    }

    return summaryRecords;
}

export const transformSummariesToTreeData = (summaries: Summary[], parentKey = ''): TreeNode[] => {
    const treeData: TreeNode[] = [];

    summaries.forEach((summary, index) => {
        const key = `${parentKey}-${index}`;
        Object.entries(summary).forEach(([field, change]) => {
            if (typeof change === 'string') {
                treeData.push({ title: `${field}: ${change}`, key: `${key}-${field}` });
            } else if (Array.isArray(change)) {
                const children = transformSummariesToTreeData(change, `${key}-${field}`);
                treeData.push({ title: `${field}`, key: `${key}-${field}`, children });
            } else {
                const children = transformSummariesToTreeData([change], `${key}-${field}`);
                treeData.push({ title: `${field}`, key: `${key}-${field}`, children });
            }
        });
    });

    return treeData;
};

const compareObjects = (obj1: any, obj2: any): Change[] => {
    const changes: Change[] = [];
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    keys.forEach((key) => {
        const value1 = obj1[key];
        const value2 = obj2[key];

        if (typeof value1 === "object" && !Array.isArray(value1) && value1 !== null) {
            if (JSON.stringify(value1) !== JSON.stringify(value2)) {
                changes.push({
                    field: key,
                    change: {
                        summary: `Changed/Updated ${key}`,
                        details: compareObjects(value1, value2),
                    },
                });
            }
        } else if (Array.isArray(value1)) {
            if (JSON.stringify(value1) !== JSON.stringify(value2)) {
                const arrayChanges = compareArrays(value1, value2, key);
                if (arrayChanges.length > 0) {
                    changes.push({
                        field: key,
                        change: arrayChanges,
                    });
                }
            }
        } else {
            if (value1 !== value2) {
                changes.push({ field: key, change: `Changed/Updated ${key}: ${value1} => ${value2}` });
            }
        }
    });

    return changes;
}

const compareArrays = (arr1: any[], arr2: any[], parentKey: string): Summary[] => {
    const changes: Summary[] = [];

    const map1 = new Map(arr1.map((item) => [item.id, item]));
    const map2 = new Map(arr2.map((item) => [item.id, item]));

    arr1.forEach((item) => {
        if (!map2.has(item.id)) {
            if (parentKey === 'regulatoryChecks')
                changes.push({ summary: `Removed Regulatory Check: ${item?.notes} - ${ item?.signedBy?.stakeholder?.name || ''} (${ item?.signedBy?.stakeholder?.type})` });
            if (parentKey === 'transportationDetail')
                changes.push({ summary: `Removed Transportation: From ${item?.departure?.stakeholder?.name} TO ${ item?.destination?.stakeholder?.name}` });
            if (parentKey === 'pricingDetail')
                changes.push({ summary: `Removed Pricing Information: ${item?.stakeHolder?.name} : ${ item?.pricePerUnit}` });
        }
    });

    arr2.forEach((item) => {
        if (!map1.has(item.id)) {
            if (parentKey === 'regulatoryChecks')
                changes.push({ summary: `New Regulatory Check: ${item?.notes} - ${ item?.signedBy?.stakeholder?.name || ''} (${ item?.signedBy?.stakeholder?.type})` });
            if (parentKey === 'transportationDetail')
                changes.push({ summary: `New Transportation: From ${item?.departure?.stakeholder?.name} TO ${ item?.destination?.stakeholder?.name}` });
            if (parentKey === 'pricingDetail')
                changes.push({ summary: `New Pricing Information: ${item?.stakeHolder?.name} : ${ item?.pricePerUnit}` });
        } else {
            const itemChanges = compareObjects(map1.get(item.id), item);
            if (itemChanges.length > 0) {
                changes.push({ summary: `Updated in array: ${JSON.stringify(itemChanges)}` });
            }
        }
    });

    return changes;
}