import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../utils/email";
import { generateOTP } from "../utils/otp";

export const signup = async (req: any, res: any) => {
  const {
    email,
    password,
    firstName,
    lastName,
    title,
    dateOfBirth,
    gender,
    address,
    mobileNumber,
    country,
    nid
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        title,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        gender,
        otp,
        otpExpiration,
        address,
        mobileNumber,
        country,
        nid
      },
    });

    await sendOTPEmail(email, otp);
    res.status(200).send("OTP sent to your email");
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send("Error during signup");
  }
};

// verifyOTP action
export const verifyOTP = async (req: any, res: any) => {
  const { email, otp } = req.body;

  try {
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

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    res.status(200).send("User verified successfully");
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).send("Error during OTP verification");
  }
};
