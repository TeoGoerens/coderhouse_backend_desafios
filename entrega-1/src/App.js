//Express import and configuration
import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 8080;

//Router import and configuration
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

//Port configuration
app.listen(port, (err) => {
  if (err) {
    console.log("Error in server setup");
  }
  console.log("Server listening on port ", port);
});
