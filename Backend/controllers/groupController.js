import User from '../models/User.js'
import { strToObjId } from '../utils/strToObjId.js'
import Contact from '../models/Contact.js'
import { generateFileURL } from '../utils/generateFileURL.js'
const createNewGroup = async (req, res, next) => {
    try {
        const { groupName, description, members } = req.body
        // console.log(req.body)
        const Admin = req.user.id
        const groupMembers = []
        groupMembers.push({ userId: Admin, isAdmin: true })
        if (!members) return res.status(400).json({ message: 'minimum 2 members are required to form a group' })
        for (const member of members) {
            const userId = await User.findOne({ _id: strToObjId(member) }).select('_id')
            // console.log("USER ID : ", userId, "\n")
            // console.log(userId)
            if (!userId) {
                return res.status(400).json({ message: 'User not found' })
            }
            groupMembers.push({ userId })
        }
        const newGroup = new Contact({
            name: groupName,
            description,
            members: groupMembers,
            isGroup: true
        })
        await newGroup.save()
        return res.status(201).json({ group: { ...newGroup, createdAt: newGroup.createdAt } })
    }
    catch (err) {
        next(err)
    }
}

export const getGroupDetailsHandler = async (groupId, userId) => {
    //Todo: rename userId to user object after populate
    const group = await Contact.findOne({ _id: groupId, "members.userId": userId }).populate({
        path: "members.userId",
        select: "firstName profile email", // Fetch required fields
    }).select('-latestMessageId').lean()
    if (!group) {
        return new Error("Group doesn't exists or you are not a member of this group.")
    }
    // Generate pre-signed URL for group profile
    group.profile = await generateFileURL(group.profile);

    // console.log(group.profile, group.members)
    // Generate pre-signed URLs for members' profiles
    group.members = await Promise.all(
        group.members.map(async (member) => {
            if (member.userId._id == userId) {
                group.unreadMessageCount = member.unReadMessageCount
            }
            return {
                ...member,
                userId: {
                    ...member.userId,
                    profile: await generateFileURL(member.userId.profile),
                },
            }
        }))
    return group
}

const getGroupDetails = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = strToObjId(req.user.id)
        const group = await getGroupDetailsHandler(strToObjId(id), userId)
        return res.status(200).json(group)
    }
    catch (err) {
        next(err)
    }
}

export { createNewGroup, getGroupDetails }