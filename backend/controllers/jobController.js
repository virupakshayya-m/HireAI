import Job from "../models/jobModel.js";
import { jobSchema } from "../validators/jobValidator.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

export const createJob = asyncHandler(async (req, res) => {
  const validatedResult = jobSchema.safeParse(req.body);

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

  const newJob = new Job({
    ...validatedResult.data,
    company: recruiter.company,
    createdBy: recruiter._id,
  });

  const savedJob = await newJob.save();

  return res.status(201).json({
    success: true,
    message: "Job created successfully",
    job: savedJob,
  });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword?.trim();
  const location = req.query.location?.trim();
  const employmentType = req.query.employmentType?.trim();
  const experienceLevel = req.query.experienceLevel?.trim();

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 100);

  if (page < 1 || limit < 1 || Number.isNaN(page) || Number.isNaN(limit)) {
    throw new AppError("Page and limit must be positive numbers", 400);
  }

  const skip = (page - 1) * limit;

  const query = {};

  if (keyword) {
    query.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  if (location) {
    query.location = {
      $regex: `^${location}$`,
      $options: "i",
    };
  }

  if (employmentType) {
    query.employmentType = employmentType;
  }

  if (experienceLevel) {
    query.experienceLevel = experienceLevel;
  }

  const totalJobs = await Job.countDocuments(query);

  const jobs = await Job.find(query)
    .populate("company", "name logo location")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalJobs / limit);

  return res.status(200).json({
    success: true,
    jobs,
    pagination: {
      currentPage: page,
      limit,
      totalJobs,
      totalPages,
    },
  });
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword?.trim();
  const location = req.query.location?.trim();
  const employmentType = req.query.employmentType?.trim();
  const experienceLevel = req.query.experienceLevel?.trim();

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 100);

  if (page < 1 || limit < 1 || Number.isNaN(page) || Number.isNaN(limit)) {
    throw new AppError("Page and limit must be positive numbers", 400);
  }

  const skip = (page - 1) * limit;

  const query = {
    createdBy: req.user._id,
  };

  if (keyword) {
    query.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  if (location) {
    query.location = {
      $regex: `^${location}$`,
      $options: "i",
    };
  }

  if (employmentType) {
    query.employmentType = employmentType;
  }

  if (experienceLevel) {
    query.experienceLevel = experienceLevel;
  }

  const totalJobs = await Job.countDocuments(query);

  const jobs = await Job.find(query)
    .populate("company", "name logo location")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalJobs / limit);

  return res.status(200).json({
    success: true,
    jobs,
    pagination: {
      currentPage: page,
      limit,
      totalJobs,
      totalPages,
    },
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid job id", 400);
  }

  const job = await Job.findById(id).populate(
    "company",
    "name logo location website",
  );

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return res.status(200).json({
    success: true,
    job,
  });
});
