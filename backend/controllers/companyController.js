import Company from "../models/companyModel.js";
import {
  companySchema,
  updateCompanySchema,
} from "../validators/companyValidator.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import mongoose, { mongo } from "mongoose";

export const createCompany = asyncHandler(async (req, res) => {
  const validatedResult = companySchema.safeParse(req.body);

  if (!validatedResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validatedResult.error.flatten().fieldErrors,
    });
  }

  const recruiter = req.user;

  if (!recruiter) {
    throw new AppError("User not found", 404);
  }

  if (recruiter.company) {
    throw new AppError("Recruiter already has a company", 409);
  }

  const newCompany = new Company({
    ...validatedResult.data,
    createdBy: recruiter._id,
  });

  const savedCompany = await newCompany.save();

  recruiter.company = savedCompany._id;
  await recruiter.save();

  return res.status(201).json({
    success: true,
    message: "Company created successfully",
    company: savedCompany,
  });
});

export const getMyCompany = asyncHandler(async (req, res) => {
  const recruiter = req.user;

  if (!recruiter.company) {
    throw new AppError("Recruiter has not created a company yet", 403);
  }

  const company = await Company.findById(recruiter.company);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return res.status(200).json({
    success: true,
    company,
  });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const validatedResult = updateCompanySchema.safeParse(req.body);

  if (!validatedResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validatedResult.error.flatten().fieldErrors,
    });
  }

  const recruiter = req.user;

  if (!recruiter.company) {
    throw new AppError("Recruiter has not created a company yet", 403);
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    recruiter.company,
    validatedResult.data,
    { new: true, runValidators: true },
  );

  if (!updatedCompany) {
    throw new AppError("Company not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Company updated successfully",
    company: updatedCompany,
  });
});

export const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Company id", 400);
  }

  const company = await Company.findById(id);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return res.status(200).json({
    success: true,
    company,
  });
});
