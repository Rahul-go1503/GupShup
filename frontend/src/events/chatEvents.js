import { useAppStore } from "@/store"
import { toast } from "sonner"


export const createNewGroup = async (data) => {
    try {
        const { socket } = useAppStore.getState()
        socket.emit('newGroup', data, (err) => {
            throw new Error('Something Went Wrong')
        })
    }
    catch (err) {
        console.log(err)
        toast.error(err.message)
    }
}

export const updateUnReadMessageCount = async (data) => {
    const { socket, selectedUserData, userInfo, users, setUsers } = useAppStore.getState()
    const data2 = {
        ...data,
        userId: userInfo._id
    }
    console.log('updateUnReadMessageCount trigger', data)
    socket.emit('updateUnReadMessageCount', data2) //,(res) => {
    // console.log('Something Went Wrong')
    // if (res & res.status == 'ok') {
    const syncContacts = users.map((contact) => {
        // console.log(contact._id, data.contactId)
        if (contact._id == selectedUserData?._id) {
            return { ...contact, unReadMessageCount: 0 }
        }
        else if (contact._id == data.contactId) {
            return { ...contact, unReadMessageCount: contact.unReadMessageCount + 1 }
        }
        return contact
    })
    // console.log(syncContacts, users)
    setUsers(syncContacts)
    // }
    // else {
    //     console.log('something went wrong')
    // }
    //})
}