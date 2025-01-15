import express from "express";
import { signup, verifyOTP } from "../controllers/authController";
import { login } from "../controllers/loginController";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

export default router;
