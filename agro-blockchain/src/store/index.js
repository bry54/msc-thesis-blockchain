import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authReducer from '../reducers/authReducer';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: [thunk],
});

const StoreProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default StoreProvider;

/*import {applyMiddleware, createStore} from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk';
import { Provider } from 'react-redux';
import Actions from './constants';

const initialState = {
    auth: {
        username: null,
        token: null,
        error: null,
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOGIN_SUCCESS:
            return {
                ...state,
                auth: {
                    username: action.payload.username,
                    token: action.payload.token
                }
            };
        case Actions.LOGIN_ERROR:
            return {
                ...state,
                auth: {
                    error: action.payload.error,
                }
            };
        case Actions.LOGOUT:
            return {
                ...state,
                auth: {
                    username: null,
                    token: null,
                    error: null,
                }
            };
        default:
            return state;
    }
};

const store = createStore(reducer, applyMiddleware(thunk));

const StoreProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

export default StoreProvider;
*/