import { model, Schema } from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    messageTye: {
        type: String,
        enum: ['text', 'image', 'video', 'audio'],
    },

    message: {
        type: String
    },

    media: {
        type: String
    }
},
    {
        timestamps: true
    }
)

export default model('Message', messageSchema)