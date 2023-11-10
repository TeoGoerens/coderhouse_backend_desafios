import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
