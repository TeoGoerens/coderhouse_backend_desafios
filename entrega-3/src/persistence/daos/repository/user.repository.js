import { userManager } from "../factory.js";

export default class UserRepository {
  constructor() {
    this.dao = userManager;
  }

  async getAll() {
    try {
      const carts = await this.dao.getAll();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const cart = await this.dao.getByIdAndPopulate(id);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addCart() {
    try {
      const newCart = this.dao.addCart();
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      //Verify if cart exists in the database
      const cart = await this.dao.getById(cartId);
      if (!cart) {
        return `The cart with id ${cartId} does not exist`;
      }

      //Verify if product exists in the database
      const product = await productManager.getById(productId);
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

  async update(cartId, products) {
    try {
      this.dao.update(cartId, products);
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.dao.getById(cartId);

    if (!cart) {
      return res.status(404).send(`The cart with id ${cartId} doesn't exist`);
    }

    // Searching the corresponding product in the above found cart
    const product = cart.products.find((p) => p.id._id == productId);

    // If product doesn't exist, we return error 404
    if (!product) {
      return res
        .status(404)
        .send(
          `The product with id ${productId} doesn't exist in the selected cart`
        );
    }

    // Product's quantity is updated in the cart
    product.quantity = quantity;
    await cart.save();
    return cart;
  }

  async emptyCart(cartId) {
    //Verify if cart exists in database
    const cart = await this.dao.getById(cartId);
    if (!cart) {
      return `The cart with id ${cartId} doesn't exist`;
    }

    // Empty the cart
    const updatedCart = await this.dao.update(
      cartId,
      { products: [] },
      { new: true }
    );

    return updatedCart;
  }

  async deleteProductFromCart(cartId, productId) {
    //Verify if cart exists in database
    const cart = await this.dao.getById(cartId);
    if (!cart) {
      return `The cart with id ${cartId} doesn't exist`;
    }

    //Verify if product exists in the database
    const product = await productManager.getById(productId);
    if (!product) {
      return `The product with id ${productId} does not exist`;
    }

    // Delete product from the cart
    const updatedCart = await this.dao.findByIdAndUpdate(cartId, productId);

    return updatedCart;
  }
}
