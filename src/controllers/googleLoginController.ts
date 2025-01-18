import prisma from "../models/userModel";

export const googleSignupController = async (req: any, res: any) => {
  const { email, firstName, img, isVerified } = req.body;

  console.log("Received data:", req.body);

  if (!email || !firstName) {
    return res.status(400).json({ error: "Missing email or first name" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        img,
        isVerified,
      },
    });

    return res.status(200).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error occurred while creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

import jwt from "jsonwebtoken"; // Assuming you're using JWT for token generation

export const googleLoginController = async (req: any, res: any) => {
  const { email, firstName, img, isVerified } = req.body;

  try {
    // Check if the user exists by email
    let user = await prisma.user.findUnique({ where: { email } });

    // If user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          img,
          isVerified,
        },
      });
    }

    // Generate a token after the user is created
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );

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

    return res.status(200).json({
      message: "User logged in successfully",
      userData: { ...user },
      token, // You may return the token as well for frontend usage
    });
  } catch (error) {
    console.error("Error occurred during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
