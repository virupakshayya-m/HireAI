import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Your session has expired. Please log in again.", 401);
    }
    throw new AppError("Not authorized, invalid token", 401);
  }

  const currentUser = await User.findById(decoded.id).select("-password");

  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token no longer exists.",
      401,
    );
  }

  req.user = currentUser;
  next();
});
