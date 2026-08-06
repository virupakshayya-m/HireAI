import { z } from "zod";

export const companySchema = z
  .object({
    name: z.string().trim().min(2, "Company name is required"),
    description: z.string().trim().optional(),
    website: z.string().trim().url("Invalid website URL").or(z.literal("")).optional(),
    location: z.string().trim().optional(),
    industry: z.string().trim().optional(),
    logo: z.string().trim().url("Invalid logo image URL").or(z.literal("")).optional(),
  })
  .strict();

export const updateCompanySchema = companySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });
