import { Router } from "express";
import Role from "../models/Role.js";
import { getRoles, createRole, deleteRole } from "../controllers/role.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/roles', authUser, getRoles);

router.post('/roles', authUser, createRole);

router.delete('/roles/:id', authUser, deleteRole);

export default router