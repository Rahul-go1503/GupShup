import { model, Schema } from "mongoose";

const groupSchema = new Schema({
    groupName: { type: String, require: [true, 'Group name not provided'] },
    description: { type: String },
    members: [{ userId: { type: Schema.Types.ObjectId }, isAdmin: { type: Boolean, default: false } }],
}, { timestamps: true })

export default model('Group', groupSchema)