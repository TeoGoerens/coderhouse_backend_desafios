import { Router } from "express";
const router = Router();

//Product Manager class import and new instance
import ProductManager from "../dao/database/ProductManager.js";
const myProductManager = new ProductManager();

//Cart Manager class import and new instance
import CartManager from "../dao/database/cartManager.js";
const myCartManager = new CartManager();

router.get("/", async (req, res) => {
  const products = await myProductManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await myProductManager.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const query = req.query.query || "";
  const sort = req.query.sort || "";

  const products = await myProductManager.getProductsWithFilters(
    limit,
    page,
    query,
    sort
  );

  const prevLink =
    products.hasPrevPage === false
      ? null
      : `http://localhost:8080/products?limit=${limit}&page=${
          parseInt(page, 10) - 1
        }&query=${query}&sort=${sort}`;

  const nextLink =
    products.hasNextPage === false
      ? null
      : `http://localhost:8080/products?limit=${limit}&page=${
          parseInt(page, 10) + 1
        }&query=${query}&sort=${sort}`;

  const simplifiedProducts = products.payload.map((product) => ({
    _id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
  }));

  res.render("products", {
    simplifiedProducts,
    prevLink,
    nextLink,
    style: "products.css",
  });
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await myCartManager.getCartById(cartId);

  cart.products.forEach((product) => {
    product.total = product.id.price * product.quantity;
  });

  const totalCart = cart.products.reduce(
    (total, product) => total + product.total,
    0
  );

  res.render("cart", { cart, totalCart, style: "cart.css" });
});

export default router;
