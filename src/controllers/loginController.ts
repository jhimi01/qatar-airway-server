import axios from "axios";
import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import { generateOTP } from "../utils/otp";
import { sendOTPEmail } from "../utils/email";

// login action
// export const login = async (req: any, res: any) => {
//   const { email, password, recaptchaToken } = req.body;

//   // 1. Verify reCAPTCHA token with Google's API
//   try {
//     const response = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify`,
//       null,
//       {
//         params: {
//           secret: process.env.RECAPTCHA_SECRET_KEY,
//           response: recaptchaToken,
//         },
//       }
//     );

//     console.log("response of recatpha", response);

//     if (!response.data.success) {
//       return res.status(400).json({ error: "reCAPTCHA verification failed" });
//     }

//     // 2. Find the user in the database
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // 3. Compare password (if using hashed passwords)
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // 4. Generate a JWT token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       "process.env.JWT_SECRET_KEY",
//       { expiresIn: "7d" }
//     );

//     // 5. Send the token back in the response
//     return res.status(200).json({ token });
//   } catch (error) {
//     console.error("Error verifying reCAPTCHA:", error);
//     return res.status(500).send("Error verifying reCAPTCHA");
//   }
// };

// login action
export const login = async (req: any, res: any) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    // Verify reCAPTCHA token with Google's API
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password (hashed)
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate OTP and send it to user's email
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiration

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiration },
    });

    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Error during login");
  }
};

