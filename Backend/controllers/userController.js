import User from "../models/User.js";
import { strToObjId } from "../utils/strToObjId.js";
import Contact from "../models/Contact.js";
import { deleteFile, generateFileURL, generatePresignedUrl } from "../utils/generateFileURL.js";


// Update User info
export const updateUserInfo = async (req, res, next) => {
    try {
        const userId = strToObjId(req.user.id)
        const { firstName, profileKey } = req.body

        await User.findByIdAndUpdate(userId, {
            firstName: firstName,
            profile: profileKey
        }, { new: true, runValidators: true })
        // console.log(user1)
        // profile key is already set in userinfo and no need of file key after saving to db
        res.status(200).json({ user: { firstName }, message: 'Profile updated successfully' })
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
            const res = {
                _id: contact._id,
                isGroup: contact.isGroup,
                message: contact.latestMessage[0]?.message,
                senderId: contact.latestMessageSender[0]?._id,
                senderName: contact.latestMessageSender[0]?.firstName,
                createdAt: contact.latestMessage[0]?.createdAt,
                isNotification: contact.latestMessage[0]?.isNotification
            }
            if (contact.isGroup) {
                data.push({
                    ...res,
                    name: contact.name,
                    profile: await generateFileURL(contact.profile),
                    unReadMessageCount: contact.members[0].unReadMessageCount || 0,
                    isAdmin: contact.members[0].isAdmin,
                })
            }
            else {
                const receiver = contact.users.find(member => !member._id.equals(userId))
                data.push({
                    ...res,
                    name: receiver?.firstName || 'Deleted User',
                    profile: await generateFileURL(receiver?.profile),
                    unReadMessageCount: contact.members.find(member => member.userId.equals(userId))?.unReadMessageCount || 0,
                    userId: receiver?._id
                })
            }
        }

        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        res.status(200).json(data)
    }
    catch (err) {
        next(err)
    }
}
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
        let id = req.user.id
        if (req.params.id) id = req.params.id
        const { fileName, fileType } = req.body; // Get file name and type from frontend

        if (!fileName || !fileType) {
            return res.status(400).json({ error: "Missing fileName or fileType" });
        }

        const key = `uploads/profiles/${id}`; // to ensure one profile image per user
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
        if (oldUser?.profile) await deleteFile(oldUser.profile, next)
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        next(err)
    }
}