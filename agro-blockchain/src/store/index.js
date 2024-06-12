import { createStore } from 'redux';
import { Provider } from 'react-redux';

const initialState = {
    isLoggedIn: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isLoggedIn: true, username: action.payload };
        case 'LOGOUT':
            return { ...state, isLoggedIn: false, username: null };
        default:
            return state;
    }
};

export const login = (username) => ({
    type: 'LOGIN',
    payload: username,
});

export const logout = () => ({
    type: 'LOGOUT',
});

const store = createStore(reducer);

const StoreProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

export default StoreProvider;
