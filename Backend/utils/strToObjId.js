import mongoose from "mongoose"

export const strToObjId = (id) => {
    return mongoose.Types.ObjectId.createFromHexString(id)
}

export const defaultMongooseObjectId = mongoose.Types.ObjectId.createFromHexString('000000000000000000000000')