import {model, Schema} from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
    userName : {
        type : String
    },
    email :{
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    firstName : {
        type : String,
        require : true
    },
    lastName : {
        type : String
    },
    isActive : {
        type : Boolean,
        default : true
    },
    profileImg : {
        type : String
    },
    lastActive : {
        type : Date
    },
    phone : {
        type : Number
    },
    country : {
        type : String,
        default : 'India'
    }
},
{
    timestamps : true
}
)

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')){
        try{
            const salt = await bcrypt.genSalt(10);
            // Store hash in your password DB.
            this.password = await bcrypt.hash(this.password, salt); // Note: await has effect here bcrypt hash returns a promise
        }
        catch(err){
            next(err);
        }
    }
    next();
});
  
// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
};

export default model('User',UserSchema);