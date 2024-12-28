import { connect } from "mongoose";

import mongoose from 'mongoose';

mongoose.set('debug', true);
// MongoDB connection

const connectToDatabase = async () => {
    try {
        const conn = await connect(process.env.MONGODB_URI)
        console.log('MongoDB Connected:', conn.connection.host);
    } 
    catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure code

        //  what is progress
    }
};

export default connectToDatabase;