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

const createProductManager = async () => {
  const myProductManager = new ProductManager();

  await myProductManager.addProduct(
    "iPhone 13 Pro",
    "New iPhone 13 Pro super skills",
    1000,
    "iPhone 13 Pro route",
    101010,
    3
  );
  await myProductManager.addProduct(
    "iPhone 14 Pro",
    "New iPhone 14 Pro super skills",
    1000,
    "iPhone 14 Pro route",
    101011,
    3
  );
  await myProductManager.addProduct(
    "iPhone 15 Pro",
    "New iPhone 15 Pro super skills",
    1000,
    "iPhone 15 Pro route",
    101012,
    3
  );
  await myProductManager.addProduct(
    "iPhone 16 Pro",
    "New iPhone 16 Pro super skills",
    1000,
    "iPhone 16 Pro route",
    101013,
    3
  );
  await myProductManager.addProduct(
    "iPhone 17 Pro",
    "New iPhone 17 Pro super skills",
    1000,
    "iPhone 17 Pro route",
    101014,
    3
  );

  console.log(await myProductManager.getProducts());
  console.log(await myProductManager.getProductById(2));

  await myProductManager.deleteProductById(2);

  await myProductManager.updateProduct(0, {
    title: "iPhone 18 Pro",
    description: "New iPhone 18 Pro super skills",
    price: 3950,
    thumbnail: "iPhone 18 Pro route",
    code: 202025,
    stock: 1,
  });

  console.log(await myProductManager.getProducts());
  console.log(await myProductManager.getProductById(2));
};

createProductManager();
