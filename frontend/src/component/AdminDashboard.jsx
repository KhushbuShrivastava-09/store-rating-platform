// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./AdminDashboard.css";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [newStore, setNewStore] = useState({ name: "", address: "", ownerId: "" });

  const API = axios.create({ baseURL: "http://localhost:5000/api" });

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
      fetchOwners();
      fetchStores();
    }
  }, [user]);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await API.get("/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(res.data);
  };

  // Fetch all store owners
  const fetchOwners = async () => {
    const res = await API.get("/admin/users?role=store_owner", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setOwners(res.data);
  };

  // Fetch all stores with overall ratings
  const fetchStores = async () => {
    const res = await API.get("/admin/stores", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setStores(res.data);
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    await API.post(
      "/admin/stores",
      { name: newStore.name, address: newStore.address, ownerId: newStore.ownerId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchStores();
    setNewStore({ name: "", address: "", ownerId: "" });
  };

  const handleDeleteStore = async (id) => {
    await API.delete(`/admin/stores/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchStores();
  };

  if (user?.role !== "admin") {
    return <h2>⛔ Access Denied! Admins only.</h2>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Users Section */}
      <section className="admin-section">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Stores Section */}
      <section className="admin-section">
        <h2>Stores</h2>
        <form onSubmit={handleAddStore} className="add-store-form">
          <input
            type="text"
            placeholder="Store Name"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={newStore.address}
            onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
            required
          />
          <select
            value={newStore.ownerId}
            onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
            required
          >
            <option value="">Select Owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          <button type="submit">Add Store</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Overall Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.owner_name || "N/A"}</td>
                <td>{s.overall_rating ? s.overall_rating.toFixed(1) : "No Ratings"}</td>
                <td>
                  <button onClick={() => handleDeleteStore(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
