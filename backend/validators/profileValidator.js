import { z } from "zod";

export const profileSchema = z
  .object({
    bio: z.string().trim().optional(),
    skills: z.array(z.string().trim()).optional(),
    education: z.string().trim().optional(),
    experience: z.string().trim().optional(),
    profilePhoto: z.string().trim().url().optional(),
  })
  .strict();
