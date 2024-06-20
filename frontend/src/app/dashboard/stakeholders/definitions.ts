
export const newStakeholderFields = [
  {
    label: 'Organization name',
    type: 'text',
    id: 'name',
    autoComplete: ''
  },
  {
    label: 'Contact Number',
    type: 'tel',
    id: 'contactNumber',
    autoComplete: ''
  },
  {
    label: 'Address Location',
    type: 'text',
    id: 'location',
    autoComplete: '',
    dataSource: ''
  },
  {
    label: 'Organization Type',
    type: 'select',
    id: 'type',
    autoComplete: '',
    dataSource: 'types'
  }
]

export enum OrganizationTypes {
  FARM = 'FARM ORGANIZATION',
  WHOLESALER = 'WHOLESALER ORGANIZATION',
  RETAILER = 'RETAILER ORGANIZATION',
  REGULATORY_AUTHORITY = 'REGULATORY AUTHORITY ORGANIZATION',
  LOGISTICS_PROVIDER = 'TRANSPORTER/LOGISTICS PROVIDER ORGANIZATION',
}


