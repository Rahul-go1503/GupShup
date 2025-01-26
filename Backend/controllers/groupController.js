import User from '../models/User.js'
import { strToObjId } from '../utils/strToObjId.js'
import Contact from '../models/Contact.js'
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
        return res.status(201).json({ group: { ...newGroup, latestMessageAt: newGroup.createdAt } })
    }
    catch (err) {
        next(err)
    }
}

const updateGroupDetails = async (req, res, next) => {
    try {
        const { groupId, groupName, description } = req.body
        const group = await Group.findByIdAndUpdate({ _id: groupId }, { groupName, description }, { returnDocument: 'after' })
        if (!group) {
            return res.status(403).json({ message: "Something Went Wrong" })
        }
        return res.status(200).json({ group, message: "Details updated successfully" })

    } catch (err) {
        next(err)

    }
}

const updateGroupAdmins = async (req, res, next) => {
    try {
        const { groupId, members } = req.body
        const group = await Group.findByIdAndUpdate({ _id: groupId }, { members }, { returnDocument: 'after' })
        if (!group) {
            return res.status(403).json({ message: "Something Went Wrong" })
        }
        return res.status(200).json({ group, message: "Admins updated successfully" })
    }
    catch (err) {
        next(err)
    }
}

const addNewMember = async (req, res, next) => {
    try {
        const { groupId, userId } = req.body
        const user = await User.findById(strToObjId(userId)).select('_id')
        if (!user) {
            return res.status(400).json({ message: 'User doesn\'t exists' })
        }
        const group = await Group.findByIdAndUpdate(strToObjId(groupId),
            {
                $push: {
                    members: { userId }
                }
            },
            { new: true })
        res.status(200).json({ group, message: "member added successfully" })
    }
    catch (err) {
        next(err)
    }
}

const removeMember = async (req, res, next) => {
    try {
        const { groupId, userId } = req.body
        const user = await User.findById(strToObjId(userId)).select('_id')
        if (!user) {
            return res.status(400).json({ message: 'User doesn\'t exists' })
        }
        const group = await Group.findByIdAndUpdate(strToObjId(groupId),
            {
                $pull: {
                    members: { userId }
                }
            },
            { new: true })
        res.status(200).json({ group, message: "member removed successfully" })
    }
    catch (err) {
        next(err)
    }
}

const deleteGroup = async (req, res, next) => {
    try {
        const { id } = req.params
        const group = await Group.findByIdAndDelete(strToObjId(id))
        if (!group) {
            return res.status(400).json({ message: "Group doesn't exits" })
        }
        res.status(200).json({ message: 'Group deleted successfully' })
    }
    catch (err) {
        next(err)
    }
}

const getGroupDetails = async (req, res, next) => {
    try {
        const { id } = req.params
        const group = await Group.findOne({ _id: strToObjId(id) })
        if (!group) {
            return res.status(403).json({ message: "Group doesn't exists" })
        }
        return res.status(200).json({ group })
    }
    catch (err) {
        next(err)
    }
}

export { createNewGroup, updateGroupDetails, updateGroupAdmins, deleteGroup, getGroupDetails, addNewMember, removeMember }