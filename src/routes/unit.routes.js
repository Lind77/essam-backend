import { Router } from "express";
import { createUnits, getUnits, deleteUnits } from "../controllers/unit.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/units',authUser ,createUnits)

router.get('/units',authUser ,getUnits)

router.delete('/units/:id',authUser ,deleteUnits)

export default router