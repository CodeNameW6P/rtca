import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller";

const router = Router();

router.post("/api/auth/signup", signUp);
router.post("/api/auth/signin", signIn);
router.get("/api/auth/signout", signOut);

export default router;
