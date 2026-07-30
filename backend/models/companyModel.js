import mongoose from "mongoose";
import { lowercase } from "zod";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      tim: true,
    },
    description: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);

export default Company;
