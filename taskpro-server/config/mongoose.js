import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export const connecToDB = async () => {
  try {
    // Try local MongoDB first, fallback to in-memory if not available
    const dbUrl =
      process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/taskpro";

    // Set timeout options
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 5000,
    };

    await mongoose.connect(dbUrl, options);
    console.log("MongoDB connected successfully to:", dbUrl);
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
    console.log(
      "Note: For development, you can install MongoDB locally or use MongoDB Atlas with IP whitelist"
    );
    // Don't exit - let the app run without database for socket testing
    console.log("App will continue running for socket testing...");
  }
};
