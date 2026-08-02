import { z } from "zod";

export const updateApplicationStatusSchema = z
  .object({
    status: z.enum(["pending", "shortlisted", "accepted", "rejected"]),
  })
  .strict();
