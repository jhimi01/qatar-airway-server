import express from "express";
var cors = require('cors')
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const.use(cors())
const app = express();
const prisma = new PrismaClient();
const port = 5000;

// node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"

app.use(express.json()); // Parse JSON request bodies

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
    createdAt,
    updatedAt,
  } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      title,
      dateOfBirth,
      gender,
      countryCode,
      mobileNumber,
      country,
      createdAt,
      updatedAt,
    },
  });

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    "your_secret_key", // Secret key (should be an environment variable)
    { expiresIn: "1h" }
  );

  res.status(201).json({ message: "User created", token });
});

// Login Route
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
    "your_secret_key", // Secret key (should be an environment variable)
    { expiresIn: "1h" }
  );

  res.json({ message: "Logged in successfully", token });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
