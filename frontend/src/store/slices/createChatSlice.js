import { axiosInstance } from "@/config/axios"
import { ALL_CONTACTS_ROUTE, ALL_MESSAGES_BY_ID_ROUTE, ALL_USER_ROUTE, GENERATE_PRESIGNED_URL_ROUTE } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."
import { updateUnReadMessageCount } from "@/events/chatEvents"
import { createNewChat, sendMessage } from "@/events/messageEvents"
import axios from "axios"

export const initialState = {
    isChatsLoading: false,
    isFilesUploading: false,

    selectedUserData: undefined,
    selectedChatType: undefined,
    selectedChatMessages: [],
}

export const createChatSlice = (set, get) => ({

    ...initialState,

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
            console.log(err)
            toast.error('Something Went Wrong')
        } finally {
            set({ isChatsLoading: false })
        }
    },

    addMessage: (data) => {
        console.log('addMessage Reducer: ', data)
        const { selectedUserData, userInfo } = useAppStore.getState()

        // if client is in the same chat room
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

        // Sync the latest message in the users list
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
    },

    uploadFile: async (files) => {
        try {
            // console.log(files)
            set({ isFilesUploading: true })

            for (const file of files) {
                if (file.size > 10000000) {
                    alert('File size is too large')
                    return
                }
                const data = {
                    fileName: file.name,
                    fileType: file.type
                }
                const res1 = await axiosInstance.post(GENERATE_PRESIGNED_URL_ROUTE, data)
                // console.log(res1)
                const res = await axios.put(res1.data.url, file, {
                    headers: {
                        "Content-Type": file.type,  // Ensure correct content type
                    }
                })
                if (res.status === 200) {
                    const { _id, userId } = useAppStore.getState().selectedUserData
                    const messageType = 'file'
                    if (_id) {
                        sendMessage({ id: _id, messageType, fileKey: res1.data.fileKey })
                    } else {
                        createNewChat({ id: userId, messageType, fileKey })
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
            toast.error('Something Went Wrong')
        } finally {
            set({ isFilesUploading: false })
        }
    },
    reset: () => {
        set(initialState)
    }
})