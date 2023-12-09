import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import privateRoutes from "../middlewares/private.routes.js";

const router = Router();
const controller = new CartController();

router.get("/", controller.getAll);
router.get("/:pid", controller.getById);

router.post("/", controller.addCart);
router.post("/:cid/product/:pid", controller.addProductToCart);
router.post("/:cid/purchase", controller.endPurchase);

router.put("/:pid", controller.update);
router.put("/:cid/product/:pid", controller.updateProductQuantity);

router.delete("/:cid", controller.emptyCart);
router.delete("/:cid/product/:pid", controller.deleteProductFromCart);

export default router;
