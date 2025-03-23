import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { config } from "dotenv";

config()

const ses = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const sendEmail = async (to, subject, htmlContent) => {
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: { ToAddresses: [to] },
        Message: {
            Subject: { Data: subject },
            Body: { Html: { Data: htmlContent } },
        },
    };
    return await ses.send(new SendEmailCommand(params));
};