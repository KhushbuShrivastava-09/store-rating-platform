import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import SearchFilter from "../component/SearchFilter";
import { FaStar } from "react-icons/fa";
import API from "../api";
import "./Home.css";

export const Home = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await API.get("/stores");
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRating = (storeId, rating) => {
    setStores(stores.map(s => s.id === storeId ? { ...s, tempRating: rating } : s));
  };

  const handleReviewChange = (storeId, review) => {
    setStores(stores.map(s => s.id === storeId ? { ...s, tempReview: review } : s));
  };

  const handleSubmit = async (storeId) => {
    const store = stores.find(s => s.id === storeId);
    if (!store.tempRating) return;

    try {
      if (editingReviewId) {
        // Edit existing review
        await API.put(`/stores/reviews/${editingReviewId}`, {
          rating: store.tempRating,
          review: store.tempReview || "",
        });
        setEditingReviewId(null);
      } else {
        // Add new review
        await API.post(`/stores/${storeId}/reviews`, {
          rating: store.tempRating,
          review: store.tempReview || "",
        });
      }

      // Clear temp fields
      setStores(stores.map(s =>
        s.id === storeId ? { ...s, tempRating: 0, tempReview: "" } : s
      ));

      fetchStores(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await API.delete(`/stores/reviews/${reviewId}`);
      fetchStores();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStores = stores.filter(
    s => s.name.toLowerCase().includes(search.toLowerCase()) ||
         s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sr-home">
      <h2 className="sr-home-title">
        Welcome {user?.name || "Guest"}! Explore Stores & Share Your Experience
      </h2>

      <SearchFilter search={search} setSearch={setSearch} />

      <div className="sr-store-list">
        {filteredStores.map(store => (
          <div key={store.id} className="sr-store-card">
            <h3>{store.name}</h3>
            <p>{store.address}</p>
            <p>⭐ {(Number(store.overallRating) || 0).toFixed(1)}</p>

            <div className="sr-rating-section">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  size={22}
                  className={star <= (store.tempRating || 0) ? "sr-star-active" : "sr-star"}
                  onClick={() => handleRating(store.id, star)}
                />
              ))}
            </div>

            <textarea
              placeholder="Write your review..."
              value={store.tempReview || ""}
              onChange={(e) => handleReviewChange(store.id, e.target.value)}
            />

            {user ? (
              <button onClick={() => handleSubmit(store.id)}>
                {editingReviewId ? "Update Review" : "Submit Review"}
              </button>
            ) : (
              <p>Please sign in to leave a review</p>
            )}

            {store.reviews?.length > 0 && (
              <div>
                <h4>All Reviews:</h4>
                {store.reviews.map((r) => (
                  <div key={r.id} className="sr-review-item">
                    <strong>{r.username}</strong>: ⭐ {r.rating}
                    <p>{r.review}</p>

                    {/* Show Edit/Delete only for the logged-in user */}
                    {user && String(user.id) === String(r.user_id) && (
                      <div className="sr-review-actions">
                        <button onClick={() => {
                          handleRating(store.id, r.rating);
                          handleReviewChange(store.id, r.review);
                          setEditingReviewId(r.id);
                        }}>Edit</button>
                        <button onClick={() => handleDelete(r.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
