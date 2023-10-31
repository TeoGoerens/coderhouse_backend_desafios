//Dotenv import and configuration
import dotenv from "dotenv";
dotenv.config();
const port = parseInt(process.env.PORT, 10);
const mongoConnnect = process.env.MONGO_CONNECT;
const expressSessionSecret = process.env.EXPRESS_SESSION_SECRET;

//Express import and configuration
import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Port configuration
const httpServer = app.listen(port, (err) => {
  if (err) {
    console.log("Error in server setup");
  }
  console.log("Server listening on port ", port);
});

//Handlebars import and configuration
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

//Model import
import { messageModel } from "./dao/models/message.model.js";

//Socket import and configuration
import { Server } from "socket.io";
const socketServer = new Server(httpServer);
app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});

socketServer.on("connection", (socket) => {
  console.log(`User ${socket.id} is now connected`);
  socket.on("message", async (data) => {
    await messageModel.create(data);
    const messages = await messageModel.find().lean();

    socketServer.emit("new_message", messages);
  });
});

//Mongoose import and configuration
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
mongoose.connect(mongoConnnect);

//Session import and configuration
import session from "express-session";
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoConnnect,
      ttl: 15,
    }),
    secret: expressSessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

//Passport import and configuration
import passport from "passport";
import initializePassport from "./config/passport.config.js";
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Router import and configuration
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import userRouter from "./routes/userRouter.js";

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api", userRouter);
