import { Router } from "express";
import { createArea, getAreas, deleteAreas } from "../controllers/area.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/areas',authUser ,createArea)

router.get('/areas',authUser ,getAreas)

router.delete('/areas/:id',authUser ,deleteAreas)

export default router