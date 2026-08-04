import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/", getAllJobs);
router.get("/me", protect, restrictTo("recruiter"), getMyJobs);
router.get("/:id", getJobById);
router.post("/", protect, restrictTo("recruiter"), createJob);
router.patch("/:id", protect, restrictTo("recruiter"), updateJob);
router.delete("/:id", protect, restrictTo("recruiter"), deleteJob);

export default router;
