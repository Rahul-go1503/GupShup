import { axiosInstance } from "@/config/axios"
import { ALL_USER_ROUTE } from "@/utils/constants"
import { toast } from "sonner"

export const createChatSlice = (set) => ({

    isUserLoading: false,

    users: [],
    selectedUserData: undefined,
    selectedChatType: undefined,
    selectedChatMessages: [],

    setSelectedUserData: (userData) => set((state) => ({ ...state, selectedUserData: userData })),
    setSelectedChatType: (type) => set({ selectedChatType: type }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),

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
    closeChat: () => {

        set({
            selectedUserData: undefined,
            selectedChatType: undefined,
            selectedChatMessages: [],
        })
    },

    // Todo : for channel
    addMessage: (message) => {
        set({
            selectedChatMessages: [
                ...selectedChatMessages,
                { ...message }
            ]
        })
    }
})