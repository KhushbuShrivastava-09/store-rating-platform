import pool from "../config/db.js";

export const createReview = async ({ userId, storeId, rating, review }) => {
  await pool.query(
    "INSERT INTO reviews (user_id, store_id, rating, review) VALUES (?, ?, ?, ?)",
    [userId, storeId, rating, review]
  );
};

export const getReviewsByStore = async (storeId) => {
  const [rows] = await pool.query(
    `SELECT r.rating, r.review, u.name as username
     FROM reviews r 
     JOIN users u ON r.user_id = u.id
     WHERE r.store_id = ? 
     ORDER BY r.created_at DESC`,
    [storeId]
  );
  return rows;
};

export const getOverallRating = async (storeId) => {
  const [rows] = await pool.query(
    "SELECT AVG(rating) as avgRating FROM reviews WHERE store_id = ?",
    [storeId]
  );
  // Return 0 if no reviews
  const avg = rows[0].avgRating;
  return avg !== null ? parseFloat(avg) : 0;
};
