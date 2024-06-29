import axios from "axios"

export const ROOT = import.meta.env.VITE_API_ROOT

export const LOGIN = '/auth/login'
export const LOGOUT = '/auth/logout'

export const SYSTEM_STATUS = '/system/get-status'
export const SYSTEM_START = '/system/start'
export const SYSTEM_STOP = '/system/stop'

export const TOKEN_STATUS = '/token/get-status'
export const TOKEN_STOP = '/token/logout'
export const TOKEN_AUTH_CODE = '/token/get-login-link'
export const TOKEN_SET_AUTH_CODE = '/token/set-auth-code'
export const TOKEN_REFRESH = '/token/refresh-access-token'

export const FUND_GET = '/funds/get'

export const LOG_FILES = '/logs/all'
export const LOG_FILE_DOWNLOAD = '/logs/download'

export const IDEAS_TODAY = '/idea/today'
export const IDEA_DELETE = '/idea/delete'

export const ORDERS_GET = '/order/all'
export const ORDER_BUY = '/order/buy'
export const ORDER_CANCEL = '/order/cancel'
export const ORDER_SELL = '/order/sell'

export const AUTO_TRADE_STATUS = '/auto-trade/get-status'
export const AUTO_TRADE_ON = '/auto-trade/on'
export const AUTO_TRADE_OFF = '/auto-trade/off'


export const request = axios.create({
    baseURL: ROOT,
    withCredentials: true
})
request.interceptors.response.use(res => res.data, err => {
    if (err.response.status === 401) {
        window.location.href = '/login'
    }
    return Promise.reject(err.response?.data?.message ? err.response.data : err)
})

export default request

let acknowledge_fn = _ => _
export const connect_api_acknowledge = (fn) => { acknowledge_fn = fn }
export const api_acknowledge = (message) => acknowledge_fn(message)