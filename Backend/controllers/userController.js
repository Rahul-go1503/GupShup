import User from "../models/User.js";

// Create User - sign up
const createUser = async (req,res)=>{
    const {firstName,email, password} = req.body;

    if(!firstName || !email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        //console.log(existingUser);
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        // Create new user
        const user = await User.create({ firstName, email, password});
        // Generate token
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', accessToken, {htttponly : true, secure : true, maxAge : 7*24*60*60*1000})
        //console.log(token);
        res.status(201).json({ message: 'User Created', user});
    } 
    catch (error) {
        // console.log(error)
        res.status(500).json({ message: 'Error creating user', error : error });
    }
}

// Update User
const updateUser = async()=>{}

// Delete User
const deleteUser = async()=>{}

// Get All Users
const getAllUsers = async()=>{}

// Get User By Id
const getUserById = async()=>{}

export {createUser,updateUser,deleteUser,getAllUsers,getUserById}