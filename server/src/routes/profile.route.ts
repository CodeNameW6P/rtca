import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/api/profile", authMiddleware, getProfile);
router.patch("/api/profile", authMiddleware, updateProfile);

export default router;
