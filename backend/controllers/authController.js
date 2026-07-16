import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/tokenService.js";
import jwt from "jsonwebtoken";
import { success } from "zod";

export const registerUser = asyncHandler(async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      // .flatten().fieldErrors formats errors neatly by field name
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { name, email, password, role } = result.data;

  const emailExists = await User.exists({ email: email.toLowerCase() });
  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: {
        email: ["This email is already registered"], // Matches Zod's error array format!
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  });

  const savedUser = await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
    user: {
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",

      errors: result.error.flatten().fieldErrors,
    });
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 mins in milliseconds
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.status(200).json({
    success: true,
    message: "user logged in successfully",
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Not authorized. no token provided", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      throw new AppError("jwt expired", 401);
    }
    throw new AppError("Not authorized, invalid token", 401);
  }

  const currentUser = await User.findById(decoded.id).select("_id");
  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token no longer exists.",
      401,
    );
  }

  const accessToken = generateAccessToken(currentUser._id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Access token is successfully refreshed",
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
