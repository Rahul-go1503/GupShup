// Check: rename AUTH_ROUTES, LOGIN_ROUTE

export const HOST = import.meta.env.VITE_SERVER_URL
export const AUTH_ROUTES = '/api/auth'
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const RESEND_VERIFICATION_LINK_ROUTE = `${AUTH_ROUTES}/resend-verification`
export const VERIFY_EMAIL_ROUTE = `${AUTH_ROUTES}/verify-email`
export const FORGOT_PASSWORD_ROUTE = `${AUTH_ROUTES}/forgot-password`
export const RESET_PASSWORD_ROUTE = `${AUTH_ROUTES}/reset-password`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`
export const CHECK_AUTH_ROUTE = `${AUTH_ROUTES}/checkAuth`


// todo: fix these routes
export const USER_ROUTE = '/api/user'
export const USER_INFO_ROUTE = `${USER_ROUTE}/`
export const ALL_CONTACTS_ROUTE = `${USER_ROUTE}/contacts`
export const ALL_USER_ROUTE = `${USER_ROUTE}/all`
export const SEARCH_ROUTE = `${USER_ROUTE}/search`
export const USER_PROFILE_ROUTE = `${USER_ROUTE}/profile/`


export const MESSAGE_ROUTES = '/api/messages'
// Todo: should be get request with :id
export const ALL_MESSAGES_BY_ID_ROUTE = `${MESSAGE_ROUTES}/all`

export const GROUP_ROUTES = 'api/group'
export const CREATE_NEW_GROUP = `${GROUP_ROUTES}/`
export const GET_GROUP_DETAILS = `${GROUP_ROUTES}/`
export const GROUP_PROFILE_ROUTE = `${GROUP_ROUTES}/profile`

export const GENERATE_PRESIGNED_URL_ROUTE = `/api/upload/generatePreSignedUrl`