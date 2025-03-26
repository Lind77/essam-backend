import { Router } from "express";
import BusinnesContract from "../models/BusinnesContract.js";
import { authUser } from "../middlewares/authMiddleware.js";
import { createBusinnesContracts, getBusinnesContracts, deleteContracts } from "../controllers/businnesContract.controller.js";

const router = Router();

router.post('/businnes-contracts',authUser ,createBusinnesContracts)

router.get('/businnes-contracts',authUser ,getBusinnesContracts)

router.delete('/businnes-contracts/:id',authUser ,deleteContracts)

export default router