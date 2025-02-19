import { axiosInstance } from "@/config/axios"
import { ALL_CONTACTS_ROUTE, ALL_USER_ROUTE, USER_PROFILE_ROUTE, USER_ROUTE } from "@/utils/constants"
import axios from "axios"
import { toast } from "sonner"

const initialState = {
    isUserLoading: false,
    isUpdatingProfile: false,
    users: [],
}

export const createUserSlice = (set, get) => ({

    ...initialState,

    setUsers: (data) => set({ users: data }),
    getAllUsers: async () => {
        set({ isUserLoading: true })
        try {
            const response = await axiosInstance.get(ALL_USER_ROUTE)
            // console.log(response.data)
            set({ users: response.data })
        } catch (err) {
            console.log(err.message)
            toast.error('Something Went Wrong')
        } finally {
            set({ isUserLoading: false })
        }
    },
    getAllContacts: async () => {
        // console.log('getAllContacts Called')
        try {
            set({ isUserLoading: true })
            const response = await axiosInstance.get(ALL_CONTACTS_ROUTE)
            // console.log(response.data)
            set({ users: response.data })
        } catch (err) {
            console.log(err.message)
            toast.error('Something Went Wrong')
        } finally {
            set({ isUserLoading: false })
        }
    },

    updateUserInfo: async (data) => {
        try {
            set({ isUpdatingProfile: true })
            // console.log(data)
            // return
            const res = await axiosInstance.put(USER_ROUTE, data)
            set((state) => {
                return {
                    userInfo: { ...state.userInfo, ...res.data.user }
                }
            })
            // set({ userInfo: { userInfo, ...res.data.user }, isUpdatingProfile: false })
            set({ isUpdatingProfile: false })
            toast.success('Profile updated successfully!')
        } catch (err) {
            console.error(err)
            toast.error('Something went wrong', err.message)
        }
    },

    uploadProfileImage: async (file) => {
        try {
            set({ isUpdatingProfile: true })
            const data = {
                fileName: file.name,
                fileType: file.type
            }
            const res = await axiosInstance.put(USER_PROFILE_ROUTE, data)
            // console.log(res)
            await axios.put(res.data.url, file, {
                headers: {
                    "Content-Type": file.type,  // Ensure correct content type
                }
            })

            // upding profile key here
            set((state) => {
                return {
                    userInfo: { ...state.userInfo, profile: res.data.fileUrl, profileKey: res.data.fileKey }
                }
            })
            await get().updateUserInfo({ profileKey: res.data.fileKey })
            set({ isUpdatingProfile: false })
            // set({ userInfo: { ...userInfo, profile: res.data.fileUrl }, isUpdatingProfile: false })
            toast.success('Profile Image updated successfully!')
            // return res.data.fileKey
        }
        catch (err) {
            console.error(err)
            toast.error('Something went wrong', err.message)
        }
    },

    removeProfileImage: async () => {
        try {
            set({ isUpdatingProfile: true })
            await axiosInstance.delete(USER_PROFILE_ROUTE)
            set({ isUpdatingProfile: false })
            toast.success('Profile Image deleted successfully!')
        }
        catch (err) {
            console.error(err)
            toast.error('Something went wrong', err.message)
        }
    },

    reset: () => {
        set(initialState)
    }
})