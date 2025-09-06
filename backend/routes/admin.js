// backend/routes/admin.js
import express from "express";
import pool from "../config/db.js"; 
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware: allow only admin
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

// ✅ Get all users (with optional role filter)
router.get("/users", protect, adminOnly, async (req, res) => {
  const { role } = req.query;
  try {
    let query = "SELECT id, name, email, role, address FROM users";
    let params = [];

    if (role) {
      query += " WHERE role = ?";
      params.push(role);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all stores (with owner_name + overall_rating)
router.get("/stores", protect, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.name, s.address, s.owner_id,
             u.name AS owner_name,
             AVG(r.rating) AS overall_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN reviews r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.address, s.owner_id, u.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new store
router.post("/stores", protect, adminOnly, async (req, res) => {
  const { name, address, ownerId } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)",
      [name, address, ownerId || null]
    );
    res.json({ message: "Store added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete store
router.delete("/stores/:id", protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM stores WHERE id = ?", [id]);
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all reviews (with user + store details)
router.get("/reviews", protect, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.rating, r.review, r.created_at,
             u.name AS user_name, u.email AS user_email,
             s.name AS store_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
