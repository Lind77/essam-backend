import { Router } from "express";
import User from "../models/User.js";
import { createUser, getUsers } from "../controllers/user.controller.js";

const router = Router();

router.get('/users', getUsers);

router.post('/users', createUser);

export default router