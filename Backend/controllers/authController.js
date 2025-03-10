import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateFileURL } from '../utils/generateFileURL.js';

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

        // Todo: change id to _id in payload
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        // const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', accessToken, cookieOptions)
        // Todo: remove password from here
        const data = {
            _id: user._id,
            firstName: user.firstName,
            email: user.email,
            createdAt: user.createdAt,
            profile: await generateFileURL(user.profile)
        }
        res.status(200).json({ message: `${user.firstName} Login Successfully`, user: data });
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
        const user = await User.findById(userId).select('-password')
        const data = {
            _id: user._id,
            firstName: user.firstName,
            email: user.email,
            createdAt: user.createdAt,
            profile: await generateFileURL(user.profile)
        }
        res.status(200).json({ user: data })
    }
    catch (err) {
        next(err)
    }
}
export { loginHandler, logoutHandler, checkAuthHandler }