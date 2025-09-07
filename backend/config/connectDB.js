import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI); 
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error connecting to the database:", error);
    }
};