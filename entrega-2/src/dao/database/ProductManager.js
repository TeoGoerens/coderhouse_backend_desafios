import { productModel } from "../models/product.model.js";

export default class ProductManager {
  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails
  ) {
    const product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    const products = await this.getProducts();

    try {
      if (!title || !description || !code || !price || !stock || !category) {
        throw new Error(
          `All fields must be completed to submit ${product.title} product`
        );
      } else if (products.find((prod) => prod.code === code)) {
        throw new Error(
          `The ${product.code} code already exists in our database. The product ${product.title} can't be registered`
        );
      } else {
        const productInDatabase = productModel.create(product);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findById(id).lean();
      return product;
    } catch {
      return `The product with id: ${id} was not found`;
    }
  }

  async updateProduct(productId, updateFields) {
    try {
      const updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedProduct) {
        return `The selected product ${productId} does not exist`;
      }

      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(productId) {
    try {
      const deletedProduct = await productModel.findOneAndDelete({
        _id: productId,
      });

      if (!deletedProduct) {
        return `The selected product ${productId} does not exist`;
      }

      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  }
}
