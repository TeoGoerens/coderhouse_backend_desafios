import { app } from "../../../app.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

export const initMongoDB = async () => {
  try {
    //Connection to MongoDB
    await mongoose.connect(process.env.MONGO_CONNECT);
    console.log("Connected to MongoDB");

    //Session import and configuration
  } catch (error) {
    console.log(`ERROR => ${error}`);
  }
};
