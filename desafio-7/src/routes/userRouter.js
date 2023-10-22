import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import passport from "passport";
const router = Router();

router.post(
  "/signup",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    return res.redirect("/login");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
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
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req);
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      isLogged: true,
    };
    return res.redirect("/products");
  }
);

export default router;
