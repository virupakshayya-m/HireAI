import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  uploadProfilePhoto,
} from "../controllers/profileController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/me", protect, restrictTo("candidate", "recruiter"), getMyProfile);
router.patch("/me", protect, restrictTo("candidate", "recruiter"), updateMyProfile);
router.put(
  "/resume",
  protect,
  restrictTo("candidate"),
  upload.single("resume"),
  uploadResume,
);
router.put(
  "/photo",
  protect,
  restrictTo("candidate", "recruiter"),
  upload.single("photo"),
  uploadProfilePhoto,
);

export default router;
