import { model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { defaultMongooseObjectId } from '../utils/strToObjId.js';

const UserSchema = new Schema({
    userName: { type: String },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String },
    isActive: { type: Boolean, default: true },
    profileImg: { type: String },
    lastActive: { type: Date },
    phone: { type: Number },
    country: { type: String, default: 'India' }
}, { timestamps: true }
)

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            // Store hash in your password DB.
            this.password = await bcrypt.hash(this.password, salt); // Note: await has effect here bcrypt hash returns a promise
        }
        catch (err) {
            next(err);
        }
    }
    next();
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = model('User', UserSchema)

// Function to ensure the default document exists
const ensureDefaultDocument = async () => {
    const defaultDoc = {
        _id: defaultMongooseObjectId
    };

    try {
        // Check if the default document exists
        const exists = await User.findById(defaultDoc._id);

        if (!exists) {
            // Create the default document
            await User.create(defaultDoc);
            console.log('Default User created');
        } else {
            console.log('Default User already exists');
        }
    } catch (err) {
        console.error('Error ensuring default document:', err);
    }
};

// Call this function during application startup
// ensureDefaultDocument().catch(console.error)

export default User