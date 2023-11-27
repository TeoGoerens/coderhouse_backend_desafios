import Controllers from "./class.controller.js";
import ProductRepository from "../persistence/daos/repository/product.repository.js";
import { faker } from "@faker-js/faker";

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

  getMockingProducts = async (req, res, next) => {
    try {
      // Generar 10 productos de ejemplo con Faker
      const mockProducts = Array.from({ length: 10 }, () => ({
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: parseFloat(faker.commerce.price()),
        thumbnail: [faker.image.imageUrl()],
        code: faker.datatype.uuid(),
        stock: faker.datatype.number({ min: 1, max: 100 }),
        status: true,
        category: faker.commerce.department(),
      }));

      return res.status(200).send(mockProducts);
    } catch (error) {
      console.error("Error while trying to gerente products:", error);
      res.status(500).send("Server internal error");
    }
  };
}
