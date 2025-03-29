import { useAppStore } from "@/store"
import { toast } from "sonner"

export const createNewChat = async (data) => {
    const { socket } = useAppStore.getState()
    socket.emit('newChat', data, (res) => {
        if (res.success == false) {
            console.log(res)
            toast.error(res.error)
        }
    })
}

export const createNewGroup = async (data) => {
    const { socket } = useAppStore.getState()
    socket.emit('newGroup', data, (res) => {
        if (res.success == false) {
            console.log(res)
            toast.error(res.error)
        }
        else toast.success('Group Created')
    })
}

export const updateUnReadMessageCount = async (data) => {
    const { socket, selectedUserData, userInfo } = useAppStore.getState()
    const data2 = {
        ...data,
        userId: userInfo._id
    }
    socket.emit('updateUnReadMessageCount', data2, (res) => {
        if (res.success == false) {
            console.log(res)
            toast.error(res.error)
        }
        else {
            const { users, setUsers } = useAppStore.getState()
            const syncContacts = users.map((contact) => {
                if (contact._id == selectedUserData?._id) {
                    return { ...contact, unReadMessageCount: 0 }
                }
                else if (contact._id == data.contactId) {
                    return { ...contact, unReadMessageCount: contact.unReadMessageCount + 1 }
                }
                return contact
            })
            setUsers(syncContacts)
        }
    })
}