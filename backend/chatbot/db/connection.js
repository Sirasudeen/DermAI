
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDatabase = async () => {
    const mongoUri = process.env.MONGODB_URL;

    if (!mongoUri) {
        console.error("Error: MONGODB_URL environment variable is not defined.");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
};
