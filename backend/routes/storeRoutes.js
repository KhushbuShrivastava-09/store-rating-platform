import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getStores, getStoreById } from "../models/StoreModel.js";
import { createReview, getReviewsByStore, getOverallRating } from "../models/ReviewModel.js";

const router = express.Router();

// GET all stores with reviews and overallRating
router.get("/", async (req, res) => {
  try {
    const stores = await getStores();

    const enrichedStores = await Promise.all(
      stores.map(async (store) => {
        const reviews = await getReviewsByStore(store.id);

        // Make sure overallRating is always a number
        const overallRatingRaw = await getOverallRating(store.id);
        const overallRating = overallRatingRaw !== null ? Number(overallRatingRaw) : 0;

        return {
          ...store,
          reviews: reviews || [], // ensure reviews is always an array
          overallRating,
        };
      })
    );

    res.json(enrichedStores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores" });
  }
});

// POST a review
router.post("/:id/reviews", protect, async (req, res) => {
  const { rating, review } = req.body;
  const storeId = req.params.id;

  try {
    await createReview({ userId: req.user.id, storeId, rating, review });

    const store = await getStoreById(storeId);
    const reviews = await getReviewsByStore(storeId);
    const overallRatingRaw = await getOverallRating(storeId);
    const overallRating = overallRatingRaw !== null ? Number(overallRatingRaw) : 0;

    res.json({ ...store, reviews: reviews || [], overallRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error posting review" });
  }
});

export default router;
