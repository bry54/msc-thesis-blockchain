import {DataSetProps, ErrorProps, ModalVisibilityProps, ProcessingProps} from "@/app/lib/interfaces";
import {DataSetName, ModalName, ProcessName} from "@/app/lib/enums";

export const dataSetInitialState: DataSetProps = {
    [DataSetName.ONE_RESOURCE]: null,
    [DataSetName.ALL_RESOURCES]: [],
    [DataSetName.RESOURCE_HISTORY]: [],
}

export const modalsInitialState: ModalVisibilityProps = {
    [ModalName.ADD_MODAL]: false,
    [ModalName.UPDATE_MODAL]: false,
    [ModalName.DELETE_MODAL]: false
}

export const processingInitialState: ProcessingProps = {
    [ProcessName.LOADING_ALL]: true,
    [ProcessName.LOADING_ONE]: false,
    [ProcessName.ADDING_ONE]: false,
    [ProcessName.UPDATING_ONE]: false,
    [ProcessName.DELETING_ONE]: false,
    [ProcessName.LOADING_HISTORY]: false,
}

export const errorsInitialState: ErrorProps = {
    [ProcessName.ADDING_ONE]: null,
    [ProcessName.DELETING_ONE]: null,
    [ProcessName.LOADING_ALL]: null,
    [ProcessName.LOADING_HISTORY]: null,
}