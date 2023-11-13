import Controllers from "./class.controller.js";
import CartRepository from "../persistence/daos/repository/cart.repository.js";

const cartRepository = new CartRepository();

export default class CartController extends Controllers {
  constructor() {
    super(cartRepository);
  }

  addCart = async (req, res, next) => {
    const newCart = await this.repository.addCart();
    const newCartId = newCart._id;
    res.status(200).send({ message: `Cart with id ${newCartId} was created` });
  };

  addProductToCart = async (req, res, next) => {
    const cartReference = req.params.cid;
    const productReference = req.params.pid;
    const cartUpdated = await this.repository.addProductToCart(
      cartReference,
      productReference
    );
    res.status(200).send({
      cart: cartUpdated,
    });
  };

  updateProductQuantity = async (req, res, next) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    const updatedCart = await this.repository.updateProductQuantity(
      cartId,
      productId,
      quantity
    );

    res.status(200).send(updatedCart);
  };

  emptyCart = async (req, res, next) => {
    const cartId = req.params.cid;

    const cart = await this.repository.emptyCart(cartId);

    res.status(200).send({
      message: `The cart with id ${cartId} has been emptied`,
      cart,
    });
  };

  deleteProductFromCart = async (req, res, next) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await this.repository.deleteProductFromCart(cartId, productId);

    res.status(200).send(cart);
  };
}
