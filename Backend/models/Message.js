import { model, Schema } from "mongoose";

const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    messageTye: { type: String, enum: ['text', 'image', 'video', 'audio'], default: 'text' },
    message: { type: String },
    media: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' }
}, { timestamps: true }
)

export default model('Message', messageSchema)