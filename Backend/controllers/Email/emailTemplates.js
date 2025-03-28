// Todo: change templates
export const getVerificationEmailTemplate = (firstName, verificationLink) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <!-- Brand -->
        <div style="display: flex; align-items: center; justify-content: start; padding-bottom: 20px; border-bottom: 2px solid #eeeeee;">
            
            <h1 style="margin: 0; padding: 0; color: #7a52ff;">GupShup</h1>
        </div>

        <!-- Header -->
        <div style="padding: 10px 0;">
            <h2 style="color: #333; margin: 0;">Verify Your Email</h2>
        </div>

        <!-- Content -->
        <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #555;">Hi, ${firstName}</p>
            <p style="font-size: 16px; color: #555;">Thank you for signing up! Please click the button below to verify your email address.</p>

            <!-- CTA Button -->
            <a href="${verificationLink}" 
                style="display: inline-block; padding: 12px 20px; margin: 20px 0; font-size: 16px; color: #fff; background: #7a52ff; border-radius: 5px; text-decoration: none;">
                Verify Email
            </a>

            <p style="font-size: 14px; color: #777;">If you are not able to click the button above, you can also verify your email by copying and pasting the following link in your browser:</p>
            <p style="word-break: break-word; font-size: 14px; color: #555;">${verificationLink}</p>

            <p style="font-size: 14px; color: #777;">You have received this email because you are registered at GupShup. If you didn’t request this, you can safely ignore this email.</p>
        </div>

        <!-- Footer -->
        <div style=": padding: 15px 0; font-size: 14px; color: #777; border-top: 2px solid #eeeeee;">
            <p>&copy; 2025 GupShup. All rights reserved.</p>
            <p>
                <a href="#" style="color: #7a52ff; text-decoration: none;">Privacy Policy</a> | 
                <a href="mailto:rahulgyl.con@gmail.com" style="color: #7a52ff; text-decoration: none;">Support</a>
            </p>
        </div>
    </div>
</body>

</html>
`;

export const getPasswordResetEmailTemplate = (firstName, resetLink) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 10px; 
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <!-- Brand Header -->
        <div style="display: flex; align-items: center; padding-bottom: 20px; border-bottom: 2px solid #eeeeee;">
            <h1 style="margin: 0; padding: 0; color: #7a52ff;">GupShup</h1>
        </div>

        <!-- Email Header -->
        <div style="padding: 10px 0;">
            <h2 style="color: #333; margin: 0;">Reset Your Password</h2>
        </div>

        <!-- Email Content -->
        <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #555;">Hi, ${firstName},</p>
            <p style="font-size: 16px; color: #555;">We received a request to reset your password. Click the button below to proceed.</p>

            <!-- Reset Button -->
            <p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; 
                   color: #fff; background: #7a52ff; border-radius: 5px; text-decoration: none;">
                   Reset Password
                </a>
            </p>

            <p style="font-size: 16px; color: #555;">If you didn’t request this, you can safely ignore this email.</p>
            <p style="font-size: 16px; color: #555;">Alternatively, you can reset your password by copying and pasting the following link in your browser:</p>
            <p style="word-break: break-word; color: #7a52ff;">${resetLink}</p>
        </div>

        <!-- Footer -->
        <div style="padding: 15px 0; font-size: 14px; color: #777; border-top: 2px solid #eeeeee;">
            <p>&copy; 2025 GupShup. All rights reserved.</p>
            <p><a href="mailto:rahulgyl.con@gmail.com" style="color: #7a52ff; text-decoration: none;">Privacy Policy</a> | 
               <a href="mailto:rahulgyl.con@gmail.com" style="color: #7a52ff; text-decoration: none;">Support</a></p>
        </div>

    </div>
</body>
</html>
`;


export const getPasswordResetSuccessEmailTemplate = (firstName) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 10px; 
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <!-- Brand Header -->
        <div style="padding-bottom: 20px; border-bottom: 2px solid #eeeeee;">
            <h1 style="margin: 0; color: #7a52ff;">GupShup</h1>
        </div>

        <!-- Email Header -->
        <div style="padding: 10px 0;">
            <h2 style="color: #333; margin: 0;">Password Reset Successful</h2>
        </div>

        <!-- Email Content -->
        <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #555;">Hi ${firstName},</p>
            <p style="font-size: 16px; color: #555;">Your password has been successfully reset. You can now log in to your account using your new password.</p>

            <p style="font-size: 16px; color: #555;">If you did not request this change, please contact our support team immediately.</p>

            <!-- Login Button -->
            <p>
                <a href="https://gupshup.site/login" style="display: inline-block; padding: 12px 20px; font-size: 16px; 
                   color: #fff; background: #7a52ff; border-radius: 5px; text-decoration: none;">
                   Log In
                </a>
            </p>
        </div>

        <!-- Footer -->
        <div style="padding: 15px 0; font-size: 14px; color: #777; border-top: 2px solid #eeeeee;">
            <p>&copy; 2025 GupShup. All rights reserved.</p>
            <p><a href="mailto:rahulgyl.con@gmail.com" style="color: #7a52ff; text-decoration: none;">Privacy Policy</a> | 
               <a href="mailto:rahulgyl.con@gmail.com" style="color: #7a52ff; text-decoration: none;">Support</a></p>
        </div>

    </div>
</body>
</html>
`;

