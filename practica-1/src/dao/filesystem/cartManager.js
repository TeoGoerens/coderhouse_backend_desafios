import * as fs from "fs";

class CartManager {
  constructor() {
    this.path = "./carts.json";
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.log(error);
    }
  }

  async getId() {
    try {
      const data = await this.getCarts();
      return data.length;
    } catch {
      return 0;
    }
  }

  async addCart() {
    try {
      let allCarts;
      if (!fs.existsSync(this.path)) {
        allCarts = [];
      } else {
        allCarts = await this.getCarts();
      }

      const cart = {
        id: await this.getId(),
        products: [],
      };

      allCarts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(allCarts));
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const allCarts = await this.getCarts();
      let cartById = allCarts.find((cart) => cart.id === id);
      if (cartById) {
        return cartById;
      } else {
        return "Not found";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const allCarts = await this.getCarts();
      const cartIndex = allCarts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        throw new Error(`The cart with id = ${cartId} does not exist`);
      } else {
        const existingProductIndex = allCarts[cartIndex].products.findIndex(
          (product) => product.id === productId
        );
        if (existingProductIndex !== -1) {
          allCarts[cartIndex].products[existingProductIndex].quantity++;
        } else {
          const newProduct = {
            id: productId,
            quantity: 1,
          };
          allCarts[cartIndex].products.push(newProduct);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts));
        console.log(`Product ${productId} has been added to cart ${cartId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default CartManager;
