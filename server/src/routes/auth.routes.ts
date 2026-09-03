import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working 🚀",
  });
});

// Authentication
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected Route
router.get("/me", protect, getMe);
router.patch("/me", protect, updateProfile);

export default router;
