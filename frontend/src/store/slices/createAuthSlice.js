import { axiosInstance } from "@/config/axios"
import connectSocket from "@/socket"
import { CHECK_AUTH_ROUTE, HOST, LOGIN_ROUTE, LOGOUT_ROUTE } from "@/utils/constants"
import { toast } from "sonner"

export const createAuthSlice = (set, get) => ({
    isLoggingIn: false,
    isCheckingAuth: true,   // very important to set as true
    userInfo: null,
    socket: null,

    login: async (data) => {
        set({ isLoginLoading: true })
        try {
            const res = await axiosInstance.post(LOGIN_ROUTE, data)
            set({ userInfo: res.data.user })

            //Check: userId
            const userId = res.data.user._id
            const socket = connectSocket(userId)
            // console.log(socket)
            set({ socket })
            // get().connectSocket()
            toast.success('User Login successfully!')
        } catch (err) {
            console.log(err)
            toast.error('Something went wrong', err.message)
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.get(LOGOUT_ROUTE)
            get().socket.disconnect()
            set({
                isLoggingIn: false,
                isCheckingAuth: false,
                userInfo: null,
                socket: null,
            })
            toast.success(res.data.message)
        } catch (err) {
            // console.error(err)
            toast.error('Something went wrong', err.message)
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
            console.error(err)
            // toast.error('Something went wrong', err.message)
        }
        finally {
            set({ isCheckingAuth: false })
        }
    }
})