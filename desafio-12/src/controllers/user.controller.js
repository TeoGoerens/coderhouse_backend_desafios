import Controllers from "./class.controller.js";
import UserRepository from "../persistence/daos/repository/user.repository.js";
import transport from "../config/nodemailer.config.js";
import bcrypt from "bcrypt";
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";

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

  resetPassword = async (req, res, next) => {
    const emailToReset = req.body.email;
    const resetLink = `http://localhost:8080/newpassword`;

    let result = await transport.sendMail({
      from: "chacho@elrincondechacho.com",
      to: emailToReset,
      subject: "Recupero de contraseña",
      html: `<h1>¿Has olvidado tu contraseña?</h1>
          <h3>Para poder resetear tu contraseña haz clic en el link debajo</h3>
          <a href="${resetLink}">${resetLink}</a>`,
    });
    return res.redirect("/login");
  };

  confirmPassword = async (req, res, next) => {
    const email = req.body.email;
    const newPassword = req.body.password;
    const user = await userModel.findOne({ email: email });
    let errorMessage;

    if (!user) {
      errorMessage = "User was not found";
      return res.render("login", { errorMessage });
    }

    if (bcrypt.compareSync(newPassword, user.password)) {
      errorMessage = "Your new password matches the previous one";
      return res.render("login", { errorMessage });
    } else {
      user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
      await user.save();
      errorMessage = "Password was effectively reset";
      return res.render("login", { errorMessage });
    }
  };

  togglePremium = async (req, res, next) => {
    const userId = req.params.uid;
    const user = await userModel.findOne({ _id: userId });
    let message;

    switch (user.role) {
      case "admin":
        message = "User's role is ADMIN. It can't be changed";
        break;
      case "user":
        message = "New user's role is PREMIUM";
        user.role = "premium";
        await user.save();
        req.session.user.role = "premium";
        break;
      case "premium":
        message = "New user's role is USER";
        user.role = "user";
        await user.save();
        req.session.user.role = "user";
        break;
    }

    res.send(message);
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
