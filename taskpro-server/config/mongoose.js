import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export const connecToDB = async () => {
  try {
    // Debug: Log what DATABASE_URL we're getting
    const dbUrl =
      process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/taskpro";
    // Set timeout options
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 second timeout for Atlas
      connectTimeoutMS: 10000,
    };

    await mongoose.connect(dbUrl, options);
  } catch (err) {
    // Don't exit - let the app run without database for socket testing
  }
};
