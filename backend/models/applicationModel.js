import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "shortlisted", "accepted", "rejected"],
      default: "pending",
    },

    aiInsights: {
      matchScore: { type: Number, default: 0 },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      summary: { type: String, default: "" },
      interviewQuestions: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate applications
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
