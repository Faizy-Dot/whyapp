import express from "express";
import UserModel from "../models/Users.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import upload from "../multer.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ message: "Plz fill Username" });
    if (!email) return res.status(400).json({ message: "Plz fill Email" });
    if (!password) return res.status(400).json({ message: "Plz fill Password" });

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const avatarUrl = req.file ? req.file.path : ""; // Cloudinary gives `path` as URL

    const newUser = new UserModel({
      username,
      email,
      password: hashPassword,
      avatar: avatarUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await UserModel.findOne({ email: email }).lean()

  if (!user) return res.status(400).json({ message: "User is not registered" })

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return res.status(400).json({ message: "Invalid Password" })

  const token = jwt.sign(
    { id: user._id },
    process.env.AUTH_SECRET,
    { expiresIn: "7d" }
  );


  res.status(200).json({
    message: "User login successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || null, // include avatar
    },
    token,
  });
})

// Protected route: Get all users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    // exclude password from result
    const users = await UserModel.find({}, "-password");
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router; // Ensure you export the router
