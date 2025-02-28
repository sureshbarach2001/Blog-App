const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redisClient = require("../config/redis");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../models/validation");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Middleware for parsing cookies
router.use(cookieParser());

// Generate Secure Tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Securely hash refresh tokens before storing
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// **Register Route**
router.post("/register", validateRegisterInput, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user instance
    const user = new User({ username, email, password });

    // Save user, trigger password hashing via Mongoose pre-save hook
    await user.save();
    console.log("✅ User registered:", user.email);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = hashToken(refreshToken);

    // Store refresh token in Redis
    await redisClient.set(`refresh:${user._id}`, hashedRefreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered",
      accessToken,
      user: { username, email },
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// **Login Route**
router.post("/login", validateLoginInput, async (req, res) => {
  const { email, password } = req.body;
  console.log("🔍 Login Attempt:", email);

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);

    // Compare password using model method
    user.comparePassword(password, async (err, isMatch) => {
      if (err || !isMatch) {
        console.log("❌ Password mismatch for:", email);
        return res.status(401).json({ message: "Invalid email or password" });
      }

      console.log("✅ Password match! Generating tokens...");

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const hashedRefreshToken = hashToken(refreshToken);

      // Store refresh token in Redis
      await redisClient.set(`refresh:${user._id}`, hashedRefreshToken, {
        EX: 7 * 24 * 60 * 60,
      });

      // Set refresh token in HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("✅ Login Successful for:", email);
      res.status(200).json({
        message: "Login successful",
        accessToken,
        user: { username: user.username, email: user.email },
      });
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// **Refresh Token Route** (remains the same)
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let userId;
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      userId = decoded.id;
    } catch (error) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const hashedRefreshToken = hashToken(refreshToken);
    const storedToken = await redisClient.get(`refresh:${userId}`);

    if (!storedToken || storedToken !== hashedRefreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({ _id: userId });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("🔥 Refresh Token Error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

// **Logout Route** (remains the same)
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    let userId;
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      userId = decoded.id;
    } catch (error) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await redisClient.del(`refresh:${userId}`);

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("🔥 Logout Error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
});

module.exports = router;
