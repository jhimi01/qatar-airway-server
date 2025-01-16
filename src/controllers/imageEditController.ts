import jwt from "jsonwebtoken";
import prisma from "../models/userModel";

export const imageEditController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token in headers
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    // Decode token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };
    const { userId } = decoded;
    const { img } = req.body;

    if (!img) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Update the user's profile image
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { img },
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
