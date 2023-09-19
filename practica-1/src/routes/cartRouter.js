import { Router } from "express";
const router = Router();

//Product Manager class import and new instance
import CartManager from "../dao/database/cartManager.js";
const myCartManager = new CartManager();

//Endpoints configuration
router.get("/", async (req, res) => {
  const carts = await myCartManager.getCarts();
  res.status(200).send(carts);
});

router.post("/", async (req, res) => {
  const newCart = await myCartManager.addCart();
  const newCartId = newCart.id;
  res.status(200).json({ message: `Cart with id ${newCartId} was created` });
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await myCartManager.getCartById(cartId);
  res.status(200).send(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartReference = req.params.cid;
  const productReference = req.params.pid;
  const cartUpdated = await myCartManager.addProductToCart(
    cartReference,
    productReference
  );
  res.send(cartUpdated);
});

export default router;
