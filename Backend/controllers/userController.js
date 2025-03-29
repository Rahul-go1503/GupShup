import User from "../models/User.js";
import { strToObjId } from "../utils/strToObjId.js";
import Contact from "../models/Contact.js";
import { userSocketMap } from "../config/socket.js";
import { deleteFile, generateFileURL, generatePresignedUrl } from "../utils/generateFileURL.js";


// Update User info
export const updateUserInfo = async (req, res, next) => {
    try {
        const userId = strToObjId(req.user.id)
        const { firstName, email, profileKey } = req.body
        console.log(req.body)

        await User.findByIdAndUpdate(userId, {
            firstName: firstName,
            email: email,
            profile: profileKey
        }, { new: true, runValidators: true })
        // console.log(user1)
        // profile key is already set in userinfo and no need of file key after saving to db
        res.status(200).json({ user: { firstName, email }, message: 'Profile updated successfully' })
    }
    catch (err) {
        next(err)
    }
}

// Delete User
export const deleteUser = async (req, res, next) => {
    // console.log(req)
    try {
        // if(err) throw err
        const userId = req.user.id
        // console.log(userId)
        await User.deleteOne({ _id: userId })
        res.status(200).json({ message: 'User deleted Successfully' })

    }
    catch (err) {
        next(err)
    }
}

// Get All Contacts
export const getAllContacts = async (req, res, next) => {
    try {
        const userId = strToObjId(req.user.id)
        const contacts = await Contact.aggregate([
            {
                $match: {
                    'members.userId': userId
                }
            },

            {
                $project: {
                    _id: 1,
                    isGroup: 1,
                    name: 1,
                    profile: 1,
                    latestMessageId: 1,
                    members: {
                        $cond: {
                            if: { $eq: ['$isGroup', false] },
                            then: '$members',
                            else: {
                                $filter: {
                                    input: '$members',
                                    as: 'user',
                                    cond: { $eq: ['$$user.userId', userId] }
                                }
                            }
                        }
                    }

                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members.userId',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: 'latestMessageId',
                    foreignField: '_id',
                    as: 'latestMessage'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'latestMessage.senderId',
                    foreignField: '_id',
                    as: 'latestMessageSender'
                }
            }
        ])
        // return res.send(contacts)
        let data = []

        for (const contact of contacts) {
            // todo: replace _id to contact id
            if (contact.isGroup) {
                data.push({
                    _id: contact._id,
                    isGroup: contact.isGroup,
                    name: contact.name,
                    profile: await generateFileURL(contact.profile),
                    latestMessage: contact.latestMessage[0]?.message,
                    latestMessageSenderId: contact.latestMessageSender[0]?._id,
                    latestMessageSender: contact.latestMessageSender[0]?.firstName,
                    latestMessageAt: contact.latestMessage[0]?.createdAt,
                    unReadMessageCount: contact.members[0].unReadMessageCount || 0,
                    isAdmin: contact.members[0].isAdmin,
                    isNotification: contact.latestMessage[0]?.isNotification
                })
            }
            else {
                // console.log(contact.members.find(member => member.userId.equals(userId)))
                data.push({
                    _id: contact._id,
                    isGroup: contact.isGroup,
                    name: contact.users.find(member => !member._id.equals(userId))?.firstName,
                    profile: await generateFileURL(contact.users.find(member => !member._id.equals(userId))?.profile),
                    latestMessage: contact.latestMessage[0]?.message,
                    latestMessageSenderId: contact.latestMessageSender[0]?._id,
                    latestMessageSender: contact.latestMessageSender[0]?.firstName,
                    latestMessageAt: contact.latestMessage[0]?.createdAt,
                    // status: userSocketMap.get(userId.toString()) ? 'Online' : 'Offline',
                    unReadMessageCount: contact.members.find(member => member.userId.equals(userId))?.unReadMessageCount || 0,
                    userId: contact.users.find(member => !member._id.equals(userId))?._id
                })
            }
        }

        // console.log('All contacts: ', data)
        data.sort((a, b) => new Date(b.latestMessageAt) - new Date(a.latestMessageAt))
        res.status(200).json(data)
    }
    catch (err) {
        next(err)
    }
}

//     try {
//         const userId = strToObjId(req.user.id)
//         const contacts = await Message.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { senderId: userId },
//                         { receiverId: userId }
//                     ]
//                 }
//             },
//             {
//                 $sort: { updatedAt: -1 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         $cond: {
//                             if: { $eq: ['$senderId', userId] },
//                             then: '$receiverId',
//                             else: '$senderId'
//                         }
//                     },
//                     lastMessageTime: { $first: '$updatedAt' }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'contactInfo'
//                 }
//             },
//             {
//                 $unwind: '$contactInfo'
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     lastMessageTime: 1,
//                     firstName: '$contactInfo.firstName',
//                     lastName: '$contactInfo.lastName',
//                     email: '$contactInfo.email',
//                 }
//             },
//             {
//                 $sort: { lastMessageTime: -1 }
//             }

//         ])
//         res.status(200).json(contacts)
//     }
//     catch (err) {
//         next(err)
//     }
// }

// Get All Users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json(users)
    }
    catch (err) {
        next(err)
    }
}

// Get User By Id
export const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')

        const data = {
            _id: user._id,
            firstName: user.firstName,
            email: user.email,
            createdAt: user.createdAt,
            profile: await generateFileURL(user.profile)
        }
        res.status(200).json({ user: data })
    }
    catch (err) {
        next(err)
    }
}
export const searchContacts = async (req, res, next) => {
    try {
        const userId = strToObjId(req.user.id)
        const { searchTerm } = req.query
        // console.log(searchTerm)
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("searchTerm is requried.")
        }
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()\[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");
        const users = await User.find(
            {
                _id: { $ne: userId },
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { email: regex }
                ]
            },
            { firstName: 1, profile: 1 } // Selecting only required fields
        );
        const contacts = await Promise.all(users.map(async (user) => ({
            name: user.firstName,
            isGroup: false,
            userId: user._id,
            status: userSocketMap.get(user._id.toString()) ? 'Online' : 'Offline',
            profile: await generateFileURL(user.profile) // Generating the signed URL
        })));

        // console.log(contacts)


        res.status(200).json(contacts)
    }
    catch (err) {
        next(err)
    }
}


export const uploadProfileImage = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { fileName, fileType } = req.body; // Get file name and type from frontend

        if (!fileName || !fileType) {
            return res.status(400).json({ error: "Missing fileName or fileType" });
        }

        const key = `uploads/profiles/${userId}`; // to ensure one profile image per user
        const url = await generatePresignedUrl({ fileType, key })

        const fileUrl = await generateFileURL(key)
        // console.log(url, key)
        res.status(200).json({ url, fileKey: key, fileUrl });
    } catch (err) {
        next(err)
    }

}

export const removeProfileImage = async (req, res, next) => {
    try {
        const userId = req.user.id
        const oldUser = await User.findByIdAndUpdate(userId, { profile: null })
        console.log(oldUser, oldUser.profile)
        if (oldUser?.profile) await deleteFile(oldUser.profile, next)
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        next(err)
    }
}