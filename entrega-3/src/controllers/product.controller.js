import Controllers from "./class.controller.js";
import ProductRepository from "../persistence/daos/repository/product.repository.js";

const productRepository = new ProductRepository();

export default class ProductController extends Controllers {
  constructor() {
    super(productRepository);
  }

  getProducts = async (req, res, next) => {
    try {
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;
      const query = req.query.query || "";
      const sort = req.query.sort || "";

      const products = await this.repository.getProducts(
        limit,
        page,
        query,
        sort
      );
      res.status(200).send(products);
    } catch (error) {
      next(error.message);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const productToLoad = req.body;
      await this.repository.createProduct(productToLoad);
      if (!productToLoad) {
        res.status(404).send({ method: "create", error: "Validation error!" });
      } else res.status(200).send(productToLoad);
    } catch (error) {
      next(error.message);
    }
  };
}
