import { axiosInstance } from "@/config/axios"
import socket from "@/socket"
import { ALL_MESSAGES_BY_ID_ROUTE, ALL_USER_ROUTE } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."

export const createChatSlice = (set) => ({

    isUserLoading: false,
    isChatsLoading: false,
    /**
     * store all users
     * @type {Array<{_id: string, firstname: string, lastname: string, email: string, profilePic: string}>}
     */
    users: [],
    selectedUserData: undefined,
    selectedChatType: undefined,
    /**
     * store All messages from selected user
     * @type {Array<{message: string, fromSelf: boolean, createdAt: string}>}
     */
    selectedChatMessages: [],


    setSelectedUserData: (userData) => set({ selectedUserData: userData }),
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

    getAllMessagesById: async (userId) => {
        set({ isChatsLoading: true })
        try {
            const res = await axiosInstance.post(ALL_MESSAGES_BY_ID_ROUTE, { id: userId })
            set({ selectedChatMessages: res.data.messages })
        }
        catch (err) {
            console.log(err.message)
            toast.error('Something Went Wrong')
        } finally {
            set({ isChatsLoading: false })
        }
    },
    sendMessage: async (data) => {
        try {
            // const {message, to} = data
            const { socket, addMessage } = useAppStore.getState()
            // addMessage(data)
            socket.emit('sendMessage', data)
        }
        catch (err) {
            console.log(err.message)
            toast.error('Something Went Wrong')
        }
    },
    // Todo : for channel
    addMessage: (data) => {
        set((state) => {
            return {
                selectedChatMessages: [...state.selectedChatMessages, data]
            }
        })
    }
})