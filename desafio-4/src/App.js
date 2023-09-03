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

//Socket import and configuration
import { Server } from "socket.io";
const socketServer = new Server(httpServer);
app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});

socketServer.on("connection", (socket) => {
  console.log(`User ${socket.id} is now connected`);
});

//Router import and configuration
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
