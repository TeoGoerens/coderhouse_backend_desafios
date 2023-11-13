import { productManager } from "../factory.js";

export default class ProductRepository {
  constructor() {
    this.dao = productManager;
  }

  async getProducts(limit = 10, page = 1, query = "", sort = "") {
    try {
      const products = await this.dao.getProducts(limit, page, query, sort);

      //products.status = "success";

      const prevLink =
        products.hasPrevPage === false
          ? null
          : `http://localhost:8080/products?limit=${limit}&page=${
              products.page - 1
            }&query=${query}&sort=${sort}`;
      //products.prevLink = prevLink;

      const nextLink =
        products.hasNextPage === false
          ? null
          : `http://localhost:8080/products?limit=${limit}&page=${
              products.page + 1
            }&query=${query}&sort=${sort}`;
      //products.nextLink = nextLink;

      const productDTO = { ...products, status: "success", prevLink, nextLink };

      return productDTO;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const product = await this.dao.getById(id);
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(product) {
    try {
      const { title, description, price, thumbnail, code, stock, category } =
        product;
      const status = product.status || true;
      const totalProducts = await this.dao.getAll();

      if (!title || !description || !code || !price || !stock || !category) {
        throw new Error(
          `All fields must be completed to submit ${title} product`
        );
      } else if (totalProducts.find((prod) => prod.code === code)) {
        throw new Error(
          `The ${code} code already exists in our database. The product ${title} can't be registered`
        );
      } else {
        const productToLoad = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
          status,
        };

        await this.dao.create(productToLoad);
        return productToLoad;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, obj) {
    try {
      const updatedProduct = await this.dao.update(id, obj);
      if (!updatedProduct) {
        return `The selected product ${id} does not exist`;
      }
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      await this.dao.delete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
