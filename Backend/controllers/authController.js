import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const loginHandler = async (req,res,next)=>{
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
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        // const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', accessToken, {htttponly : true, secure : true, maxAge : 7*24*60*60*1000})
        res.status(200).json({ message : `${user.userName} Login Successfully`, user});
    } 
    catch (err) {
        next(err)
    }
}

const logoutHandler = async (req,res,next) => {
    try{
        res.clearCookie('jwt');
        res.status(200).json({message : "Logout Successfully"})
    }
    catch(err){
        next(err)
    }
}

export {loginHandler, logoutHandler}