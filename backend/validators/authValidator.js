import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["candidate", "recruiter"]).optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});
