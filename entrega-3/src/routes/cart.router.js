import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const router = Router();
const controller = new CartController();

router.get("/", controller.getAll);

export default router;
