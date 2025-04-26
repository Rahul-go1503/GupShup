import Contact from "../../../models/Contact.js";
import Message from "../../../models/Message.js";
import User from "../../../models/User.js";
import { generateFileURL, uploadToS3 } from "../../../utils/generateFileURL.js";
import { strToObjId } from "../../../utils/strToObjId.js";
import { getGroupDetailsHandler } from "../../groupController.js";

const sendNotification = async (senderId, senderName, group, message, io) => {
    try {
        const newMessage = new Message({
            senderId,
            contactId: group._id,
            message,
            isNotification: true,
        });

        group.latestMessageId = newMessage._id
        // await newGroup.save()

        await Promise.all([group.save(), newMessage.save()]);
        const data = { senderId: newMessage.senderId, senderName, message, messageType: newMessage.messageType, contactId: group._id, createdAt: newMessage.createdAt, isNotification: true }
        for (const member of group.members) {
            const receiverRoom = member.userId.toString()
            io.to(receiverRoom).emit('receiveMessage', data)
        }
    }
    catch (err) {
        throw new Error('Failed to send notification: ', err.message)
    }

}
const updateGroupHelper = async (groupId, userId, io) => {
    const group = await getGroupDetailsHandler(groupId, userId)
    for (const member of group.members) {
        const receiverRoom = member.userId._id.toString()
        io.to(receiverRoom).emit('updateGroup', group)
    }
}
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
            if (!members || members.length < 1) throw new Error('minimum 2 members are required to form a group')
            const currentTimestamp = Date.now(); // Pre-calculate timestamp to ensure consistency

            const groupMembers = []
            let receiverIds = []
            receiverIds.push({ userId, seenAt: currentTimestamp })
            groupMembers.push({ userId, isAdmin: true })


            for (const member of members) {
                const user = await User.findOne({ _id: strToObjId(member) }).select('_id')
                if (!user) {
                    throw new Error('User not found')
                }
                groupMembers.push({ userId: user._id, addedBy: userId })
                receiverIds.push({
                    user,
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

    socket.on('removeMember', async (data, callback) => {
        try {
            const { groupId, memberId } = data
            const group = await Contact.findOneAndUpdate(
                {
                    _id: strToObjId(groupId),
                    'members.userId': strToObjId(memberId)
                },
                {
                    $pull: {
                        members: { userId: strToObjId(memberId) }
                    }
                },
                { new: true }
            )
            if (!group) throw new Error('Group not found or member not in group')
            const message = `${userName} removed a member from the group`
            await sendNotification(userId, userName, group, message, io)

            io.to(memberId).emit('removeGroup', { groupId, groupName: group.name })
            await updateGroupHelper(group._id, userId, io)
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('addMembers', async (data, callback) => {
        try {
            const { groupId, memberIds } = data

            const members = memberIds.map((memberId) => {
                return { userId: strToObjId(memberId), addedBy: strToObjId(userId) }
            })
            const currentTimestamp = Date.now(); // Pre-calculate timestamp to ensure consistency
            const group = await Contact.findOneAndUpdate(
                {
                    _id: strToObjId(groupId)
                },
                {
                    $addToSet: { members: { $each: members } }  // Avoids duplicates
                },
                { new: true }
            )
            const message = `${userName} added members in the group`
            await sendNotification(userId, userName, group, message, io)

            const resData = {
                _id: group._id,
                profile: await generateFileURL(group.profile),
                isGroup: true,
                name: group.name,
                message,
                createdAt: currentTimestamp,
                unReadMessageCount: 0,
                isNotification: true
            }
            for (const memberId of memberIds) {
                io.to(memberId).emit('newGroup', { group: resData })
            }
            await updateGroupHelper(group._id, userId, io)
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('updateGroup', async (data, callback) => {
        try {
            const { groupId, groupName, description, profileKey } = data
            const updateData = {};
            updateData.name = groupName;
            updateData.description = description;
            updateData.profile = profileKey;

            const group = await Contact.findByIdAndUpdate(
                strToObjId(groupId),
                updateData,
                { new: true }
            );
            if (!group) throw new Error('Group not found')
            const message = `${userName} updated group details`
            await sendNotification(userId, userName, group, message, io)
            await updateGroupHelper(group._id, userId, io)
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('deleteGroup', async (data, callback) => {
        try {
            const { groupId } = data
            const group = await Contact.findByIdAndDelete(strToObjId(groupId))
            if (!group) throw new Error('Group not found')
            await Message.deleteMany({ contactId: strToObjId(groupId) })
            for (const member of group.members) {
                const receiverRoom = member.userId.toString()
                io.to(receiverRoom).emit('removeGroup', { groupId, groupName: group.name, deletedBy: userId })
            }
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('exitGroup', async (data, callback) => {
        try {
            const { groupId } = data
            const group = await Contact.findOneAndUpdate(
                {
                    _id: strToObjId(groupId),
                    'members.userId': strToObjId(userId)
                },
                {
                    $pull: {
                        members: { userId: strToObjId(userId) }
                    }
                },
                { new: true }
            )
            if (!group) throw new Error('Group not found or you are not a member of this group')
            const message = `${userName} left the group`
            await sendNotification(userId, userName, group, message, io)
            io.to(userId).emit('removeGroup', { groupId, groupName: group.name })
            await updateGroupHelper(group._id, userId, io)
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('toggleGroupAdmin', async (data, callback) => {
        try {
            const { groupId, memberId, isAdmin } = data
            const group = await Contact.findOneAndUpdate(
                {
                    _id: strToObjId(groupId),
                    'members.userId': strToObjId(memberId)
                },
                {
                    $set: {
                        'members.$.isAdmin': isAdmin
                    }
                },
                { new: true }
            )
            if (!group) throw new Error('Group not found or member not in group')
            let message = `${userName} made a member admin`
            if (!isAdmin) {
                message = `${userName} removed admin rights from a member`
            }
            await sendNotification(userId, userName, group, message, io)
            await updateGroupHelper(group._id, userId, io)
            callback({ success: true })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('checkUserOnline', async (data, callback) => {
        try {
            const { userId } = data
            const isOnline = io.sockets.adapter.rooms.has(userId); // Get the room
            callback({ success: true, isOnline })
        }
        catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

    socket.on('typing', async (data, callback) => {
        try {
            const { id } = data
            const chat = await Contact.findById(strToObjId(id))
            if (!chat) throw new Error('Chat not found')
            const res = { id, senderName: userName }
            for (const member of chat.members) {
                const receiverRoom = member.userId.toString()
                if (receiverRoom !== userId) {
                    socket.to(receiverRoom).emit('typing', res)
                }
            }
            callback({ success: true })
        } catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })
    socket.on('stopTyping', async (data, callback) => {
        try {
            const { id } = data
            const chat = await Contact.findById(strToObjId(id))
            if (!chat) throw new Error('Chat not found')
            for (const member of chat.members) {
                const receiverRoom = member.userId.toString()
                if (receiverRoom !== userId) {
                    socket.to(receiverRoom).emit('stopTyping', { id, senderName: userName })
                }
            }
            callback({ success: true })
        } catch (err) {
            console.log(err)
            callback({ success: false, error: err.message || "An unknown error occurred" })
        }
    })

}