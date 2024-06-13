import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {authReducer, qrScanReducer} from "./reducers";

const store = configureStore({
  reducer: {
    auth: authReducer,
    qrScan: qrScanReducer,
  }
});

const StoreProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default StoreProvider;