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

  // Handle name update if it's provided (name sits on root user model, not profile)
  if (validatedResult.data.name !== undefined) {
    user.name = validatedResult.data.name;
    delete validatedResult.data.name;
  }

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

export const uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Photo file is required", 400);
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new AppError("Only JPG, PNG and WEBP image files are allowed", 400);
  }

  const uploadedPhoto = await uploadToCloudinary(
    req.file.buffer,
    "hireai/profiles",
  );

  let oldPublicId = null;
  const currentPhotoUrl = req.user.profile?.profilePhoto;
  
  // If there's an existing photo from Cloudinary, try to extract its publicId
  if (currentPhotoUrl && currentPhotoUrl.includes("cloudinary.com")) {
    try {
      // Very basic extraction of public ID from cloudinary URL
      // https://res.cloudinary.com/dbx/.../upload/v1234/hireai/profiles/abc123.jpg
      const parts = currentPhotoUrl.split("/");
      const filename = parts[parts.length - 1];
      const folder = parts[parts.length - 2];
      const folder2 = parts[parts.length - 3];
      if (folder2 === "hireai" && folder === "profiles") {
        oldPublicId = `hireai/profiles/${filename.split(".")[0]}`;
      }
    } catch (e) {
      console.log("Could not parse old photo public ID");
    }
  }

  req.user.profile.profilePhoto = uploadedPhoto.secure_url;

  await req.user.save();

  if (oldPublicId) {
    try {
      await deleteFromCloudinary(oldPublicId);
    } catch (error) {
      console.error("Failed to delete old profile photo:", error);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Profile photo uploaded successfully",
    profilePhoto: req.user.profile.profilePhoto,
  });
});
