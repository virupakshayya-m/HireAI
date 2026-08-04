import User from "../models/userModel.js";
import { profileSchema } from "../validators/profileValidator.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { extractResumeText } from "../utils/resumeExtractor.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDelete.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const validatedResult = profileSchema.safeParse(req.body);

  if (!validatedResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validatedResult.error.flatten().fieldErrors,
    });
  }

  const user = req.user;

  Object.keys(validatedResult.data).forEach((key) => {
    user.profile[key] = validatedResult.data[key];
  });

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Resume file is required", 400);
  }

  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new AppError("Only PDF and DOCX files are allowed", 400);
  }

  const extractedText = await extractResumeText(req.file);

  if (!extractedText.trim()) {
    throw new AppError("Unable to extract text from resume", 400);
  }

  const uploadedResume = await uploadToCloudinary(
    req.file.buffer,
    "hireai/resumes",
  );

  const oldPublicId = req.user.profile?.resume?.publicId;

  req.user.profile.resume = {
    url: uploadedResume.secure_url,
    publicId: uploadedResume.public_id,
    extractedText,
  };

  await req.user.save();

  try {
    await deleteFromCloudinary(oldPublicId);
  } catch (error) {
    console.error("Failed to delete old resume:", error);
  }

  return res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    resume: {
      url: req.user.profile.resume.url,
    },
  });
});
