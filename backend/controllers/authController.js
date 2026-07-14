import bcrypt from "bcryptjs";
import { registerSchema } from "../validators/authValidator.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    email: email.toLocaleLowerCase(),
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
