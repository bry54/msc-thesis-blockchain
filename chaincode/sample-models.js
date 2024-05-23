// Consider using tabs to show these sections in product
// Antd Components to use: Lists, Descriptions, Empty, Message, Timeline, Collapse, Form
const production = {
  batchId: 'uuid',
  product: {
    productId: 'uuid',
    name: 'string',
  },
  origin: {
    farmId: 'uuid',
    name: 'string'
  },
  planting: {
    quantity: 'number',
    date: '2024-05-01T00:00:00Z'
  },
  harvesting: {
    quantity: 'number',
    date: '2024-06-01T00:00:00Z'
  },
  regulatoryChecks: [
    {
      checkId: 'uuid',
      notes: 'string',
      date: '2024-07-01T00:00:00Z',
      signedBy: {
        userId: 'uuid',
        userName: 'string',
        companyId: 'uuid',
        companyName: 'string'
      },
    }
  ],
  transportationDetail: [
    {
      transportationId: 'uuid',
      notes: 'string',
      departure: {
        location: {
          name: "Farm A",
          address: "123 Farm Lane, Rural Town",
          coordinates: {
            latitude: "xx.xxxx",
            longitude: "yy.yyyy"
          }
        },
        time: "2024-05-01T08:00:00Z"
      },
      destination: {
        location: {
          name: "Wholesale B",
          address: "456 Wholesale Blvd, City",
          coordinates: {
            latitude: "aa.aaaa",
            longitude: "bb.bbbb"
          }
        },
        time: "2024-05-01T16:00:00Z"
      },
    }
  ],
  pricingDetail: [
    {
      entity: 'farmer',
      name: 'farmerName',
      pricePerKg: '$5.00'
    },
    {
      entity: 'wholesaler',
      name: 'wholesalerName',
      pricePerKg: '$7.00'
    },
    {
      entity: 'market',
      name: 'marketName',
      pricePerKg: '$10.00'
    }
  ]
}
