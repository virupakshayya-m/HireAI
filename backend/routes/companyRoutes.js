import { Router } from "express";
import {
  createCompany,
  getCompanyById,
  getMyCompany,
  updateCompany,
} from "../controllers/companyController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/", protect, restrictTo("recruiter"), createCompany);
router.get("/me", protect, restrictTo("recruiter", getMyCompany));
router.patch("/me", protect, restrictTo("recruiter", updateCompany));
router.get("/:id", getCompanyById);

export default router;
