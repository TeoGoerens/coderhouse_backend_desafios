import { Router } from "express";
const router = Router();

//Product Manager class import and new instance
import ProductManager from "../ProductManager.js";
const myProductManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await myProductManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await myProductManager.getProducts();
  res.render("realTimeProducts", { products });
});

export default router;
