import {QrScanActions} from "../constants";

const initialState = {
  isLoading: true,
  product: null,
  error: null,
};

export const qrScanReducer = (state = initialState, action) => {
  switch (action.type) {
    case QrScanActions.QUERY_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        product: action.payload,
      };
    case QrScanActions.QUERY_PRODUCT_ERROR:
      return {
        ...state,
        isLoading: false,
        product: action.payload,
      };
    default:
      return state;
  }
};