// src/component/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "./Profile.css";

export const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Optional: refresh user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/me");
        updateUser(res.data); // update context with latest user info
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [updateUser]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setMessage("❌ Please fill both fields");
      return;
    }

    setLoading(true);
    try {
      await API.put("/user/change-password", { oldPassword, newPassword });
      setMessage("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to update password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Address:</strong> {user?.address}</p>

      <form onSubmit={handlePasswordChange} className="profile-form">
        <h3>Change Password</h3>
        {message && <p className="profile-message">{message}</p>}
        <input
          type="password"
          placeholder="Enter Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      <button className="logout-btn" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};
