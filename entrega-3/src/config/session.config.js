import { app } from "../app.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

const sessionInit = () => {
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECT,
        ttl: 15,
      }),
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
};

export default sessionInit;
