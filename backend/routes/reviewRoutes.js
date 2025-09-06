import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReview,
  getReviewsByStore,
  getOverallRating,
  updateReview,
  deleteReview
} from "../models/ReviewModel.js";

const router = express.Router();

// Create a new review
router.post("/:storeId/reviews", protect, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const userId = req.user.id;
    const storeId = req.params.storeId;

    await createReview({ userId, storeId, rating, review });

    const reviews = await getReviewsByStore(storeId);
    const overallRating = await getOverallRating(storeId);

    res.status(201).json({ reviews, overallRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all reviews for a store
router.get("/:storeId/reviews", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const reviews = await getReviewsByStore(storeId);
    const overallRating = await getOverallRating(storeId);

    res.json({ reviews, overallRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a review
router.put("/reviews/:reviewId", protect, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const updated = await updateReview({ reviewId, userId, rating, review });
    if (!updated) return res.status(403).json({ message: "Unauthorized" });

    res.json({ message: "Review updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a review
router.delete("/reviews/:reviewId", protect, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const deleted = await deleteReview({ reviewId, userId });
    if (!deleted) return res.status(403).json({ message: "Unauthorized" });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
