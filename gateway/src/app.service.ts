import { Injectable } from '@nestjs/common';
import { uptime } from 'process';

type Summary = {
  [key: string]: string | Summary | Summary[];
};

type Change = {
  field: string;
  change: string | Summary | Summary[];
};

@Injectable()
export class AppService {
  getRootMessage(): unknown {
    return 'Gateway app';
  }

  getHealthCheck(): unknown {
    return {
      status: 'alive',
      upTime: uptime(),
    };
  }

  recCompare() {
    return [
      {
        TxId: 'firstTransaction',
        Timestamp: 'someTimeStampFromHyperledgerFabric',
        Record: {
          "id": "e7331ece-ab36-4327-afd0-2a6fcd3b62b2",
          "createdAt": "2024-06-20T09:59:37.929Z",
          "updatedDate": "2024-06-21T11:09:29.000Z",
          "deletedDate": null,
          "deletedBy": null,
          "createdBy": "b15c6056-f847-444e-9753-b44007d3337a",
          "updatedBy": "b15c6056-f847-444e-9753-b44007d3337a",
          "product": {
            "name": "Oranges",
            "category": "Citrus Fruit"
          },
          "origin": {
            "id": "263cfc84-9c63-487f-b1e7-87e8ba593c0e",
            "name": "Mahiya & Sons Wholesalers",
            "type": "FARM ORGANIZATION",
            "contactNumber": "+90 533 000 79 19",
            "location": "KKTC, Lefke"
          },
          "planting": {
            "quantity": "400 pieces",
            "date": "2024-06-16T21:00:00.000Z"
          },
          "harvesting": {},
          "regulatoryChecks": [],
          "transportationDetail": [],
          "pricingDetail": []
        }
      },{
        TxId: 'secondTransaction',
        Timestamp: 'someTimeStampFromHyperledgerFabric',
        Record: {
          "id": "e7331ece-ab36-4327-afd0-2a6fcd3b62b2",
          "createdAt": "2024-06-20T09:59:37.929Z",
          "updatedDate": "2024-06-21T11:09:29.000Z",
          "deletedDate": null,
          "deletedBy": null,
          "createdBy": "b15c6056-f847-444e-9753-b44007d3337a",
          "updatedBy": "b15c6056-f847-444e-9753-b44007d3337a",
          "product": {
            "name": "Oranges",
            "category": "Citrus Fruit"
          },
          "origin": {
            "id": "263cfc84-9c63-487f-b1e7-87e8ba593c0e",
            "name": "Mahiya & Sons Wholesalers",
            "type": "FARM ORGANIZATION",
            "contactNumber": "+90 533 000 79 19",
            "location": "KKTC, Lefke"
          },
          "planting": {
            "quantity": "400 pieces",
            "date": "2024-06-16T21:00:00.000Z"
          },
          "harvesting": {},
          "regulatoryChecks": [{
            "notes": "This is a first check from PC.",
            "updatedBy": "6e1744ee-5b3a-4fe4-872d-b00f69cd53e3",
            "signedBy": {
              "id": "6e1744ee-5b3a-4fe4-872d-b00f69cd53e3",
              "fullName": "Nyasha Mlambo",
              "stakeholder": {
                "id": "7c80b05a-64cd-47ca-824f-0d99e7f542e6",
                "type": "FARM ORGANIZATION",
                "location": "KKTC, Girne",
                "contactNumber": "+90 533 000 79 21"
              }
            },
            "id": "b3168f82-917c-433f-a85b-6575f39846b3",
            "date": "2024-06-20T15:45:38.726Z"
          }],
          "transportationDetail": [],
          "pricingDetail": []
        }
      },{
        TxId: 'thirdTransaction',
        Timestamp: 'someTimeStampFromHyperledgerFabric',
        Record: {
          "id": "e7331ece-ab36-4327-afd0-2a6fcd3b62b2",
          "createdAt": "2024-06-20T09:59:37.929Z",
          "updatedDate": "2024-06-21T11:09:29.000Z",
          "deletedDate": null,
          "deletedBy": null,
          "createdBy": "b15c6056-f847-444e-9753-b44007d3337a",
          "updatedBy": "b15c6056-f847-444e-9753-b44007d3337a",
          "product": {
            "name": "Oranges",
            "category": "Citrus Fruit"
          },
          "origin": {
            "id": "263cfc84-9c63-487f-b1e7-87e8ba593c0e",
            "name": "Mahiya & Sons Wholesalers",
            "type": "FARM ORGANIZATION",
            "contactNumber": "+90 533 000 79 19",
            "location": "KKTC, Lefke"
          },
          "planting": {
            "quantity": "400 pieces",
            "date": "2024-06-16T21:00:00.000Z"
          },
          "harvesting": {},
          "regulatoryChecks": [{
            "notes": "This is a first check from PC.",
            "updatedBy": "6e1744ee-5b3a-4fe4-872d-b00f69cd53e3",
            "signedBy": {
              "id": "6e1744ee-5b3a-4fe4-872d-b00f69cd53e3",
              "fullName": "Nyasha Mlambo",
              "stakeholder": {
                "id": "7c80b05a-64cd-47ca-824f-0d99e7f542e6",
                "type": "FARM ORGANIZATION",
                "location": "KKTC, Girne",
                "contactNumber": "+90 533 000 79 21"
              }
            },
            "id": "b3168f82-917c-433f-a85b-6575f39846b3",
            "date": "2024-06-20T15:45:38.726Z"
          }],
          "transportationDetail": [{
            "departure": {
              "notes": "Another test",
              "stakeholderId": "70218aca-edcd-4661-9d6c-2f7cc0a35187",
              "date": "2024-06-21",
              "stakeholder": {
                "id": "70218aca-edcd-4661-9d6c-2f7cc0a35187",
                "name": "KKTC Food Authority",
                "type": "REGULATORY AUTHORITY ORGANIZATION",
                "contactNumber": "+90 533 000 60 00",
                "location": "KKTC, Nicosia"
              },
              "responsiblePerson": {
                "id": "b15c6056-f847-444e-9753-b44007d3337a",
                "fullName": "Administrator"
              }
            },
            "destination": {
              "notes": "To mlambo farm",
              "stakeholderId": "7c80b05a-64cd-47ca-824f-0d99e7f542e6",
              "date": "2024-06-21",
              "stakeholder": {
                "id": "7c80b05a-64cd-47ca-824f-0d99e7f542e6",
                "name": "Mlambo Farm",
                "type": "FARM ORGANIZATION",
                "contactNumber": "+90 533 000 79 21",
                "location": "KKTC, Girne"
              },
              "responsiblePerson": {
                "id": "b15c6056-f847-444e-9753-b44007d3337a",
                "fullName": "Administrator",
                "role": "ADMINISTRATOR"
              }
            },
            "updatedBy": "b15c6056-f847-444e-9753-b44007d3337a",
            "id": "17864635-bc0a-4f9c-8bda-dc9827f2c0ac"
          }, {
            "departure": {
              "notes": "Another test",
              "stakeholderId": "70218aca-edcd-4661-9d6c-2f7cc0a35187",
              "date": "2024-06-21",
              "stakeholder": {
                "id": "70218aca-edcd-4661-9d6c-2f7cc0a35187",
                "name": "KKTC Food Authority",
                "type": "REGULATORY AUTHORITY ORGANIZATION",
                "contactNumber": "+90 533 000 60 00",
                "location": "KKTC, Nicosia"
              },
              "responsiblePerson": {
                "id": "b15c6056-f847-444e-9753-b44007d3337a",
                "fullName": "Administrator"
              }
            },
            "destination": {
              "notes": "To mlambo farm",
              "stakeholderId": "7c80b05a-64cd-47ca-824f-0d99e7f542e6",
              "date": "2024-06-21",
              "stakeholder": {
                "id": "7c80b05a-64cd-47ca-824f-0d99e7f542e6",
                "name": "Mlambo Farm",
                "type": "FARM ORGANIZATION",
                "contactNumber": "+90 533 000 79 21",
                "location": "KKTC, Girne"
              },
              "responsiblePerson": {
                "id": "b15c6056-f847-444e-9753-b44007d3337a",
                "fullName": "Administrator",
                "role": "ADMINISTRATOR"
              }
            },
            "updatedBy": "b15c6056-f847-444e-9753-b44007d3337a",
            "id": "17864635-bc0a-4f9c-8bda-dc9827f2c0ac"
          }],
          "pricingDetail": []
        }
      },
    ];
  }

  compareRecords(records: any[]): Summary[] {
    if (records.length === 0) return [];

    const summaries: Summary[] = [];

    for (let i = 0; i < records.length; i++) {
      const currentRecord = records[i].Record || records[i];
      if (i === 0) {
        summaries.push({ summary: "Initial record" });
      } else {
        const previousRecord = records[i - 1].Record || records[i - 1];
        const changes: Change[] = this.compareObjects(previousRecord, currentRecord);
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
    }

    return summaries;
  }

  compareObjects(obj1: any, obj2: any): Change[] {
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
              summary: `Updated ${key}`,
              details: this.compareObjects(value1, value2),
            },
          });
        }
      } else if (Array.isArray(value1)) {
        if (JSON.stringify(value1) !== JSON.stringify(value2)) {
          const arrayChanges = this.compareArrays(value1, value2, key);
          if (arrayChanges.length > 0) {
            changes.push({
              field: key,
              change: arrayChanges,
            });
          }
        }
      } else {
        if (value1 !== value2) {
          changes.push({ field: key, change: `Updated ${key}: ${value1} => ${value2}` });
        }
      }
    });

    return changes;
  }

  compareArrays(arr1: any[], arr2: any[], parentKey: string): Summary[] {
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
        const itemChanges = this.compareObjects(map1.get(item.id), item);
        if (itemChanges.length > 0) {
          changes.push({ summary: `Updated in array: ${JSON.stringify(itemChanges)}` });
        }
      }
    });

    return changes;
  }

}
