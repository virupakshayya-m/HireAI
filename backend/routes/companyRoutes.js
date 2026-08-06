import { Router } from "express";
import {
  createCompany,
  getCompanyById,
  getMyCompany,
  updateCompany,
  uploadCompanyLogo,
} from "../controllers/companyController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = Router();

router.post("/", protect, restrictTo("recruiter"), createCompany);
router.get("/me", protect, restrictTo("recruiter"), getMyCompany);
router.patch("/me", protect, restrictTo("recruiter"), updateCompany);
router.put(
  "/logo",
  protect,
  restrictTo("recruiter"),
  upload.single("logo"),
  uploadCompanyLogo,
);
router.get("/:id", getCompanyById);

export default router;
