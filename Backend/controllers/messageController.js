import mongoose from "mongoose"
import Message from "../models/Message.js"

// get All messages for a user
const getAllMessagesById = async (req, res) => {
    try {
        const senderId = req.user.id
        const receiverId = req.body.id
        console.log('senderId: ', senderId, 'receiverId: ', receiverId)

        // Todo : use Helper function to covert to ObjectId or handle it at frontend
        // const messages = await Message.aggregate([
        //     {
        //         $match: {
        //             $or: [
        //                 { senderId: mongoose.Types.ObjectId.createFromHexString(senderId), receiverId: mongoose.Types.ObjectId.createFromHexString(receiverId) },
        //                 { senderId: mongoose.Types.ObjectId.createFromHexString(receiverId), receiverId: mongoose.Types.ObjectId.createFromHexString(senderId) }
        //             ]
        //         }
        //     },
        //     {
        //         $addFields: {
        //             fromSelf: {
        //                 $cond: {
        //                     if: { $eq: ['$senderId', mongoose.Types.ObjectId.createFromHexString(senderId)] },
        //                     then: true,
        //                     else: false
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             message: 1,
        //             createdAt: 1,
        //             fromSelf: 1
        //         }
        //     }
        // ]);

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
        // console.log(messages)
        res.status(200).json({ messages })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}
// send message

export { getAllMessagesById }