import { createStore } from 'redux';
import { Provider } from 'react-redux';

const initialState = {
    isLoggedIn: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isLoggedIn: true };
        case 'LOGOUT':
            return { ...state, isLoggedIn: false };
        default:
            return state;
    }
};

const store = createStore(reducer);

const StoreProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

export default StoreProvider;
