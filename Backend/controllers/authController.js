import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateFileURL } from '../utils/generateFileURL.js';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail } from './Email/emails.js';
import crypto from "crypto";

const cookieOptions = {
    httponly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none' // Cross-origin cookie sharing
}

// Create User - sign up
export const signupHandler = async (req, res, next) => {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
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
        const user = await User.create({ firstName, email, password }); // password is hashed in pre hook
        // Generate verification token
        const verificationToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        // Send email
        console.log(verificationLink);
        await sendVerificationEmail(firstName, email, verificationLink);

        res.status(200).json({ message: "Verification email sent. Please check your inbox." });

        // Check: response
        // res.status(201).json({ message: 'User Created', user });
    }
    catch (error) {
        next(error)
    }
}

export const resendVerificationLinkHandler = async (req, res) => {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found." });

    // Check if email is already verified
    if (user.isEmailVerified) return res.status(400).json({ error: "Email is already verified." });

    // Generate verification token
    const verificationToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Send email
    // console.log(verificationLink);
    await sendVerificationEmail(user.firstName, email, verificationLink);
    res.json({ message: "Verification email sent. Please check your inbox." });
}
export const verifyEmailHandler = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "link is invalid" });

        if (user.isEmailVerified) {
            return res.status(200).json({ message: "Email already verified" });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error, please try after some time" });
    }
};

export const forgotPasswordHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiry
        await user.save();

        // Send email with reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        // console.log(resetLink)
        await sendPasswordResetEmail(user.firstName, email, resetLink)
        // await sendEmail(email, "Reset Your Password", `Click here to reset: ${resetLink}`);

        res.json({ message: "Reset link sent to email." });
    }
    catch (err) {
        next(err)
    }
}

export const resetPasswordHandler = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendResetSuccessEmail(user.firstName, user.email)
        res.json({ message: "Password reset successful" });
    }
    catch (err) {
        next(err)
    }
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
        if (!user.isEmailVerified) {
            return res.status(403).json({ message: "Email not verified" })
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