import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["candidate", "recruiter", "admin"],
        default: "candidate"
    },
    profile: {
        bio: String,
        skills: [String],
        resume: String,
        company: {type: mongoose.Schema.Types.ObjectId, ref: "company"}
    }
}, {timestamps: true});

export default mongoose.model("User", userSchema);