import Company from "../models/companyModel.js";
import {
  companySchema,
  updateCompanySchema,
} from "../validators/companyValidator.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDelete.js";

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
    throw new AppError("Recruiter has not created a company yet", 404);
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
    throw new AppError("Recruiter has not created a company yet", 404);
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

export const uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Logo file is required", 400);
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new AppError("Only JPG, PNG and WEBP image files are allowed", 400);
  }

  const recruiter = req.user;

  if (!recruiter.company) {
    throw new AppError("Recruiter has not created a company yet", 404);
  }

  const company = await Company.findById(recruiter.company);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  const uploadedLogo = await uploadToCloudinary(
    req.file.buffer,
    "hireai/companies",
  );

  let oldPublicId = null;
  const currentLogoUrl = company.logo;
  
  // Try to extract old publicId if it was a Cloudinary upload
  if (currentLogoUrl && currentLogoUrl.includes("cloudinary.com")) {
    try {
      const parts = currentLogoUrl.split("/");
      const filename = parts[parts.length - 1];
      const folder = parts[parts.length - 2];
      const folder2 = parts[parts.length - 3];
      if (folder2 === "hireai" && folder === "companies") {
        oldPublicId = `hireai/companies/${filename.split(".")[0]}`;
      }
    } catch (e) {
      console.log("Could not parse old logo public ID");
    }
  }

  company.logo = uploadedLogo.secure_url;
  await company.save();

  if (oldPublicId) {
    try {
      await deleteFromCloudinary(oldPublicId);
    } catch (error) {
      console.error("Failed to delete old logo:", error);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Company logo uploaded successfully",
    logo: company.logo,
  });
});
