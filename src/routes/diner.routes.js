import { Router } from "express";
import { createDiners, getDiners, deleteDiners, showDiner } from "../controllers/diner.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/diners',authUser ,createDiners)

router.get('/diners',authUser ,getDiners)

router.get('/diners/:id',authUser ,showDiner)

router.delete('/diners/:id',authUser ,deleteDiners)

export default router