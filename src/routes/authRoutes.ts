import express from "express";
import { signup, verifyOTP } from "../controllers/authController";
import { login } from "../controllers/loginController";
import { verifyOTPLogin } from "../controllers/verifyOtpLogin";
import { getUserData } from "../controllers/loggedinUserController";
import { editProfileController } from "../controllers/editProfileController";
import { imageEditController } from "../controllers/imageEditController";
import { logOutController } from "../controllers/logOutController";
import { changePasswordController } from "../controllers/changePasswordController";
import { googleLoginController, googleSignupController } from "../controllers/googleLoginController";
import { forgotPasswordController, resetPasswordController } from "../controllers/forgotPasswordController";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/verify-otp-login", verifyOTPLogin);
router.get("/loggedin-user", getUserData);
router.patch("/edit-profile", editProfileController);
router.patch("/edit-image", imageEditController);
router.delete("/logout", logOutController);
router.post("/change-password", changePasswordController);
router.post("/google-signup", googleSignupController);
router.post("/google-login", googleLoginController);
router.post("/sendemail-forgotpassword", forgotPasswordController);
router.post("/reset-forgotpassword/:id/:token", resetPasswordController);



export default router;
