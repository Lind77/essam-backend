import { Router } from "express";
import { createInvoice } from "../controllers/invoices.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/invoices', createInvoice);

/* router.post('/send-invoices-sunat', sendSunat); */

export default router