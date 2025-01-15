// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import prisma from "../models/userModel"; // Assuming you have a Prisma client

// export const editProfileController = async (req: any, res: any) => {
//   try {
//     const userId = req.user.id; // Assuming the user is authenticated and the user ID is available from JWT token
//     console.log("user Id", userId);
//     const {
//       firstName,
//       lastName,
//       email,
//       mobileNumber,
//       dateOfBirth,
//       gender,
//       nid,
//       country,
//       title,
//       address,
//       password,
//     } = req.body;

//     // // Validate input fields
//     // if (!firstName || !lastName || !email || !mobileNumber) {
//     //   return res
//     //     .status(400)
//     //     .json({ message: "All required fields must be filled." });
//     // }

//     // Check if email already exists (optional, if you are updating email)
//     // const emailExist = await prisma.user.findUnique({ where: { email } });
//     // if (emailExist && emailExist.id !== userId) {
//     //   return res.status(400).json({ message: "Email is already in use." });
//     // }

//     // Prepare updated data
//     const updateData: any = {
//       firstName,
//       lastName,
//       email,
//       mobileNumber,
//       dateOfBirth,
//       gender,
//       nid,
//       country,
//       title,
//       address,
//     };

//     // Hash password if updated
//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateData.password = hashedPassword;
//     }

//     // Update user data in the database using Prisma
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: updateData,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Send response with updated user data (excluding sensitive info like password)
//     const userResponse = {
//       id: updatedUser.id,
//       firstName: updatedUser.firstName,
//       lastName: updatedUser.lastName,
//       email: updatedUser.email,
//       mobileNumber: updatedUser.mobileNumber,
//       dateOfBirth: updatedUser.dateOfBirth,
//       gender: updatedUser.gender,
//       nid: updatedUser.nid,
//       country: updatedUser.country,
//       title: updatedUser.title,
//       address: updatedUser.address,
//     };

//     res
//       .status(200)
//       .json({ message: "Profile updated successfully", user: userResponse });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Server error. Could not update profile." });
//   }
// };


import jwt from "jsonwebtoken";
import prisma from "../models/userModel"; // Adjust the import path as per your project structure

export const editProfileController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token in headers
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    // Decode token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string };

    // Extract the userId from loggedInUser
    const { userId } = decoded;

    // Validate and extract only the fields to update
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      dateOfBirth,
      gender,
      nid,
      country,
      title,
      address,
    } = req.body;

    // Create an update object with only the provided fields
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender) updateData.gender = gender;
    if (nid) updateData.nid = nid;
    if (country) updateData.country = country;
    if (title) updateData.title = title;
    if (address) updateData.address = address;

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
