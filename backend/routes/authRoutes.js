import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controllers/authController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);
router.post("/refresh-token", refreshToken);

export default router;
