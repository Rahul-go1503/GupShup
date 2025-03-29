import Contact from "../../../models/Contact.js"
import Message from "../../../models/Message.js"
import { generateFileURL } from "../../../utils/generateFileURL.js"
import { strToObjId } from "../../../utils/strToObjId.js"


export const handleMessageEvents = (io, socket) => {
    const { _id: userId, firstName: userName } = socket.handshake.auth
    socket.on('sendMessage', async (data, cb) => {
        try {
            const { message, id, messageType, fileKey } = data
            let contactId = strToObjId(id)
            let contact = await Contact.findById(contactId).select('members')
            const currentTimestamp = Date.now(); // Pre-calculate timestamp to ensure consistency
            if (!contact) {
                throw new Error('Chat not Found')
            }

            let receiverIds = []
            for (const member of contact.members) {
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

            // generating file url for the file key
            const fileUrl = await generateFileURL(fileKey)

            for (const member of contact.members) {
                const receiverRoom = member.userId.toString()
                var data = { senderId: newMessage.senderId, senderName: newMessage.senderName, message, messageType: newMessage.messageType, contactId, createdAt: newMessage.createdAt }
                if (fileUrl) data.fileUrl = fileUrl
                io.to(receiverRoom).emit('receiveMessage', data)
            }
            cb({ success: 'true' })
        }
        catch (error) {
            console.log(error)
            cb({ success: 'false', error: error.message })
        }
    })
}