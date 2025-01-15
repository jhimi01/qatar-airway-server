import express from "express";
import { signup, verifyOTP } from "../controllers/authController";
import { login } from "../controllers/loginController";
import { verifyOTPLogin } from "../controllers/verifyOtpLogin";
import { getUserData } from "../controllers/loggedinUserController";
import { editProfileController } from "../controllers/editProfileController";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/verify-otp-login", verifyOTPLogin);
router.get("/loggedin-user", getUserData);
router.patch("/edit-profile", editProfileController);


export default router;
