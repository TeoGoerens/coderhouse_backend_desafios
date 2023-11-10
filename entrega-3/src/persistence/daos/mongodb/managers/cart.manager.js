import MongoDao from "../mongo.dao.js";
import { cartModel } from "../models/cart.model.js";

export default class CartManagerMongo extends MongoDao {
  constructor() {
    super(cartModel);
  }
}
