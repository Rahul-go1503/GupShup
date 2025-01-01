// Check: rename AUTH_ROUTES, LOGIN_ROUTE

export const HOST = import.meta.env.VITE_SERVER_URL
export const AUTH_ROUTE = '/api/auth'
export const LOGIN_URL = `${AUTH_ROUTE}/login`
export const LOGOUT_URL = `${AUTH_ROUTE}/logout`

export const USER_ROUTE = '/api/user'
export const USER_INFO_ROUTE = `${USER_ROUTE}/`
export const SIGNUP_URL = `${USER_ROUTE}/signup`
export const ALL_USER_ROUTE = `${USER_ROUTE}/all`
