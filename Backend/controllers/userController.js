import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// Create User - sign up
const createUser = async (req, res, next) => {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        //console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({ firstName, email, password });
        // Generate token

        // Todo: Refresh Token
        // Check: On sign up I'm not generating token
        // const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

        // res.cookie('jwt', accessToken, {
        //     htttponly : true,
        //     secure : process.env.NODE_ENV !== 'development',
        //     maxAge : 7*24*60*60*1000,
        //     sameSite : 'strict'
        // })
        // console.log(accessToken);

        // Check: response
        res.status(201).json({ message: 'User Created', user });
    }
    catch (error) {
        next(error)
    }
}

// Update User
const updateUser = async () => { }

// Delete User
const deleteUser = async (req, res, next) => {
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
const getAllContacts = async (req, res, next) => {
    try {
        const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id)
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            },
            {
                $sort: { updatedAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$senderId', userId] },
                            then: '$receiverId',
                            else: '$senderId'
                        }
                    },
                    lastMessageTime: { $first: '$updatedAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contactInfo'
                }
            },
            {
                $unwind: '$contactInfo'
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    firstName: '$contactInfo.firstName',
                    lastName: '$contactInfo.lastName',
                    email: '$contactInfo.email',
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }

        ])
        res.status(200).json(contacts)
    }
    catch (err) {
        next(err)
    }
}

// Get All Users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json(users)
    }
    catch (err) {
        next(err)
    }
}

// Get User By Id
const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await User.find({ _id: userId }).select('-password')
        res.status(200).json({ user })
    }
    catch (err) {
        next(err)
    }
}

export { createUser, updateUser, deleteUser, getAllUsers, getUserInfo, getAllContacts }