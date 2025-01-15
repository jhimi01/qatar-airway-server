import express from "express";
import { signup, verifyOTP, login } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

export default router;
