import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMessages, sendMessage } from "../controllers/message.controller";

const router = Router();

router.get("/api/message/:id", authMiddleware, getMessages);
router.post("/api/message/:id", authMiddleware, sendMessage);

export default router;
