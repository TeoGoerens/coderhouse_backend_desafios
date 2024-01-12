import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";
import upload from "../config/multer.config.js";

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

router.post("/resetpassword", controller.resetPassword);
router.post("/confirmpassword", controller.confirmPassword);

router.post("/premium/:uid", controller.togglePremium);

router.post(
  "/:uid/documents",
  upload.array("documents"),
  controller.uploadDocuments
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

router.get("/", controller.getAllUsers);
router.delete("/", controller.deleteInactiveUsers);
router.delete("/:uid", controller.deleteUser);

export default router;
