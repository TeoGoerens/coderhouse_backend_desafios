import { Router } from "express";
const router = Router();

//Product Manager class import and new instance
import CartManager from "../cartManager.js";
const myCartManager = new CartManager();

//Endpoints configuration

router.post("/", async (req, res) => {
  const newCart = await myCartManager.addCart();
  res.send(newCart);
});

router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const cart = await myCartManager.getCartById(cartId);
  res.send(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartReference = parseInt(req.params.cid, 10);
  const productReference = parseInt(req.params.pid, 10);
  const cartUpdated = await myCartManager.addProductToCart(
    cartReference,
    productReference
  );
  res.send(cartUpdated);
});

export default router;
