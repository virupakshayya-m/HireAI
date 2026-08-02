import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import { updateApplicationStatusSchema } from "../validators/applicationValidator.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

export const applyForJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid job id", 400);
  }

  const job = await Job.findById(id).select("company").lean();

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const alreadyApplied = await Application.exists({
    candidate: req.user._id,
    job: job._id,
  });

  if (alreadyApplied) {
    throw new AppError("You have already applied for this job", 409);
  }

  const newApplication = new Application({
    candidate: req.user._id,
    job: job._id,
    company: job.company,
  });

  const savedApplication = await newApplication.save();

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application: savedApplication,
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 100);

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
    throw new AppError("Page and limit must be positive numbers", 400);
  }

  const skip = (page - 1) * limit;

  const query = {
    candidate: req.user._id,
  };

  const totalApplications = await Application.countDocuments(query);

  const totalPages = Math.ceil(totalApplications / limit);

  const applications = await Application.find(query)
    .populate({
      path: "job",
      select:
        "title location employmentType experienceLevel salary createdAt company",
      populate: {
        path: "company",
        select: "name logo location",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    applications,
    pagination: {
      currentPage: page,
      limit,
      totalApplications,
      totalPages,
    },
  });
});

export const getJobApplicants = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid job id", 400);
  }

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 100);

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
    throw new AppError("Page and limit must be positive numbers", 400);
  }

  const job = await Job.findById(id).select("createdBy");

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (!job.createdBy.equals(req.user._id)) {
    throw new AppError("You are not owner of this job", 403);
  }

  const skip = (page - 1) * limit;
  const query = { job: job._id };

  const totalApplications = await Application.countDocuments(query);

  const totalPages = Math.ceil(totalApplications / limit);

  const applications = await Application.find(query)
    .populate("candidate", "name email profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    applications,
    pagination: {
      currentPage: page,
      limit,
      totalApplications,
      totalPages,
    },
  });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const validatedResult = updateApplicationStatusSchema.safeParse(req.body);

  if (!validatedResult.success) {
    return res.status(400).json({
      success: false,
      message: "validation failed",
      errors: validatedResult.error.flatten().fieldErrors,
    });
  }

  const application = await Application.findById(id).populate(
    "job",
    "createdBy",
  );

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (!application.job.createdBy.equals(req.user._id)) {
    throw new AppError(
      "You are not authorized to update this application",
      403,
    );
  }

  application.status = validatedResult.data.status;

  await application.save();

  return res.status(200).json({
    success: true,
    message: "Application status updated successfully",
    application,
  });
});
