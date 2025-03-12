import Contact from "../../../models/Contact.js";
import Message from "../../../models/Message.js";
import User from "../../../models/User.js";
import { generateFileURL, uploadToS3 } from "../../../utils/generateFileURL.js";
import { strToObjId } from "../../../utils/strToObjId.js";


export const handleChatEvents = (io, socket) => {
    const { _id: userId, firstName: userName } = socket.handshake.auth
    // Todo: fetch from the userInfo -> done
    // const profile = null
    socket.on('newChat', async (data1, callback) => {
        try {
            const { message, id } = data1
            console.log(data1)
            const currentTimestamp = Date.now();
            const receiverUserId = strToObjId(id)

            // creating new contact for chat
            const newContact = new Contact({
                members: [{ userId: userId, unReadMessageCount: 0 }, { userId: receiverUserId, unReadMessageCount: 1 }]
            })
            await newContact.save()
            // update contact id for the client who created new chat
            io.to(userId).emit('updateContactId', newContact._id)

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
            await newMessage.save()
            newContact.latestMessageId = newMessage._id
            await newContact.save()

            // send new chat data
            const chatData = {
                _id: newContact._id,
                isGroup: false,
                latestMessage: message,
                latestMessageAt: currentTimestamp,
                // unReadMessageCount: 0
            }
            //To Sender
            const receiver = await User.findById(receiverUserId).select('_id firstName profile')
            const chatData1 = {
                ...chatData,
                name: receiver.firstName,
                profile: await generateFileURL(receiver.profile),
                userId: receiver._id,
                unReadMessageCount: 0
            }
            io.to(userId).emit('newChat', chatData1)
            // To receiver
            const sender = await User.findById(userId).select('_id firstName profile')
            const chatData2 = {
                ...chatData,
                name: sender.firstName,
                profile: await generateFileURL(sender.profile),
                userId: sender._id,
                unReadMessageCount: 1
            }
            io.to(id).emit('newChat', chatData2)
            const data = { senderId: userId, senderName: userName, message, messageType: newMessage.messageType, contactId: newMessage._id, createdAt: newMessage.createdAt }
            io.to(id).emit('receiveMessage', data)
        }
        catch (err) {
            console.log(err)
            callback({ error: err.message })
        }
    })

    socket.on('newGroup', async (data, callback) => {
        try {
            const { groupProfileData, groupName, description, members } = data
            // console.log(data)
            // const Admin = socket.handshake.query.userId
            // const AdminName = socket.handshake.query.userName

            const currentTimestamp = Date.now(); // Pre-calculate timestamp to ensure consistency

            const groupMembers = []
            let receiverIds = []
            receiverIds.push({ userId, seenAt: currentTimestamp })
            groupMembers.push({ userId, isAdmin: true })
            if (!members) throw { message: 'minimum 2 members are required to form a group' }


            for (const member of members) {
                const userId = await User.findOne({ _id: strToObjId(member) }).select('_id')
                // console.log("USER ID : ", userId, "\n")
                // console.log(userId)
                if (!userId) {
                    throw { message: 'User not found' }
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
            await newGroup.save()

            // Upload to S3
            const buffer = Buffer.from(groupProfileData.file, "base64"); // Convert base64 to buffer
            const profileKey = `uploads/profiles/${newGroup._id}`
            const profileUrl = await uploadToS3(buffer, profileKey, groupProfileData.fileType);
            // console.log(profileUrl)

            const newMessage = new Message({
                senderId: userId,
                receiverIds,
                contactId: newGroup._id,
                message: userName + ' created group "' + newGroup.name + '"',
                isNotification: true,
            })

            await newMessage.save()

            newGroup.latestMessageId = newMessage._id
            newGroup.profile = profileKey
            await newGroup.save()

            const resData = {
                _id: newGroup._id,
                profile: profileUrl,
                isGroup: true,
                name: newGroup.name,
                latestMessage: newMessage.message,
                latestMessageAt: currentTimestamp,
                unReadMessageCount: 0
            }
            // console.log(resData)
            for (const member of newGroup.members) {
                // const receiverSocket = userSocketMap.get(member.userId.toString())
                const receiverRoom = member.userId.toString()
                // console.log('Emitting create Group event : ', member.userId, receiverRoom)
                // if (receiverSocket) io.to(receiverSocket).emit('newGroup', { group: { ...newGroup._doc } })
                // console.log('newGroup Event handler', newGroup)
                io.to(receiverRoom).emit('newGroup', { group: { ...resData, isAdmin: member.isAdmin } })
            }
            callback('ok')
        }
        catch (err) {
            console.log(err)
            callback('error', err)
        }
    })

    socket.on('updateUnReadMessageCount', async (data) => {
        try {
            const { contactId, userId, count } = data
            // console.log(data)
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
            // callback({ status: 'ok' })
            // console.log(contact)
        }
        catch (err) {
            console.log(err)
            // callback({ error: err.message })
        }
    })
}