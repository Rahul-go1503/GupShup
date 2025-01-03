import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const cookieOptions = {
    htttponly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'none' // Cross-origin cookie sharing
}
const loginHandler = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Check if user already exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }
        // Generate token
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        // const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', accessToken, cookieOptions)
        // Todo: remove password from here
        res.status(200).json({ message: `${user.firstName} Login Successfully`, user });
    }
    catch (err) {
        next(err)
    }
}

const logoutHandler = async (req, res, next) => {
    try {
        res.clearCookie('jwt', '', cookieOptions);
        res.status(200).json({ message: "Logout Successfully" })
    }
    catch (err) {
        next(err)
    }
}

const checkAuthHandler = async (req, res, next) => {
    try {
        const userId = req.user.id
        // console.log(req.user)
        const user = await User.findOne({ _id: userId }).select('-password')
        res.status(200).json({ user })
    }
    catch (err) {
        next(err)
    }
}
export { loginHandler, logoutHandler, checkAuthHandler }