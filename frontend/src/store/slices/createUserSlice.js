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
        try {
            set({ isUserLoading: true })
            const response = await axiosInstance.get(ALL_USER_ROUTE)
            set({ users: response.data })
        } catch (err) {
            // console.log(err)
            toast.error(err.response?.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },
    getAllContacts: async () => {
        try {
            set({ isUserLoading: true })
            const response = await axiosInstance.get(ALL_CONTACTS_ROUTE)
            set({ users: response.data })
        } catch (err) {
            toast.error(err.response?.data?.message)
        } finally {
            set({ isUserLoading: false })
        }
    },

    updateUserInfo: async (data) => {
        try {
            set({ isUpdatingProfile: true })
            const res = await axiosInstance.put(USER_ROUTE, data)
            set((state) => {
                return {
                    userInfo: { ...state.userInfo, ...res.data.user }
                }
            })
            toast.success('Profile updated successfully!')
        } catch (err) {
            // console.error(err)
            toast.error(err.response?.data.message)
        }
        finally {
            set({ isUpdatingProfile: false })
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
            // toast.success('Profile Image updated successfully!')
        }
        catch (err) {
            // console.error(err)
            toast.error(err.response?.data.message)
        }
        finally {
            set({ isUpdatingProfile: false })
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
            // console.error(err)
            toast.error(err.response?.data.message)
        }
        finally {
            set({ isUpdatingProfile: false })
        }
    },

    reset: () => {
        set(initialState)
    }
})