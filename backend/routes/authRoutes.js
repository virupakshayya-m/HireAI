import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Dummy route to check
router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
