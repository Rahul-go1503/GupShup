import { axiosInstance } from "@/config/axios"
import connectSocket from "@/socket"
import { CHECK_AUTH_ROUTE, FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE, RESEND_VERIFICATION_LINK_ROUTE, RESET_PASSWORD_ROUTE, SIGNUP_ROUTE, VERIFY_EMAIL_ROUTE } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."

const initialState = {
    authLoading: false,
    isCheckingAuth: true,   // very important to set as true

    userInfo: null,
    socket: null,
    email: null,
    verifyEmailMessage: 'A verification link has been sent to your email. Please verify your email to continue.'
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
                setTimeout(() => navigate('/login', { replace: true }), 3000) // Redirect to login after 3s
                set({ verifyEmailMessage: `${err.response?.data.error}. Redirecting to login page...` })
            }
            else set({ verifyEmailMessage: err.response?.data.error || "Something went wrong" })
            // return err.response?.data.error || "Something went wrong"
        }
    },

    verifyEmail: async (token, navigate) => {
        try {
            const response = await axiosInstance.get(`${VERIFY_EMAIL_ROUTE}/?token=${token}`);
            setTimeout(() => navigate('/login', { replace: true }), 3000) // Redirect to login after 3s
            set({ verifyEmailMessage: `${response?.data.message}. Redirecting to login page...` })
            // return `${response?.data.message}. Redirecting to login page...`;
        } catch (error) {
            // console.log(error)
            set({ verifyEmailMessage: error.response?.data.message || "Something went wrong" })
            // return error.response?.data.message || { message: "Something went wrong" };
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
            // console.log(response)
            return response.data;
        } catch (error) {
            // console.error(error)
            toast.error(error.response?.data.message)
            return error.response?.data || { message: "Something went wrong" };

        }
    },
    login: async (data, navigate) => {
        try {
            // console.log(data)
            set({ authLoading: true })
            const res = await axiosInstance.post(LOGIN_ROUTE, data)
            set({ userInfo: res.data.user })

            //Check: userId
            const { _id: userId, firstName: userName } = res.data.user
            // console.log('userId : ', userId, 'userName : ', userName)
            const socket = connectSocket()
            // console.log(socket)
            set({ socket })
            // get().connectSocket()
            toast.success('User Login successfully!')
        } catch (err) {
            // console.log(err)
            if (err.status === 403) {
                navigate('/verify-email')
                set({ email: data.email })
                set({ verifyEmailMessage: 'Please verify your email to continue' })
            }
            else toast.error(err.response?.data.message)
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.get(LOGOUT_ROUTE)
            get().socket.disconnect()

            const { resetStore } = useAppStore.getState()
            // set({ ...initialState, isCheckingAuth: false })
            resetStore()
            set({ isCheckingAuth: false })
            toast.success(res.data.message)
        } catch (err) {
            // console.error(err)
            toast.error(err.response?.data.message)
        }
    },

    checkAuth: async () => {
        try {
            let res = await axiosInstance.get(CHECK_AUTH_ROUTE)
            // console.log(res)
            // if (res.status == 401) set({ userInfo: null })
            // else 
            set({ userInfo: res.data.user })
            const userId = res.data.user._id
            const socket = connectSocket(userId)
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