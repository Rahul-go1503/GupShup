import Contact from "../../../models/Contact.js";
import Message from "../../../models/Message.js";
import User from "../../../models/User.js";
import { generateFileURL, uploadToS3 } from "../../../utils/generateFileURL.js";
import { strToObjId } from "../../../utils/strToObjId.js";


export const handleChatEvents = (io, socket) => {
    const { _id: userId, firstName: userName } = socket.handshake.auth
    socket.on('newChat', async (data, callback) => {
        try {
            const { message, id } = data
            const currentTimestamp = Date.now();
            const receiverUserId = strToObjId(id)

            // creating new contact for chat
            const newContact = new Contact({
                members: [{ userId: userId, unReadMessageCount: 0 }, { userId: receiverUserId, unReadMessageCount: 1 }]
            })
            // inserting new msg
            const newMessage = new Message({
                senderId: userId,
                contactId: newContact._id,
                receiverIds: [
                    { userId: userId, sendAt: currentTimestamp },
                    { userId: receiverUserId, sendAt: currentTimestamp, unReadMessageCount: 1 }
                ],
                message
            })
            newContact.latestMessageId = newMessage._id
            await Promise.all([newContact.save(), newMessage.save()]);
            // Fetch sender and receiver data concurrently
            const [receiver, sender] = await Promise.all([
                User.findById(receiverUserId).select('_id firstName profile'),
                User.findById(userId).select('_id firstName profile')
            ]);
            const chatDataSender = {
                _id: newContact._id,
                isGroup: false,
                message: message,
                createdAt: currentTimestamp,
                senderId: sender._id,
                senderName: sender.firstName,
                name: receiver.firstName,
                profile: await generateFileURL(receiver.profile),
                userId: receiver._id,
                unReadMessageCount: 0
            };
            const chatDataReceiver = {
                ...chatDataSender,
                name: sender.firstName,
                profile: await generateFileURL(sender.profile),
                userId: sender._id,
                unReadMessageCount: 1
            };
            const response = { senderId: userId, senderName: userName, message, messageType: newMessage.messageType, contactId: newMessage._id, createdAt: newMessage.createdAt }

            // Emiting Events
            io.to(userId).emit('updateContactId', newContact._id)
            io.to(userId).emit('newChat', chatDataSender)
            io.to(id).emit('newChat', chatDataReceiver)
            io.to(id).emit('receiveMessage', response)
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('newGroup', async (data, callback) => {
        try {
            const { groupProfileData, groupName, description, members } = data
            if (!members || members.length < 2) throw new Error('minimum 3 members are required to form a group')
            const currentTimestamp = Date.now(); // Pre-calculate timestamp to ensure consistency

            const groupMembers = []
            let receiverIds = []
            receiverIds.push({ userId, seenAt: currentTimestamp })
            groupMembers.push({ userId, isAdmin: true })


            for (const member of members) {
                const userId = await User.findOne({ _id: strToObjId(member) }).select('_id')
                if (!userId) {
                    throw new Error('User not found')
                }
                groupMembers.push({ userId: userId._id })
                receiverIds.push({
                    userId,
                    sendAt: currentTimestamp
                })
            }
            const newGroup = new Contact({
                name: groupName,
                description,
                members: groupMembers,
                isGroup: true,
            })
            // await newGroup.save()

            // Upload to S3
            let profileUrl = null
            if (groupProfileData) {
                const buffer = Buffer.from(groupProfileData.file, "base64"); // Convert base64 to buffer
                const profileKey = `uploads/profiles/${newGroup._id}`
                profileUrl = await uploadToS3(buffer, profileKey, groupProfileData.fileType);
                newGroup.profile = profileKey
            }

            const newMessage = new Message({
                senderId: userId,
                receiverIds,
                contactId: newGroup._id,
                message: userName + ' created group "' + newGroup.name + '"',
                isNotification: true,
            })

            // await newMessage.save()

            newGroup.latestMessageId = newMessage._id
            // await newGroup.save()
            await Promise.all([newGroup.save(), newMessage.save()]);

            const resData = {
                _id: newGroup._id,
                profile: profileUrl,
                isGroup: true,
                name: newGroup.name,
                message: newMessage.message,
                createdAt: currentTimestamp,
                unReadMessageCount: 0,
                isNotification: true
            }
            for (const member of newGroup.members) {
                const receiverRoom = member.userId.toString()
                io.to(receiverRoom).emit('newGroup', { group: { ...resData, isAdmin: member.isAdmin } })
            }
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('updateUnReadMessageCount', async (data, callback) => {
        try {
            const { contactId, userId, count } = data
            await Contact.findOneAndUpdate(
                {
                    _id: strToObjId(contactId),
                    'members.userId': strToObjId(userId)
                },
                {
                    $inc: {
                        'members.$.unReadMessageCount': count
                    }
                })
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })
}