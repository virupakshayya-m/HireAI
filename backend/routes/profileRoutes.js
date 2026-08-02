import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  uploadResume,
} from "../controllers/profileController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/me", protect, restrictTo("candidate"), getMyProfile);
router.patch("/me", protect, restrictTo("candidate"), updateMyProfile);
router.put(
  "/resume",
  protect,
  restrictTo("candidate"),
  upload.single("resume"),
  uploadResume,
);

export default router;
