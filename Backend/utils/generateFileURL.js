import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/s3Config.js";

// Todo: rename the file name

export const generatePresignedUrl = async (data) => {
    const { fileType, key } = data; // Get file name and type from frontend
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 5 * 60 }) // 5 min expiry
}

export const generateFileURL = async (fileKey) => {
    if (!fileKey) return null
    // console.log(fileKey)
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    });
    // console.log(s3Client)
    // console.log("AWS Credentials:", {
    //     region: process.env.AWS_REGION,
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // });
    return await getSignedUrl(s3Client, command, { expiresIn: 24 * 60 * 60 }); // 1 day expiry
}

export const deleteFile = async (fileKey, next) => {
    try {
        if (!fileKey) return
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey, // File path in S3
        };

        await s3Client.send(new DeleteObjectCommand(params));
        // return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        next(error)
        // return { success: false, message: 'Error deleting file', error };
    }
}