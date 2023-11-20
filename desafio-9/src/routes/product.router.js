import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const router = Router();
const controller = new ProductController();

router.get("/", controller.getProducts);
router.get("/mockingproducts", controller.getMockingProducts);
router.get("/:pid", controller.getById);

router.post("/", controller.createProduct);

router.put("/:pid", controller.update);
router.delete("/:pid", controller.delete);

export default router;
