import { Router } from "express";
import { createBusinnesClients, getBusinnesClients, deleteUnits } from "../controllers/businnesClient.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/businnes-clients',authUser ,createBusinnesClients)

router.get('/businnes-clients',authUser ,getBusinnesClients)

router.delete('/businnes-clients/:id',authUser ,deleteUnits)

export default router