import axios from "axios";
import Actions from '../constants'

export const login = ({ username, password }) => {
    return async dispatch => {
        dispatch({ type: Actions.LOGIN_REQUEST });
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            if (response.data) {
                // Simulate success response
                dispatch({
                    type: Actions.LOGIN_SUCCESS,
                    payload: { username }
                });
            } else {
                // Simulate failure response
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            dispatch({
                type: Actions.LOGIN_ERROR,
                error: error.message,
            });
        }
    };
}