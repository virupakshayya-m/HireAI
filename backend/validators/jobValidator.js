import { z } from "zod";

export const jobSchema = z
  .object({
    title: z.string().trim().min(2, "Title must be at least 2 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    requirements: z
      .array(z.string().trim())
      .nonempty({ message: "You must provide at least one requirement" }),
    salary: z.number().positive({ message: "Salary must be greater than 0." }),
    location: z.string().trim().min(2, "Location must be at least 2 characters"),
    employmentType: z.enum([
      "full-time",
      "part-time",
      "internship",
      "contract",
      "remote",
    ]),
    experienceLevel: z.enum(["fresher", "junior", "mid", "senior"]),
  })
  .strict();
