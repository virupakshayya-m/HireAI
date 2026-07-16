import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Dummy route to check
router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post("/jobs", protect, restrictTo("recruiter"), (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post("/jobs/apply", protect, restrictTo("candidate"), (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
