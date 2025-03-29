import { axiosInstance } from "@/config/axios"
import { ALL_MESSAGES_BY_ID_ROUTE, GROUP_ROUTES, MESSAGE_ROUTES } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."
import { createNewChat, updateUnReadMessageCount } from "@/events/chatEvents"
import { sendMessage } from "@/events/messageEvents"
import axios from "axios"

export const initialState = {
    isChatsLoading: false,
    isFilesUploading: false,
    isGroupUpdating: false,

    selectedUserData: undefined,
    selectedGroupData: undefined,
    selectedChatMessages: [],
}

const getMessageType = (fileType) => {

    if (fileType.startsWith('image/')) return 'image'
    if (fileType.startsWith('audio/')) return 'audio'
    if (fileType.startsWith('video/')) return 'video'
    if (fileType === 'application/pdf') return 'pdf'

    return 'file' // Default case for other files like docs, zips, etc.
}
const getFileMessage = (fileType) => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const article = vowels.includes(fileType[0].toLowerCase()) ? 'an' : 'a';
    return `Sent ${article} ${fileType}`;
}
export const createChatSlice = (set, get) => ({

    ...initialState,

    setSelectedUserData: (userData) => set({ selectedUserData: userData }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),

    closeChat: () => {
        set({
            selectedUserData: undefined,
            selectedChatMessages: [],
        })
    },

    getAllMessagesById: async (id) => {
        try {
            set({ isChatsLoading: true })
            if (get().selectedUserData.isGroup) {
                const getGroupDetails = await axiosInstance.get(`${GROUP_ROUTES}/${id}`)
                // console.log(getGroupDetails)
                set({ selectedGroupData: getGroupDetails.data })
            }
            else {
                // console.log('private message')
                set({ selectedGroupData: undefined })
            }
            // console.log()
            const res = await axiosInstance.post(ALL_MESSAGES_BY_ID_ROUTE, { _id: id })
            set({ selectedChatMessages: res.data.messages })
        }
        catch (err) {
            toast.error(err.response?.data?.message)
        } finally {
            set({ isChatsLoading: false })
        }
    },

    addMessage: (data) => {
        const { selectedUserData, userInfo } = useAppStore.getState()
        console.log(data)
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
            if (contact._id == data.contactId) {
                return { ...contact, latestMessage: data.message, latestMessgeSender: data.senderName, latestMessageAt: data.createdAt }
            }
            else return contact
        })
        syncContacts.sort((a, b) => new Date(b.latestMessageAt) - new Date(a.latestMessageAt))
        set({ users: syncContacts })
    },

    uploadFile: async (files) => {
        try {
            set({ isFilesUploading: true })

            for (const file of files) {
                if (file.size > 10000000) {
                    toast.error('File size is too large')
                    return
                }
                const data = {
                    fileName: file.name,
                    fileType: file.type
                }
                const res1 = await axiosInstance.post(MESSAGE_ROUTES, data)
                const res = await axios.put(res1.data.url, file, {
                    headers: {
                        "Content-Type": file.type,  // Ensure correct content type
                    }
                })
                if (res.status === 200) {
                    const { _id, userId } = useAppStore.getState().selectedUserData
                    const messageType = getMessageType(file.type)
                    const message = getFileMessage(messageType)
                    if (_id) {
                        sendMessage({ message, id: _id, messageType, fileKey: res1.data.fileKey })
                    } else {
                        createNewChat({ message, id: userId, messageType, fileKey })
                    }
                }
            }
        }
        catch (err) {
            toast.error(err.response?.data?.message)
        } finally {
            set({ isFilesUploading: false })
        }
    },

    updateGroup: async (data) => {
        try {
            set({ isUpdating: true });
            const { data } = await axiosInstance.put(`/group/${groupId}`, updatedData);
            set((state) => ({
                groups: state.groups.map((group) => group._id === groupId ? data : group),
                isUpdating: false,
            }));
        } catch (err) {
            toast.error(err.response?.data?.message)
        } finally {
            set({ isUpdating: false })
        }
    },
    reset: () => {
        set(initialState)
    }
})