import prisma from "../models/userModel";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const forgotPasswordController = async (req: any, res: any) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User is not exists" });
    }
    if (user && !user.password) {
      return res
        .status(400)
        .json({
          error: "Try to loggin with your gmail with the same email address",
        });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      text: `http://localhost:5173/forgot-password/${user.id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        console.error("Error during password reset:", error);
        return res.status(500).send("Error during password reset");
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message: "sendMail",
        });
      }
    });
  } catch (error) {
    console.log(error);
    console.error("Error during send email:", error);
    return res.status(500).send("Error during send email");
  }
};
