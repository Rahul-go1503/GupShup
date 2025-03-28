import { transporter, sender } from "./emailConfig.js";
import {
    getPasswordResetEmailTemplate,
    getPasswordResetSuccessEmailTemplate,
    getVerificationEmailTemplate
} from "./emailTemplates.js";

export const sendVerificationEmail = async (firstName, email, verificationLink) => {
    // const recipient = [{ email }];
    const emailHTML = getVerificationEmailTemplate(firstName, verificationLink);
    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Verify your email",
            // html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            html: emailHTML
        });

        // console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);

        throw new Error(`Error sending verification email: ${error}`);
    }
};
/*
export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df",
            template_variables: {
                company_info_name: "Auth Company",
                name: name,
            },
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);

        throw new Error(`Error sending welcome email: ${error}`);
    }
};
*/

export const sendPasswordResetEmail = async (firstName, email, resetURL) => {
    // const recipient = [{ email }];
    const emailHtml = getPasswordResetEmailTemplate(firstName, resetURL)
    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset your password",
            html: emailHtml
            // category: "Password Reset",
        });
    } catch (error) {
        console.error(`Error sending password reset email`, error);

        throw new Error(`Error sending password reset email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (firstName, email) => {
    // const recipient = [{ email }];
    const emailHtml = getPasswordResetSuccessEmailTemplate(firstName)
    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset Successful",
            html: emailHtml,
            // category: "Password Reset",
        });

        // console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error(`Error sending password reset success email`, error);

        throw new Error(`Error sending password reset success email: ${error}`);
    }
};