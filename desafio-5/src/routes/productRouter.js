import { Router } from "express";
const router = Router();

//Product Manager class import and new instance
import ProductManager from "../dao/database/ProductManager.js";
const myProductManager = new ProductManager();

//Endpoints configuration
router.get("/", async (req, res) => {
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

  products.status = "success";

  const prevLink =
    products.hasPrevPage === false
      ? null
      : `http://localhost:8080/api/products?limit=${limit}&page=${
          parseInt(page, 10) - 1
        }&query=${query}&sort=${sort}`;
  products.prevLink = prevLink;

  const nextLink =
    products.hasNextPage === false
      ? null
      : `http://localhost:8080/api/products?limit=${limit}&page=${
          parseInt(page, 10) + 1
        }&query=${query}&sort=${sort}`;
  products.nextLink = nextLink;

  res.send(products);
});

router.post("/", async (req, res) => {
  const newProductPOST = req.body;
  const newProduct = await myProductManager.addProduct(
    newProductPOST.title,
    newProductPOST.description,
    newProductPOST.code,
    newProductPOST.price,
    newProductPOST.status,
    newProductPOST.stock,
    newProductPOST.category,
    newProductPOST.thumbnails
  );

  const products = await myProductManager.getProducts();

  req.context.socketServer.emit("products", products);
  res.status(200).send();
});

router.get("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await myProductManager.getProductById(productId);
  res.send(product);
});

router.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const updatedProductPOST = req.body;
  const updatedProduct = await myProductManager.updateProduct(
    productId,
    updatedProductPOST
  );
  res.send(updatedProduct);
});

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const deteledProduct = await myProductManager.deleteProductById(productId);
  res.send(deteledProduct);
});

export default router;
