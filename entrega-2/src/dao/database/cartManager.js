import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

export default class cartManager {
  async getCarts() {
    const carts = await cartModel.find().lean();
    return carts;
  }

  async addCart() {
    const cart = {
      products: [],
    };
    const newCart = await cartModel.create(cart);
    return newCart;
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.findById(cartId).populate("products.id");
      return cart;
    } catch {
      return `The cart with id: ${cartId} was not found`;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      //Verify if cart exists in the database
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return `The cart with id ${cartId} does not exist`;
      }

      //Verify if product exists in the database
      const product = await productModel.findById(productId);
      if (!product) {
        return `The product with id ${productId} does not exist`;
      }

      //Verify if product exists in the cart
      const existingProduct = cart.products.find(
        (prod) => prod.id == productId
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ id: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      return `An unexpected error occured`;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    //Verify if cart exists in database
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return `The cart with id ${cartId} doesn't exist`;
    }

    //Verify if product exists in the database
    const product = await productModel.findById(productId);
    if (!product) {
      return `The product with id ${productId} does not exist`;
    }

    // Delete product from the cart
    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { $pull: { products: { id: productId } } },
      { new: true }
    );

    return updatedCart;
  }

  async emptyCart(cartId) {
    //Verify if cart exists in database
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return `The cart with id ${cartId} doesn't exist`;
    }

    // Empty the cart
    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );

    return updatedCart;
  }
}
