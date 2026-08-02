import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    profile: {
      bio: {
        type: String,
        default: "",
      },
      skills: {
        type: [String],
        default: [],
      },
      resume: {
        url: {
          type: String,
          default: "",
        },
        publicId: {
          type: String,
          default: "",
        },
        extractedText: {
          type: String,
          default: "",
        },
      },
      education: {
        type: String,
        default: "",
      },
      experience: {
        type: String,
        default: "",
      },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
