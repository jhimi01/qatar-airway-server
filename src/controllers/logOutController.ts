import jwt from "jsonwebtoken";
import prisma from "../models/userModel";

export const logOutController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    // Decode token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    const { userId } = decoded;

    if (!userId) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    // Delete LoggedInUser record
    await prisma.loggedInUser.delete({
      where: { userId },
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Failed to logout" });
  }
};
