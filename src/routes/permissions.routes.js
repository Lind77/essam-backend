import { Router } from "express";
import { createPermission, getPermissions, deletePermissions, syncUserPermissions, syncRolePermissions } from "../controllers/permission.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/permissions',authUser ,createPermission)

router.get('/permissions',authUser ,getPermissions)

router.delete('/permissions/:id',authUser ,deletePermissions)

router.post('/permissions-user', authUser ,syncUserPermissions)

router.post('/permissions-role', authUser ,syncRolePermissions)

export default router