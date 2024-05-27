
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
  FARM = 'FARM',
  REGULATION_CHECKER = 'REGULATORY ORGANIZATION',
  WHOLESALER = 'WHOLESALER',
  RESELLER = 'RESELLER',
}


