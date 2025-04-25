import { axiosInstance } from "@/config/axios"
import { ALL_MESSAGES_BY_ID_ROUTE, GROUP_PROFILE_ROUTE, GROUP_ROUTES, MESSAGE_ROUTES } from "@/utils/constants"
import { toast } from "sonner"
import { useAppStore } from ".."
import { createNewChat, updateGroup, updateUnReadMessageCount } from "@/events/chatEvents"
import { sendMessage } from "@/events/messageEvents"
import axios from "axios"

export const initialState = {
    isChatsLoading: false,
    isFilesUploading: false,
    isGroupUpdating: false,
    isUpdatingGroupProfile: false,

    selectedUserData: undefined,
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
    contactClickHandler: async (user) => {
        try {
            set({ isChatsLoading: true })

            if (user.isGroup) {
                const getGroupDetails = await axiosInstance.get(`${GROUP_ROUTES}/${user._id}`)

                set({ selectedUserData: getGroupDetails.data })
            }
            else {
                set({ selectedUserData: user })
            }
            if (user?.unReadMessageCount) {
                const data = {
                    contactId: user?._id,
                    count: -user?.unReadMessageCount,
                }
                updateUnReadMessageCount(data)
            }
            // console.log()
            const res = await axiosInstance.post(ALL_MESSAGES_BY_ID_ROUTE, { _id: user._id })
            set({ selectedChatMessages: res.data.messages })
        }
        catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message)
        } finally {
            set({ isChatsLoading: false })
        }
    },

    addMessage: (data) => {
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
            if (contact._id == data.contactId) {
                return { ...contact, ...data }
            }
            else return contact
        })
        syncContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
    uploadGroupProfileImage: async (file, groupId) => {
        try {
            set({ isUpdatingGroupProfile: true })
            const data = {
                fileName: file.name,
                fileType: file.type
            }
            const res = await axiosInstance.put(`${GROUP_PROFILE_ROUTE}/${groupId}`, data)
            await axios.put(res.data.url, file, {
                headers: {
                    "Content-Type": file.type,  // Ensure correct content type
                }
            })
            return res.data.fileKey
        }
        catch (err) {
            // console.error(err)
            toast.error(err.response?.data.message)
        }
        finally {
            set({ isUpdatingGroupProfile: false })
        }
    },
    removeGroupProfileImage: async (groupId) => {
        try {
            set({ isUpdatingGroupProfile: true })
            await axiosInstance.delete(`${GROUP_PROFILE_ROUTE}/${groupId}`)
        }
        catch (err) {
            toast.error(err.response?.data.message)
        }
        finally {
            set({ isUpdatingGroupProfile: false })
        }
    },
    updateGroupDetails: async (groupDetails) => {
        try {
            const { selectedUserData, uploadGroupProfileImage, removeGroupProfileImage } = get()
            if (!groupDetails.profile) {
                await removeGroupProfileImage(selectedUserData._id)
                groupDetails.profileKey = null
            } else if (groupDetails.file) {
                groupDetails.profileKey = await uploadGroupProfileImage(
                    groupDetails.file,
                    selectedUserData._id
                )
            }
            updateGroup({
                groupId: selectedUserData._id,
                groupName: groupDetails.name,
                description: groupDetails.description,
                profileKey: groupDetails.profileKey,
            })
            document.getElementById('groupChatDetailsModal').close()
        }
        catch (err) {
            console.error(err)
            toast.error(err.response?.data.message)
        }
        finally {

        }
    },
    reset: () => {
        set(initialState)
    }
})