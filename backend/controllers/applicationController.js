import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import { success } from "zod";

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
