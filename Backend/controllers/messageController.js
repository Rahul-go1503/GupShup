import Message from "../models/Message.js"
import { strToObjId } from "../utils/strToObjId.js"
import Contact from "../models/Contact.js"
import { io } from "../config/socket.js"

// get All messages for a user
const getAllMessagesById = async (req, res) => {
    try {
        // const senderId = req.user.id
        const contactId = strToObjId(req.body._id)
        // console.log('senderId: ', senderId, 'receiverId: ', receiverId)

        // const messages = await Message.find({ contactId }).populate({ path: 'senderId', select: 'firstName' }).select('-receiverIds')

        // console.log(messages)
        const messages = await Message.aggregate([
            { $match: { contactId } },
            {
                $lookup: {
                    from: 'users', // The name of the User collection
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'senderInfo',
                },
            },
            { $unwind: '$senderInfo' }, // Deconstruct the senderInfo array
            {
                $project: {
                    senderId: 1,
                    messageType: 1,
                    message: 1,
                    media: 1,
                    contactId: 1,
                    parentId: 1,
                    createdAt: 1,
                    senderName: '$senderInfo.firstName',
                    isNotification: 1
                },
            },
            // senderName: '$senderInfo.firstName', // Replace senderId with firstName
        ])
        res.status(200).json({ messages })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}
// send message
const sendMessage = async (data, callback) => {
    try {
        const { message, id } = data
        // console.log(message, contactId)
        let contactId = strToObjId(id)
        let contact = await Contact.findById(contactId).select('members')
        const currentTimestamp = Date.now(); // Pre-calculate timestamp to ensure consistency
        if (!contact) {
            throw new Error('Chat not Found')
        }

        let receiverIds = []
        for (const member of contact.members) {
            if (!member.userId.equals(userId)) {
                member.unReadMessageCount += 1
            }
            receiverIds.push({
                userId: member.userId,
                sendAt: currentTimestamp
            })

        }
        const newMessage = new Message({
            senderId: userId,
            contactId,
            receiverIds,
            message
        })
        // console.log(newMessage)
        await newMessage.save()
        contact.latestMessageId = newMessage._id
        await contact.save()
        // socket.emit('receiveGroupMessage', newMessage)
        // console.log(contact.members)

        for (const member of contact.members) {
            // const receiverSocketId = userSocketMap.get(member.userId.toString())
            const receiverRoom = member.userId.toString()
            const data = { senderId: newMessage.senderId, senderName: newMessage.senderName, message, messageType: newMessage.messageTye, contactId, createdAt: newMessage.createdAt, unReadMessageCount: member.unReadMessageCount }
            // if (receiverSocketId) io.to(receiverSocketId).emit('receiveMessage', data) }
            io.to(receiverRoom).emit('receiveMessage', data)
        }
    }
    catch (error) {
        console.log(error)
        callback({ error: error.message })
    }
}
export { getAllMessagesById, sendMessage }