import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
} from "../controllers/jobController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/", getAllJobs);
router.get("/me", protect, restrictTo("recruiter"), getMyJobs);
router.get("/:id", getJobById);
router.post("/", protect, restrictTo("recruiter"), createJob);

export default router;
