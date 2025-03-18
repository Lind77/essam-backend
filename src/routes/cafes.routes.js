import { Router } from "express";
import { createCafes, getCafes, deleteCafes } from "../controllers/cafe.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/cafes',authUser ,createCafes)

router.get('/cafes',authUser ,getCafes)

router.delete('/cafes/:id',authUser ,deleteCafes)

export default router