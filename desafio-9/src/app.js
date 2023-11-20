import express from "express";
import dotenv from "dotenv";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Port configuration
const PORT = process.env.PORT;
export const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

//Express Session init in MongoDB
import sessionInit from "./config/session.config.js";
sessionInit();

//Socket Initialization
import socketInit from "./config/socket.config.js";
socketInit();

//Handlebars import and configuration
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

//Passport import and configuration
import passport from "passport";
import initializePassport from "./config/passport.config.js";
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Router import and configuration
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import userRouter from "./routes/user.router.js";
import viewRouter from "./routes/views.router.js";

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api", userRouter);
app.use("/", viewRouter);
