import Controllers from "./class.controller.js";
import CartRepository from "../persistence/daos/repository/cart.repository.js";
import ProductRepository from "../persistence/daos/repository/product.repository.js";
import TicketRepository from "../persistence/daos/repository/ticket.repository.js";
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";
import randomCodeGenerator from "../helpers/random.code.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

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

    if (cartUpdated.status == 200) {
      res.status(cartUpdated.status).send({
        cart: cartUpdated.cart,
      });
    } else {
      res.status(cartUpdated.status).send({
        error: cartUpdated.error,
      });
    }
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

  endPurchase = async (req, res, next) => {
    const cartId = req.params.cid;
    const cart = await this.repository.getById(cartId);
    const productsInCart = cart.products;
    let productsWithSufficientStock = [];
    let productsWithNoStock = [];

    //Corroborar stock de cada producto
    for (const product of productsInCart) {
      if (product.quantity <= product.id.stock) {
        // Si hay stock incluir el producto en un array de futura compra y ajustar el nuevo stock en la base de datos
        productsWithSufficientStock.push(product);
        const productId = product.id._id;
        const newStock = product.id.stock - product.quantity;
        const updatedProduct = await productRepository.update(productId, {
          stock: newStock,
        });
      } else {
        // Si no hay stock no incluir el producto en el array de futura compra y agregarlo a un array apate
        productsWithNoStock.push(product);
      }
    }

    //Emitir el ticket con los datos de la compra
    const totalPurchase = productsWithSufficientStock.reduce(
      (total, product) => {
        const { id, quantity } = product;
        const productPrice = id.price;
        return total + quantity * productPrice;
      },
      0
    );

    const userEmail = req.session.user.email;
    const user = await userModel.findOne({ email: userEmail });

    const ticket = {
      code: randomCodeGenerator(),
      purchase_datetime: new Date(),
      amount: totalPurchase,
      purchaser: user._id,
    };

    const ticketCreated = await ticketRepository.create(ticket);
    //Devolver los productos que no pudieron ser comprados

    res.status(200).send({
      purchase: productsWithSufficientStock,
      rejected: productsWithNoStock,
      ticket: ticket,
      user: user,
    });
  };
}
