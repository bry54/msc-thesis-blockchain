import axios from "axios";
import Actions from './constants'

export const login = async (authCredentials) => {
    return async (dispatch) => {
        try {
            const response = {}//await axios.post('/api/login', authCredentials);
            dispatch({
                type: Actions.LOGIN_SUCCESS,
                payload: response.data
            });
        } catch (e) {
            console.log(e)
            dispatch({
                type: Actions.LOGIN_ERROR,
                payload: e
            });
        }
    }
}