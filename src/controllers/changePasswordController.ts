import prisma from "../models/userModel"; // Your prisma instance
import bcrypt from "bcryptjs"; // Import bcrypt to hash passwords
import jwt from "jsonwebtoken";

export const changePasswordController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token in headers
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const { email, oldPassword, newPassword } = req.body;

  try {
    // Decode token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    const { userId } = decoded;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user || !user.password) {
      return res.status(400).json({ error: "User or password is missing." });
    }
    // Compare the old password with the hashed password in the database
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).send("Incorrect old password");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database with the new hashed password
    await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    // Generate a new JWT token after password change
    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" } // You can adjust the expiry time as needed
    );

    // Update the logged-in user with the new token
    await prisma.loggedInUser.upsert({
      where: { userId: user.id },
      update: {
        token: newToken, // Update token
      },
      create: {
        userId: user.id,
        token: newToken, // Create a new record with the new token
        verifiedOtp: true, // Add a default value for verifiedOtp
      },
    });

    return res.status(200).json({
      message: "Password updated successfully",
      token: newToken, // Return the new token
    });
  } catch (err) {
    console.error("Error during password reset:", err);
    return res.status(500).send("Error during password reset");
  }
};



