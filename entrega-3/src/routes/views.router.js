import { Router } from "express";
import ViewController from "../controllers/view.controller.js";
import privateRoutes from "../middlewares/private.routes.js";
import publicRoutes from "../middlewares/public.routes.js";
import userAuthorization from "../middlewares/user.authorization.js";
import adminAuthorization from "../middlewares/admin.authorization.js";

const router = Router();
const controller = new ViewController();

//Chat routers
router.get("/chat", privateRoutes, userAuthorization, controller.displayChat);

//User routers
router.get("/current", privateRoutes, controller.displayUser);
router.get(
  "/admin",
  privateRoutes,
  adminAuthorization,
  controller.displayAdmin
);

//Product routers
router.get("/", controller.displayProductsInList);
router.get("/realtimeproducts", controller.displayProductsInRealTime);
router.get(
  "/products",
  privateRoutes,
  userAuthorization,
  controller.displayProducts
);

//Cart routers
router.get("/carts/:cid", privateRoutes, controller.displayCart);
router.get(
  "/carts/:cid/purchase",
  privateRoutes,
  controller.displayCartPurchased
);

//Login & Signup routers
router.get("/login", publicRoutes, controller.displayLogin);
router.get("/faillogin", controller.displayFailLogin);
router.get("/signup", publicRoutes, controller.displaySignUp);
router.get("/failregister", controller.displayFailRegister);
router.get("/logout", controller.displayLogout);

export default router;
