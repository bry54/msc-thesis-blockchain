import axios from "axios";
import {API_HOST, AuthActions} from '../constants'

export const login = ({ username, password }) => {
    return async dispatch => {
        dispatch({ type: AuthActions.LOGIN_REQUEST });
        try {
            const response = await axios.post(`${API_HOST}/auth/login`, { agent: 'MOBILE', username, password });
            const { accessToken, fullName } = response.data;
            dispatch({
                type: AuthActions.LOGIN_SUCCESS,
                payload: { username, accessToken, fullName }
            });
        } catch (error) {
            console.log(error)
            dispatch({
                type: AuthActions.LOGIN_ERROR,
                error: error.message,
            });
        }
    };
}