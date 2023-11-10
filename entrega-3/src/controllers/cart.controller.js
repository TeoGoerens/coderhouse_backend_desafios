import Controllers from "./class.controller.js";
import CartRepository from "../persistence/daos/repository/cart.repository.js";

const cartRepository = new CartRepository();

export default class CartController extends Controllers {
  constructor() {
    super(cartRepository);
  }
}
