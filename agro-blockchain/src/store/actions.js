import axios from "axios";
import Actions from './constants'

export const login = ({ username, password }) => {
    return async dispatch => {
        dispatch({ type: Actions.LOGIN_REQUEST });
        try {
            if (username === 'admin' && password === 'password') {
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