import { transporter, sender } from "./emailConfig.js";
import {
    getPasswordResetEmailTemplate,
    getPasswordResetSuccessEmailTemplate,
    getVerificationEmailTemplate
} from "./emailTemplates.js";

export const sendVerificationEmail = async (firstName, email, verificationLink) => {
    const emailHTML = getVerificationEmailTemplate(firstName, verificationLink);
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Verify your email",
            html: emailHTML
        });
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (firstName, email, resetURL) => {
    const emailHtml = getPasswordResetEmailTemplate(firstName, resetURL)
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset your password",
            html: emailHtml
        });
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (firstName, email) => {
    const emailHtml = getPasswordResetSuccessEmailTemplate(firstName)
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset Successful",
            html: emailHtml,
        });
    } catch (error) {
        console.error(`Error sending password reset success email`, error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};