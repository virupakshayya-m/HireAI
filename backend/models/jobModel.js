import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "internship", "contract", "remote"],
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["fresher", "junior", "mid", "senior"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
