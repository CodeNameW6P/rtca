import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createChat, getChats, updateChat, deleteChat } from "../controllers/chat.controller";

const router = Router();

router.get("/api/chat/:_id", authMiddleware, getChats);
router.post("/api/chat", authMiddleware, createChat);
router.patch("/api/chat", authMiddleware, updateChat);
router.delete("/api/chat", authMiddleware, deleteChat);

export default router;
