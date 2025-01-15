import prisma from "../models/userModel";

import jwt from "jsonwebtoken";

export const verifyOTPLogin = async (req: any, res: any) => {
    const { email, otp } = req.body;
    console.log("Verifying OTP with from backend:", { email, otp });
  
    try {
      // Find the user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).send("User not found");
  
      // Check if OTP is valid and not expired
      if (
        user.otp !== otp ||
        !user.otpExpiration ||
        user.otpExpiration < new Date()
      ) {
        return res.status(400).send("Invalid or expired OTP");
      }
  
      // Mark user as verified
      await prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "7d" }
      );
  
      // Update or create the logged-in user record
      await prisma.loggedInUser.upsert({
        where: { userId: user.id },
        update: {
          verifiedOtp: true,
          token,
        },
        create: {
          userId: user.id,
          verifiedOtp: true,
          token,
        },
      });
  
      res.status(200).json({
        message: "User verified successfully",
        userData: { ...user },
        token,
      });
  
      console.log("user data", res.status(200).json());
    } catch (err) {
      console.error("Error during OTP verification:", err);
      res.status(500).send("Error during OTP verification");
    }
  };
  