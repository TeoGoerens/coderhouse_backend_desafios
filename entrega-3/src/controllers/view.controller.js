import Controllers from "./class.controller.js";
import ProductRepository from "../persistence/daos/repository/product.repository.js";
import CartRepository from "../persistence/daos/repository/cart.repository.js";

const productRepository = new ProductRepository();
const cartRepository = new CartRepository();

export default class ViewController extends Controllers {
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

  displayLogin = (req, res, next) => {
    return res.render("login");
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