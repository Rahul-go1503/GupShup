// Check: rename AUTH_ROUTES, LOGIN_ROUTE

export const HOST = import.meta.env.VITE_SERVER_URL
export const AUTH_ROUTES = '/api/auth'
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`
export const CHECK_AUTH_ROUTE = `${AUTH_ROUTES}/checkAuth`

export const USER_ROUTES = '/api/user'
export const USER_INFO_ROUTE = `${USER_ROUTES}/`
export const SIGNUP_ROUTE = `${USER_ROUTES}/signup`
export const ALL_CONTACTS_ROUTE = `${USER_ROUTES}/contacts`
export const ALL_USER_ROUTE = `${USER_ROUTES}/all`
export const SEARCH_ROUTE = `${USER_ROUTES}/search`

export const MESSAGE_ROUTES = '/api/messages'
export const ALL_MESSAGES_BY_ID_ROUTE = `${MESSAGE_ROUTES}/all`

export const GROUP_ROUTES = 'api/group'
export const CREATE_NEW_GROUP = `${GROUP_ROUTES}/`
export const GET_GROUP_DETAILS = `${GROUP_ROUTES}/`
export const UPDATE_GROUP_DETAILS = `${GROUP_ROUTES}/details`
export const UPDATE_GROUP_ADMINS = `${GROUP_ROUTES}/admins`
export const DELETE_GROUP = `${GROUP_ROUTES}/`
export const ADD_NEW_MEMBER = `${GROUP_ROUTES}/member/add`
export const REMOVE_MEMBER = `${GROUP_ROUTES}/member/remove`
