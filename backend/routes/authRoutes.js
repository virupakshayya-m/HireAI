import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);

// Dummy routes to check
router.post("/jobs", protect, restrictTo("recruiter"), (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post("/jobs/apply", protect, restrictTo("candidate"), (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
