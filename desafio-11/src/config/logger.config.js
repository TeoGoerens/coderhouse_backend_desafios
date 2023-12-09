import winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

export default logger;
