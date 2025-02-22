import { model, Schema } from "mongoose";
import { defaultMongooseObjectId } from "../utils/strToObjId.js";

const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    receiverIds: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
        sendAt: { type: Date },
        receiveAt: { type: Date },
        seenAt: { type: Date },
    }],
    isNotification: { type: Boolean },
    messageType: { type: String, enum: ['text', 'image', 'video', 'audio', 'pdf', 'file'], default: 'text' },
    // messageTye: { type: String, enum: ['text', 'image', 'video', 'audio'], default: 'text' },
    message: { type: String },
    fileKey: { type: String },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
    parentId: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true }
)

const Message = model('Message', messageSchema)

// Function to ensure the default document exists
const ensureDefaultDocument = async () => {
    const defaultDoc = {
        _id: defaultMongooseObjectId,
        senderId: defaultMongooseObjectId,
    };

    try {
        // Check if the default document exists
        const exists = await Message.findById(defaultDoc._id);

        if (!exists) {
            // Create the default document
            await Message.create(defaultDoc);
            console.log('Default document created');
        } else {
            console.log('Default Message already exists');
        }
    } catch (err) {
        console.error('Error ensuring default document:', err);
    }
};

// Call this function during application startup
// ensureDefaultDocument().catch(console.error)

export default Message