import mongoose from "mongoose"

export const strToObjId = (id) => {
    return mongoose.Types.ObjectId.createFromHexString(id)
}