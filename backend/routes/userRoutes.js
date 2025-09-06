import express from "express";
import bcrypt from "bcryptjs";
import { protect } from "../middleware/authMiddleware.js";
import { findUserById, updatePassword } from "../models/UserModel.js";

const router = express.Router();

// Get user details
router.get("/me", protect, async (req, res) => {
  const user = await findUserById(req.user.id);
  res.json(user);
});

// Change password
router.put("/change-password", protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await findUserById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await updatePassword(req.user.id, hashed);

    res.json({ message: "Password updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
