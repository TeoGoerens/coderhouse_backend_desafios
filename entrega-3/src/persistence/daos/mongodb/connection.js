import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const initMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`ERROR => ${error}`);
  }
};
