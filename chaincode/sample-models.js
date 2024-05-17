const production = {
  batchId: 'uuid',
  product: {
    productId: 'uuid',
    name: 'string',
  },
  farm: {
    farmId: 'uuid',
    name: 'string'
  },
  planting: {
    quantity: 'number',
    date: 'string'
  },
  harvesting: {
    quantity: 'number',
    date: 'string'
  },
  regulatoryChecks: [
    {
      checkId: 'uuid',
      detail: 'string',
      date: 'string',
      signedBy: {
        userId: 'uuid',
        userName: 'string',
        companyId: 'uuid',
        companyName: 'uuid'
      },
    }
  ],
  transportationDetail: [
    {
      transportationId: 'uuid',
      notes: 'string',
      departure: {
        location: "Farm A",
        time: "2024-05-01T08:00:00Z"
      },
      destination: {
        location: "Wholesale B",
        time: "2024-05-01T16:00:00Z",
      },
    }
  ],
  pricingDetail: {
    ['farmerName']: '$5.00 / kg',
    ['wholesalerName']: '$7.00 / kg',
    ['marketName']: '$10.00 / kg'
  }
}