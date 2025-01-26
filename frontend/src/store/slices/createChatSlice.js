import { axiosInstance } from "@/config/axios"
import { ALL_CONTACTS_ROUTE, ALL_MESSAGES_BY_ID_ROUTE, ALL_USER_ROUTE } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."
import { updateUnReadMessageCount } from "@/events/chatEvents"

export const initialChatState = {
    isUserLoading: false,
    isChatsLoading: false,

    users: [],
    selectedUserData: undefined,
    selectedChatType: undefined,
    selectedChatMessages: [],
}

export const createChatSlice = (set, get) => ({

    ...initialChatState,

    setSelectedUserData: (userData) => set({ selectedUserData: userData }),
    setSelectedChatType: (type) => set({ selectedChatType: type }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),

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
            const res = await axiosInstance.post(ALL_MESSAGES_BY_ID_ROUTE, { _id: userId })
            set({ selectedChatMessages: res.data.messages })
        }
        catch (err) {
            console.log(err.message)
            toast.error('Something Went Wrong')
        } finally {
            set({ isChatsLoading: false })
        }
    },
    // Todo : for channel
    addMessage: (data) => {
        console.log('addMessage Reducer: ', data)
        const { selectedUserData, userInfo } = useAppStore.getState()
        if (selectedUserData?._id == data.contactId) {
            set((state) => {
                return {
                    selectedChatMessages: [...state.selectedChatMessages, data]
                }
            })
        }
        else {
            const data2 = {
                contactId: data.contactId,
                userId: userInfo._id,
                count: 1,
            }
            updateUnReadMessageCount(data2)
        }
        const syncContacts = get().users.map((contact) => {
            // console.log(contact._id, data.contactId)
            if (contact._id == data.contactId) {
                return { ...contact, latestMessage: data.message, latestMessgeSender: data.senderName, latestMessageAt: data.createdAt }
            }
            else return contact
        })
        syncContacts.sort((a, b) => new Date(b.latestMessageAt) - new Date(a.latestMessageAt))
        // console.log(syncContacts)
        set({ users: syncContacts })
    }
})