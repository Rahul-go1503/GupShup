import { axiosInstance } from "@/config/axios"
import connectSocket from "@/socket"
import { CHECK_AUTH_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."

const initialState = {
    isLoginLoading: false,
    isCheckingAuth: true,   // very important to set as true

    userInfo: null,
    socket: null,
}
export const createAuthSlice = (set, get) => ({
    ...initialState,
    login: async (data) => {
        try {
            // console.log(data)
            set({ isLoginLoading: true })
            const res = await axiosInstance.post(LOGIN_ROUTE, data)
            set({ userInfo: res.data.user })

            //Check: userId
            const { _id: userId, firstName: userName } = res.data.user
            console.log('userId : ', userId, 'userName : ', userName)
            const socket = connectSocket()
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

            const { resetStore } = useAppStore.getState()
            // set({ ...initialState, isCheckingAuth: false })
            resetStore()
            set({ isCheckingAuth: false })
            toast.success(res.data.message)
        } catch (err) {
            console.error(err)
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
    },

    reset: () => {
        set(initialState)
    }
})