import Message from "../models/Message"

// get All messages for a user
const getAllMessagesById = async(req, res) => {
    try{
        const senderId = req.user._id
        const receiverId = req.body.id

        const messages = await Message.find({
            $or : [
                {senderId : senderId, receiverId : receiverId}
            ]
        })
        res.status(200).json({messages})
    }
    catch(error){
        res.status(500).json({message : 'Internal Server Error', error : error})
    }
}
// send message

export {getAllMessagesById}