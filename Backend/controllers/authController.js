import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const loginHandler = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Check if user already exists
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(401).json({ message: "Invalid Credentials" })
        }

        const isPasswordMatch = await user.matchPassword(password);
        if(!isPasswordMatch){
            return res.status(401).json({message : "Invalid Credentials"})
        }
        // Generate token
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', refreshToken, {htttponly : true, secure : true, maxAge : 7*24*60*60*1000})
        res.status(200).json({ message : `${user.userName} Login Successfully`, data : {accessToken}});
    } 
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error.message) });
    }
}

const logoutHandler = async (req,res) => {
    res.clearCookie('jwt');
    res.status(200).json({message : "Logout Successfully"})
}

export {loginHandler, logoutHandler}