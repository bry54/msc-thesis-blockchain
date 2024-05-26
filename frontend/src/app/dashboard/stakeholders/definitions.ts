export enum ModalName {
  ADD_MODAL = 'addModal',
  UPDATE_MODAL = 'updateModal',
  DELETE_MODAL = 'deleteModal',
}

export interface ModalVisibilityProps {
  [ModalName.ADD_MODAL]: boolean;
  [ModalName.UPDATE_MODAL]: boolean;
  [ModalName.DELETE_MODAL]: boolean;
}

export const modalsInitialState: ModalVisibilityProps = {
  [ModalName.ADD_MODAL]: false,
  [ModalName.UPDATE_MODAL]: false,
  [ModalName.DELETE_MODAL]: false
}

export enum ProcessingName {
  LOADING_STAKEHOLDERS = 'loadingStakeholders',
  LOADING_STAKEHOLDER = 'loadingStakeholder',
  DELETING_STAKEHOLDER = 'deletingStakeholder',
  UPDATING_STAKEHOLDER = 'updatingStakeholders',
  ADDING_STAKEHOLDER = 'addingStakeholder',
}

export interface ProcessingProps {
  [ProcessingName.LOADING_STAKEHOLDERS]: boolean;
  [ProcessingName.LOADING_STAKEHOLDER]: boolean;
  [ProcessingName.ADDING_STAKEHOLDER]: boolean;
  [ProcessingName.UPDATING_STAKEHOLDER]: boolean;
  [ProcessingName.DELETING_STAKEHOLDER]: boolean;
}

export const processingInitialState: ProcessingProps = {
  [ProcessingName.LOADING_STAKEHOLDERS]: true,
  [ProcessingName.LOADING_STAKEHOLDER]: false,
  [ProcessingName.ADDING_STAKEHOLDER]: false,
  [ProcessingName.UPDATING_STAKEHOLDER]: false,
  [ProcessingName.DELETING_STAKEHOLDER]: false,
}

export enum DataSetName {
  STAKEHOLDERS = 'stakeholders',
  STAKEHOLDER = 'stakeholder'
}

export interface DataSetProps {
  [DataSetName.STAKEHOLDER]: any | null;
  [DataSetName.STAKEHOLDERS]: any[];
}

export const dataSetInitialState: DataSetProps = {
  [DataSetName.STAKEHOLDER]: null,
  [DataSetName.STAKEHOLDERS]: [],
}

export interface ErrorProps {
  [ProcessingName.ADDING_STAKEHOLDER]: any;
  [ProcessingName.DELETING_STAKEHOLDER]: any;
}

export const errorsInitialState: ErrorProps = {
  [ProcessingName.ADDING_STAKEHOLDER]: null,
  [ProcessingName.DELETING_STAKEHOLDER]: null,
}

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


