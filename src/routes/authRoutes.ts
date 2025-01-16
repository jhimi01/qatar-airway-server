import express from "express";
import { signup, verifyOTP } from "../controllers/authController";
import { login } from "../controllers/loginController";
import { verifyOTPLogin } from "../controllers/verifyOtpLogin";
import { getUserData } from "../controllers/loggedinUserController";
import { editProfileController } from "../controllers/editProfileController";
import { imageEditController } from "../controllers/imageEditController";
import { logOutController } from "../controllers/logOutController";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/verify-otp-login", verifyOTPLogin);
router.get("/loggedin-user", getUserData);
router.patch("/edit-profile", editProfileController);
router.patch("/edit-image", imageEditController);
router.delete("/logout", logOutController);


export default router;
