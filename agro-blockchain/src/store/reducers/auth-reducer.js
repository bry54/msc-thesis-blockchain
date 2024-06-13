import {AuthActions} from "../constants";

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  user: {
    username: null,
    accessToken: null,
    fullName: null
  },
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthActions.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        user: action.payload,
        error: null,
      };
    case AuthActions.LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        user: null,
        error: action.error,
      };
    default:
      return state;
  }
};