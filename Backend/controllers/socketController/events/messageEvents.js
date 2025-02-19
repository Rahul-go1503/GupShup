import Contact from "../../../models/Contact.js"
import Message from "../../../models/Message.js"
import { generateFileURL } from "../../../utils/generateFileURL.js"
import { strToObjId } from "../../../utils/strToObjId.js"

export const handleMessageEvents = (io, socket) => {
    const { _id: userId, firstName: userName } = socket.handshake.auth
    // Todo: fetch from the userInfo
    const profile = null
    socket.on('sendMessage', async (data) => {
        try {
            const { message, id, messageType, fileKey } = data
            // console.log(message, contactId)
            let contactId = strToObjId(id)
            let contact = await Contact.findById(contactId).select('members')
            const currentTimestamp = Date.now(); // Pre-calculate timestamp to ensure consistency
            if (!contact) {
                throw new Error('Chat not Found')
            }

            let receiverIds = []
            for (const member of contact.members) {
                // if (!member.userId.equals(userId)) {
                //     member.unReadMessageCount += 1
                // }
                receiverIds.push({
                    userId: member.userId,
                    sendAt: currentTimestamp
                })

            }
            const newMessage = new Message({
                senderId: userId,
                contactId,
                receiverIds,
                message,
                messageType,
                fileKey
            })
            // console.log(newMessage)
            await newMessage.save()
            contact.latestMessageId = newMessage._id
            await contact.save()
            // socket.emit('receiveGroupMessage', newMessage)
            // console.log(contact.members)

            // generating file url for the file key
            const fileUrl = await generateFileURL(fileKey)

            for (const member of contact.members) {
                // const receiverSocketId = userSocketMap.get(member.userId.toString())
                const receiverRoom = member.userId.toString()
                var data = { senderId: newMessage.senderId, senderName: newMessage.senderName, message, messageType: newMessage.messageType, contactId, createdAt: newMessage.createdAt }
                if (fileUrl) data.fileUrl = fileUrl
                // if (receiverSocketId) io.to(receiverSocketId).emit('receiveMessage', data) }
                io.to(receiverRoom).emit('receiveMessage', data)
            }
        }
        catch (error) {
            console.log(error)
            // :TODO Handle Error
        }
    })
}