const BASE_URL = 'http://192.168.1.102'
export const API_HOST = `${BASE_URL}:3020/api/v1`;
export const WEB_APP = `${BASE_URL}:3000/details`;

export const AuthActions = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_ERROR: 'LOGIN_ERROR',
    LOGOUT: 'LOGOUT',
}

export const QrScanActions = {
    QUERY_PRODUCT_SUCCESS: 'QUERY_PRODUCT_SUCCESS',
    QUERY_PRODUCT_ERROR: 'QUERY_PRODUCT_ERROR',
}