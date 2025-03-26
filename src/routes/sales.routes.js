import { createSale, getSales } from "../controllers/sale.controller.js";
import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/sales',authUser ,createSale)

router.get('/sales',authUser ,getSales)

export default router