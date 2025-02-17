import { Router } from "express";
import { findUsers, getProfile, updateProfile } from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/api/profile", authMiddleware, getProfile);
router.patch("/api/profile", authMiddleware, updateProfile);
router.get("/api/search", authMiddleware, findUsers);

export default router;
