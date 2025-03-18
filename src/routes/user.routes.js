import { Router } from "express";
import User from "../models/User.js";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/users', authUser, getUsers);

router.post('/users', authUser, createUser);

export default router