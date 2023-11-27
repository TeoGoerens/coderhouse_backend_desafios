import Controllers from "./class.controller.js";
import UserRepository from "../persistence/daos/repository/user.repository.js";

const userRepository = new UserRepository();

export default class UserController extends Controllers {
  constructor() {
    super(userRepository);
  }

  signUpRedirect = (req, res, next) => {
    return res.redirect("/login");
  };

  loginRedirect = async (req, res, next) => {
    if (!req.user) {
      res.status(400).send();
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      isLogged: true,
    };

    return res.redirect("/products");
  };

  githubCallbackRedirect = (req, res, next) => {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      isLogged: true,
    };
    return res.redirect("/products");
  };
}
