import axios from "axios";
import {API_HOST, QrScanActions} from '../constants'

export const queryOne = (id) => {
    return async dispatch => {
        try {
            const response = await axios.get(`${API_HOST}/production/${id}`).catch(e =>{
                throw e;
            });
            const product = response.data;
            dispatch({
                type: QrScanActions.QUERY_PRODUCT_SUCCESS,
                payload: product
            });
        } catch (error) {
            console.log(JSON.stringify(error))
            dispatch({
                type: QrScanActions.QUERY_PRODUCT_ERROR,
                error: error.message,
            });
        }
    };
}