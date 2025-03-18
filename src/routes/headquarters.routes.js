import { Router } from "express";
import { createHeadquarter, getHeadquarters, deleteHeadquarter } from "../controllers/headquarter.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/headquarters',authUser ,createHeadquarter)

router.get('/headquarters',authUser ,getHeadquarters)

router.delete('/headquarters/:id',authUser ,deleteHeadquarter)

export default router