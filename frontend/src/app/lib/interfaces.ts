import {DataSetName, ModalName, ProcessName} from "@/app/lib/enums";

export interface TokenDto {
  sub: string;
  username: string;
  role: string;
  organizationId: string
}

export interface SignInResponseDto {
  fullName: string;
  accessToken: string;
}

export interface ModalVisibilityProps {
  [ModalName.ADD_MODAL]?: boolean;
  [ModalName.UPDATE_MODAL]?: boolean;
  [ModalName.DELETE_MODAL]?: boolean;
}

export interface ProcessingProps {
  [ProcessName.LOADING_ALL]?: boolean;
  [ProcessName.LOADING_ONE]?: boolean;
  [ProcessName.ADDING_ONE]?: boolean;
  [ProcessName.UPDATING_ONE]?: boolean;
  [ProcessName.DELETING_ONE]?: boolean;
  [ProcessName.LOADING_HISTORY]?: boolean;
}

export interface DataSetProps {
  [DataSetName.ONE_RESOURCE]: any | null;
  [DataSetName.ALL_RESOURCES]: any[];
  [DataSetName.RESOURCE_HISTORY]: any[];
}

export interface ErrorProps {
  [ProcessName.ADDING_ONE]?: any;
  [ProcessName.DELETING_ONE]?: any;
  [ProcessName.LOADING_ALL]?: any;
  [ProcessName.LOADING_ONE]?: any;
  [ProcessName.UPDATING_ONE]?: any;
  [ProcessName.LOADING_HISTORY]?: any;
}