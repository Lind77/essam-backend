import { Router } from "express";
import { createMines, getMines, deleteMines } from "../controllers/mine.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/mines',authUser ,createMines)

router.get('/mines',authUser ,getMines)

router.delete('/mines/:id',authUser ,deleteMines)

export default router