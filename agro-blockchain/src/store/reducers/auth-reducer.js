import Actions from '../constants'

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case Actions.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        user: action.payload,
        error: null,
      };
    case Actions.LOGIN_ERROR:
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

export default authReducer;