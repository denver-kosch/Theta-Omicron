import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODBURI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;