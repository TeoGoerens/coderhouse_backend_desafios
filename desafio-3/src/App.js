//Express import and configuration
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 8080;

//Product Manager class import and new instance
const ProductManager = require("./ProductManager.js");
const myProductManager = new ProductManager();

//Endpoint configurations
app.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  const products = await myProductManager.getProducts();

  if (limit) {
    return res.send(products.slice(0, limit));
  }
  res.send(products);
});

app.get("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const product = await myProductManager.getProductById(productId);
  res.send(product);
});

//Port configuration
app.listen(port, (err) => {
  if (err) {
    console.log("Error in server setup");
  }
  console.log("Server listening on port ", port);
});
