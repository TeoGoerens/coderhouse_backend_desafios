import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";

const router = Router();
const controller = new UserController();

router.post(
  "/signup",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  controller.signUpRedirect
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  controller.loginRedirect
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  controller.githubCallbackRedirect
);

export default router;
