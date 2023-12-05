import Controllers from "./class.controller.js";
import ProductRepository from "../persistence/daos/repository/product.repository.js";
import CartRepository from "../persistence/daos/repository/cart.repository.js";
import logger from "../config/logger.config.js";

const productRepository = new ProductRepository();
const cartRepository = new CartRepository();

export default class ViewController extends Controllers {
  loggertest = (req, res) => {
    logger.debug("This is a debug logger");
    logger.info("This is an info logger");
    logger.warn("This is a warn logger");
    logger.error("This is an error logger");
    res.send("Testing loggers");
  };

  displayProductsInList = async (req, res) => {
    const products = await productRepository.getProducts();
    const productPayload = products.payload;
    const productPayloadToJSON = productPayload.map((prod) => prod.toJSON());

    res.render("home", {
      products: productPayloadToJSON,
    });
  };

  displayProductsInRealTime = async (req, res) => {
    const products = await productRepository.getProducts();
    const productPayload = products.payload;
    const productPayloadToJSON = productPayload.map((prod) => prod.toJSON());

    res.render("realTimeProducts", {
      products: productPayloadToJSON,
    });
  };

  displayChat = (req, res, next) => {
    res.render("chat", {});
  };

  displayAdmin = (req, res, next) => {
    res.render("admin", {});
  };

  displayUser = async (req, res, next) => {
    const first_name = req.session.user.first_name;
    const last_name = req.session.user.last_name;
    const email = req.session.user.email;
    const age = req.session.user.age;

    const userDTO = { first_name, last_name, email, age };

    res.render("current", { userDTO });
  };

  displayProducts = async (req, res, next) => {
    const { first_name, last_name, email, age, role } = req.session.user;

    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const query = req.query.query || "";
    const sort = req.query.sort || "";

    const products = await productRepository.getProducts(
      limit,
      page,
      query,
      sort
    );

    const simplifiedProducts = products.payload.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      owner: product.owner,
    }));
    const prevLink = products.prevLink;
    const nextLink = products.nextLink;

    const productAndUserDTO = {
      simplifiedProducts,
      prevLink,
      nextLink,
      style: "products.css",
      first_name,
      last_name,
      email,
      age,
      role,
    };

    res.render("products", productAndUserDTO);
  };

  displayCart = async (req, res, next) => {
    const cartId = req.params.cid;
    const cart = await cartRepository.getById(cartId);

    cart.products.forEach((product) => {
      product.total = product.id.price * product.quantity;
    });

    const totalCart = cart.products.reduce(
      (total, product) => total + product.total,
      0
    );

    res.render("cart", { cart, totalCart, style: "cart.css" });
  };

  displayCartPurchased = (req, res, next) => {
    res.render("cartpurchased", {});
  };

  displayLogin = (req, res, next) => {
    return res.render("login");
  };

  resetPassword = (req, res, next) => {
    return res.render("resetpassword");
  };

  newPassword = (req, res, next) => {
    return res.render("newpassword");
  };

  displayFailLogin = (req, res, next) => {
    const errorMessage = "Login has failed. Verify your credentials";
    return res.render("login", { errorMessage });
  };
  displaySignUp = (req, res, next) => {
    return res.render("signup");
  };
  displayFailRegister = (req, res, next) => {
    const errorMessage = "Register has failed. Please try again";
    return res.render("signup", { errorMessage });
  };
  displayLogout = (req, res, next) => {
    req.session.destroy();
    return res.redirect("/login");
  };
}
