import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth-reducer';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
  }
});

const StoreProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default StoreProvider;