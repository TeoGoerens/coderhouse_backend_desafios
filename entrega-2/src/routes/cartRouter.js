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
  console.log(cart);

  res.status(200).send(cart);
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await myCartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).send(`The cart with id ${cartId} doesn't exist`);
  }

  const emptiedCart = await myCartManager.emptyCart(cartId);
  const products = req.body;

  // We go through the whole array iterating by each element and pushing it into the cart
  for (const product of products) {
    const productId = product.id;
    const quantity = product.quantity;

    emptiedCart.products.push({
      id: productId,
      quantity,
    });
  }

  await emptiedCart.save();

  res.status(200).send(emptiedCart);
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

router.put("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = await myCartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).send(`The cart with id ${cartId} doesn't exist`);
  }

  const quantity = req.body.quantity;

  console.log(cart.products[0]);

  // Searching the corresponding product in the above found cart
  const product = cart.products.find((p) => p.id._id == productId);

  // If product doesn't exist, we return error 404
  if (!product) {
    return res
      .status(404)
      .send(
        `The product with id ${productId} doesn't exist in the selected cart`
      );
  }

  // Product's quantity is updated in the cart
  product.quantity = quantity;
  await cart.save();

  res.status(200).send(cart);
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const cart = await myCartManager.deleteProductFromCart(cartId, productId);

  res.send(cart);
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  const cart = await myCartManager.emptyCart(cartId);

  res.send(cart);
});

export default router;
