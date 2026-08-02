import { Router } from "express";
import {
  applyForJob,
  getJobApplicants,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/jobs/:id/apply", protect, restrictTo("candidate"), applyForJob);
router.get(
  "/applications/me",
  protect,
  restrictTo("candidate"),
  getMyApplications,
);
router.get(
  "/jobs/:id/applicants",
  protect,
  restrictTo("recruiter"),
  getJobApplicants,
);
router.patch(
  "/applications/:id/status",
  protect,
  restrictTo("recruiter"),
  updateApplicationStatus,
);

export default router;
