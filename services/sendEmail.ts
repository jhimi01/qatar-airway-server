import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import nodemailer, { TransportOptions } from "nodemailer";
import generateOTP from "./generateOTP";  // Import the generateOTP function correctly
dotenv.config();

// Define transport options with proper types
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,  // Ensure environment variables are string
  port: parseInt(process.env.SMTP_PORT as string), // Parse port as number
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL as string,  // Ensure environment variables are string
    pass: process.env.SMTP_PASSWORD as string,  // Ensure environment variables are string
  },
} as TransportOptions);  // Cast to TransportOptions type

const sendEmail = expressAsyncHandler(async (req: any, res: any) => {
  const { email } = req.body;
  console.log(email);

  const otp = generateOTP(); // Use the imported function to generate OTP

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "OTP from Callback Coding",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent successfully!");
      res.status(200).json({ message: "Email sent successfully", otp });
    }
  });
});

export { sendEmail };  // Use ES module export syntax
