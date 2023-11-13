import MongoDao from "../mongo.dao.js";
import { cartModel } from "../models/cart.model.js";

export default class CartManagerMongo extends MongoDao {
  constructor() {
    super(cartModel);
  }

  async addCart() {
    try {
      const cart = {
        products: [],
      };

      const newCart = await cartModel.create(cart);
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async getByIdAndPopulate(id) {
    try {
      const response = await cartModel
        .findById(id)
        .lean()
        .populate("products.id");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdAndUpdate(cartId, productId) {
    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { $pull: { products: { id: productId } } },
      { new: true }
    );
    return updatedCart;
  }
}
