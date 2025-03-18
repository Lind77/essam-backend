import { Router } from "express";
import { createBusiness, getBusinnes, deleteBusinnes } from "../controllers/business.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/businnes',authUser ,getBusinnes)

router.post('/businnes',authUser ,createBusiness)

router.delete('/businnes/:id',authUser ,deleteBusinnes)


export default router