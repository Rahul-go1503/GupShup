import { axiosInstance } from "@/config/axios"
import connectSocket, { getSocket } from "@/socket"
import { CHECK_AUTH_ROUTE, FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE, RESEND_VERIFICATION_LINK_ROUTE, RESET_PASSWORD_ROUTE, SIGNUP_ROUTE, VERIFY_EMAIL_ROUTE } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."

const initialState = {
    authLoading: false,
    isCheckingAuth: true,   // very important to set as true

    userInfo: null,
    socket: null,
    email: null,
    verifyEmailMessage: ''
}

export const createAuthSlice = (set, get) => ({
    ...initialState,

    signup: async (data, navigate) => {
        try {
            set({ authLoading: true })
            await axiosInstance.post(SIGNUP_ROUTE, data)
            toast.success('signup successful!')
            navigate('/verify-email')
            set({ email: data.email })
        }
        catch (err) {
            // console.log(err)
            toast.error(err.response?.data.message)
        }
        finally {
            set({ authLoading: false })
        }
    },

    setVerifyEmailMessage: (message) => { set({ verifyEmailMessage: message }) },
    resendVerificationLink: async (email, navigate) => {
        try {
            const res = await axiosInstance.post(RESEND_VERIFICATION_LINK_ROUTE, { email })
            // console.log(res)
            set({ verifyEmailMessage: res?.data?.message })
            // return res?.data?.message
        }
        catch (err) {
            // console.log(err)
            if (err.response?.data.error == 'Email is already verified.') {
                set({ verifyEmailMessage: `${err.response?.data.error}. Redirecting to login page...` })
                setTimeout(() => navigate('/login', { replace: true }), 3000) // Redirect to login after 3s
            }
            else set({ verifyEmailMessage: err.response?.data.error || "Something went wrong" })
        }
    },

    verifyEmail: async (token, navigate) => {
        set({ verifyEmailMessage: 'some msg' })
        try {
            const response = await axiosInstance.get(`${VERIFY_EMAIL_ROUTE}/?token=${token}`);
            setTimeout(() => navigate('/login', { replace: true }), 3000) // Redirect to login after 3s
            set({ verifyEmailMessage: `${response?.data.message}. Redirecting to login page...` })
        } catch (error) {
            if (err.response?.data.error == 'Email is already verified.') {
                set({ verifyEmailMessage: `${err.response?.data.error}. Redirecting to login page...` })
                console.log(verifyEmailMessage)
                setTimeout(() => navigate('/login', { replace: true }), 5000) // Redirect to login after 3s
            }
            else set({ verifyEmailMessage: err.response?.data.error || "Something went wrong" })
        }
    },

    forgotPassword: async (email) => {
        try {
            set({ authLoading: true })
            const response = await axiosInstance.post(FORGOT_PASSWORD_ROUTE, { email })
            // console.log(response)
            return response.data
        }
        catch (err) {
            // console.error(err)
            toast.error(err.response?.data.message)

        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await axiosInstance.post(RESET_PASSWORD_ROUTE, { token, newPassword });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data.message)
            return error.response?.data || { message: "Something went wrong" };

        }
    },
    login: async (data, navigate) => {
        try {
            set({ authLoading: true })
            const res = await axiosInstance.post(LOGIN_ROUTE, data)
            set({ userInfo: res.data.user })
            connectSocket()
            const socket = getSocket()
            set({ socket })
            toast.success('User Login successfully!')
        } catch (err) {
            if (err.status === 403) {
                navigate('/verify-email')
                set({ email: data.email })
                set({ verifyEmailMessage: 'Please verify your email to continue' })
            }
            else toast.error(err.response?.data.message)
        }
        finally {
            set({ authLoading: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.get(LOGOUT_ROUTE)
            get().socket.disconnect()

            const { resetStore } = useAppStore.getState()
            resetStore()
            set({ isCheckingAuth: false })
            toast.success(res.data.message)
        } catch (err) {
            toast.error(err.response?.data.message)
        }
    },

    checkAuth: async () => {
        try {
            let res = await axiosInstance.get(CHECK_AUTH_ROUTE)
            set({ userInfo: res.data.user })
            connectSocket()
            const socket = getSocket()
            set({ socket })
        }
        catch (err) {
            // console.error(err)
            // toast.error('Something went wrong', err.message)
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    reset: () => {
        set(initialState)
    }
})