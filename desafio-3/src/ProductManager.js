const fs = require("fs");

class ProductManager {
  static productId = 0;

  constructor() {
    this.path = "./products.json";
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      id: ProductManager.productId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    try {
      let allProducts;
      if (!fs.existsSync(this.path)) {
        allProducts = [];
      } else {
        allProducts = await this.getProducts();
      }

      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error(
          `All fields must be completed to submit ${product.title} product`
        );
      } else if (allProducts.find((prod) => prod.code === code)) {
        throw new Error(
          `The ${product.code} code already exists in our database. The product ${product.title} can't be registered`
        );
      } else {
        allProducts.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(allProducts));
        ProductManager.productId++;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const allProducts = await this.getProducts();
      let productById = allProducts.find((prod) => prod.id === id);
      if (productById) {
        return productById;
      } else {
        return "Not found";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, newProduct) {
    try {
      const allProducts = await this.getProducts();
      const allProductsNotToBeUpdated = allProducts.filter(
        (prod) => prod.id !== id
      );
      const updatedProduct = { ...{ id: id }, ...newProduct };
      allProductsNotToBeUpdated.push(updatedProduct);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(allProductsNotToBeUpdated)
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(id) {
    try {
      const allProducts = await this.getProducts();
      let productsWithDifferentId = allProducts.filter(
        (prod) => prod.id !== id
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productsWithDifferentId)
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductManager;
