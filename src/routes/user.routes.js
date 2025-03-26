import { Router } from "express";
import User from "../models/User.js";
import { createUser, getUsers, deleteUser, getUser } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/users', authUser, getUsers);

router.get('/users/:id', authUser, getUser);

router.post('/users', authUser, createUser);

router.delete('/users/:id', authUser, deleteUser);

export default router