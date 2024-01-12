import Controllers from "./class.controller.js";
import ProductRepository from "../persistence/daos/repository/product.repository.js";
import { faker } from "@faker-js/faker";
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";

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
      if (
        req.session.user.role != "admin" &&
        req.session.user.role != "premium"
      ) {
        return res
          .status(500)
          .send("Users without ADMIN or PREMIUM roles can not create products");
      } else {
        const productToLoad = req.body;
        const userEmail = req.session.user.email;
        const owner = await userModel.findOne({ email: userEmail });
        const ownerId = owner._id;

        await this.repository.createProduct(productToLoad, ownerId);
        if (!productToLoad) {
          return res
            .status(404)
            .send({ method: "create", error: "Validation error!" });
        } else return res.status(200).send(productToLoad);
      }
    } catch (error) {
      next(error.message);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      //Informacion del usuario que navega
      const user = await userModel.findOne({ email: req.session.user.email });
      const userRole = user.role;
      const userId = user._id;

      //Informacion del producto que se desea modificar
      const { pid } = req.params;
      let item = await this.repository.getById(pid);

      //Verifico si existe el item en la base de datos
      if (!item)
        return res
          .status(404)
          .send({ method: "update", error: "Item not found!" });

      //Verifico que el usuario tenga rol PREMIUM o ADMIN
      if (userRole != "admin" && userRole != "premium") {
        return res.send(
          "Users without ADMIN or PREMIUM roles can not update products"
        );
      } else if (
        //Verifico que si el usuario tiene rol PREMIUM entonces haya sido el creador del producto que se desea modificar

        userRole == "premium" &&
        String(userId) != String(item.owner)
      ) {
        return res.send(
          "Users with PREMIUM roles are only allowed to update their own products"
        );
      }

      const itemUpdated = await this.repository.update(pid, req.body);
      res.status(200).send(itemUpdated);
    } catch (error) {
      next(error.message);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      //Informacion del usuario que navega
      const user = await userModel.findOne({ email: req.session.user.email });
      const userRole = user.role;
      const userId = user._id;

      //Informacion del producto que se desea modificar
      const { pid } = req.params;
      let item = await this.repository.getById(pid);

      //Verifico si existe el item en la base de datos
      if (!item)
        return res
          .status(404)
          .send({ method: "delete", error: "Item not found!" });

      //Verifico que el usuario tenga rol PREMIUM o ADMIN
      if (userRole != "admin" && userRole != "premium") {
        return res.send(
          "Users without ADMIN or PREMIUM roles can not delete products"
        );
      } else if (
        //Verifico que si el usuario tiene rol PREMIUM entonces haya sido el creador del producto que se desea modificar

        userRole == "premium" &&
        String(userId) != String(item.owner)
      ) {
        return res.send(
          "Users with PREMIUM roles are only allowed to delete their own products"
        );
      }

      await this.repository.delete(pid);
      res.status(200).send({ message: "Item deleted", deleted: item });
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
      console.error("Error while trying to generate products:", error);
      res.status(500).send("Server internal error");
    }
  };
}
