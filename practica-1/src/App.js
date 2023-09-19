//Express import and configuration
import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Port configuration
const port = 8080;
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
mongoose.connect(
  "mongodb+srv://teogoerens:zeJMLii6A7WQOzks@cluster0.ydqk4rv.mongodb.net/e-commerce?retryWrites=true&w=majority"
);

//Router import and configuration
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
