import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/email";
import { generateOTP } from "../utils/otp";
import axios from "axios";

export const signup = async (req: any, res: any) => {
  const {
    email,
    password,
    firstName,
    lastName,
    title,
    dateOfBirth,
    gender,
    countryCode,
    mobileNumber,
    country,
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
        countryCode,
        mobileNumber,
        country,
      },
    });

    await sendOTPEmail(email, otp);
    res.status(200).send("OTP sent to your email");
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send("Error during signup");
  }
};

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

export const login = async (req: any, res: any) => {
  // const { email, password } = req.body;

  // try {
  //   const user = await prisma.user.findUnique({ where: { email } });
  //   if (!user) return res.status(400).json({ error: "User not found" });

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  //   const token = jwt.sign(
  //     { userId: user.id, email: user.email },
  //     "process.env.JWT_SECRET_KEY",
  //     { expiresIn: "7d" }
  //   );

  //   res.json({ message: "Logged in successfully", token });
  // } catch (err) {
  //   console.error("Error during login:", err);
  //   res.status(500).send("Error during login");
  const { email, password, recaptchaToken } = req.body;

  // 1. Verify reCAPTCHA token with Google's API
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null, // Body is empty for this request
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY, // Your reCAPTCHA secret key
          response: recaptchaToken, // Token sent from frontend
        },
      }
    );

    console.log("response of recatpha", response);

    if (!response.data.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    // 2. Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Compare password (if using hashed passwords)
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "process.env.JWT_SECRET_KEY",
      { expiresIn: "7d" }
    );

    // 5. Send the token back in the response
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return res.status(500).send("Error verifying reCAPTCHA");
  }
  // }
};
