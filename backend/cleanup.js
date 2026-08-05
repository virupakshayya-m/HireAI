import mongoose from "mongoose";
import dotenv from "dotenv";
import Application from "./models/applicationModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    // Delete all applications with a matchScore of 0 (failed AI eval)
    const result = await Application.deleteMany({ "aiInsights.matchScore": 0 });
    console.log(`Deleted ${result.deletedCount} failed applications so you can re-apply!`);
    process.exit(0);
});
