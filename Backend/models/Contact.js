import { model, Schema } from "mongoose";

const contactSchema = new Schema({
    name: { type: String },
    description: { type: String },
    profile: { type: String },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        isAdmin: { type: Boolean, default: false, },
        unReadMessageCount: { type: Number, default: 0 },
    }],
    latestMessageId: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    isGroup: { type: Boolean, default: false },
}, { timestamps: true })

export default model('Contact', contactSchema)