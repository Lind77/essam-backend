import { Router } from "express";
import { createService, getServices, deleteServices, syncServicesCafe, syncPricesServicesCafe } from "../controllers/service.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/services',authUser ,getServices)

router.post('/services',authUser ,createService)

router.delete('/services/:id',authUser ,deleteServices)

router.post('/services-cafe', authUser ,syncServicesCafe)

router.post('/prices-services-cafe', authUser ,syncPricesServicesCafe)

export default router