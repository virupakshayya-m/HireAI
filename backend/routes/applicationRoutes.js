import { Router } from "express";
import {
  applyForJob,
  getMyApplications,
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

export default router;
