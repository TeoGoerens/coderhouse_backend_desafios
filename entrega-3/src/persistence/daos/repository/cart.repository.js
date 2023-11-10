import { cartManager } from "../factory.js";

export default class CartRepository {
  constructor() {
    this.dao = cartManager;
  }

  async getAll() {
    try {
      const carts = await this.dao.getAll();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }
}
