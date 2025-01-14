import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import crypto from "crypto";
// EMAIL_USER=talukderjhimi@gmail.com
// EMAIL_PASS=ybsu hfpl pgqz onqn
const prisma = new PrismaClient();
const port = 5000;
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for email and password
    pass: process.env.EMAIL_PASS, // Make sure to store your credentials securely
  },
});

// Function to generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Send OTP to email
const sendOTPEmail = (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred while sending OTP:", error);
        reject(error);
      } else {
        console.log("OTP sent:", info.response);
        resolve(info);
      }
    });
  });
};

// Register Route (Sign up)
app.post("/api/signup", async (req: any, res: any) => {
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
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate OTP and store it in the database
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
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

    // Send OTP to email
    await sendOTPEmail(email, otp);
    res.status(200).send("OTP sent to your email");
  } catch (err) {
    console.error("Error during signup process:", err);
    res.status(500).send("Error during signup process");
  }
});

// Verify OTP route
app.post("/api/verify-otp", async (req: any, res: any) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
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

    // OTP is valid, activate account
    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    res.status(200).send("User verified successfully");
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).send("Error during OTP verification");
  }
});

// Login Route---------------------
app.post("/api/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    "process.env.JWT_SECRET_KEY", // Secret key (should be an environment variable)
    { expiresIn: "7d" }
  );

  res.json({ message: "Logged in successfully", token });
});





app.get("/users", async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
