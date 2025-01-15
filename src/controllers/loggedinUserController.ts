import jwt from "jsonwebtoken";
import prisma from "../models/userModel";

// Middleware or controller action to fetch logged-in user data
export const getUserData = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming the token is sent in the Authorization header (Bearer token)

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string };
    
    // Find the user by the ID from the decoded token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        loggedInUser: true,  // Include related LoggedInUser data
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user data along with the logged-in information
    return res.status(200).json({
      message: "User data retrieved successfully",
      userData: {...user},
      loggedInUser: user.loggedInUser,
    });

  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


// import jwt from "jsonwebtoken";
// import prisma from "../models/userModel";

// export const getUserData = async (req: any, res: any) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Assuming the token is sent in the Authorization header (Bearer token)

//   if (!token) {
//     return res.status(401).json({ error: "Authorization token is required" });
//   }

//   try {
//     // Verify the JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string };

//     // Find the user by the ID from the decoded token
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       include: {
//         loggedInUser: true, // Include related LoggedInUser data
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Destructure `loggedInUser` from the user object
//     const { loggedInUser, ...userFields } = user;

//     // Embed user fields (excluding loggedInUser) into the LoggedInUser object
//     const enhancedLoggedInUser = {
//       ...loggedInUser,
//       ...userFields,
//     };

//     // Return the enhanced LoggedInUser object
//     return res.status(200).json({
//       message: "User data retrieved successfully",
//       loggedInUser: enhancedLoggedInUser,
//     });
//   } catch (error) {
//     console.error("Error during token verification:", error);
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };
