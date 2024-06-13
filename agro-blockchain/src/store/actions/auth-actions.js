import axios from "axios";
import Actions, {API_HOST} from '../constants'

export const login = ({ username, password }) => {
    return async dispatch => {
        dispatch({ type: Actions.LOGIN_REQUEST });
        try {
            const response = await axios.post(`${API_HOST}/auth/login`, { username, password });
            const { accessToken, fullName } = response.data;
            dispatch({
                type: Actions.LOGIN_SUCCESS,
                payload: { username, accessToken, fullName }
            });
        } catch (error) {
            console.log(error)
            dispatch({
                type: Actions.LOGIN_ERROR,
                error: error.message,
            });
        }
    };
}