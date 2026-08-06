import { z } from "zod";

export const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
    bio: z.string().trim().optional(),
    skills: z.array(z.string().trim()).optional(),
    education: z.string().trim().optional(),
    experience: z.string().trim().optional(),
    profilePhoto: z.string().trim().url().or(z.literal("")).optional(),
  })
  .strict();
