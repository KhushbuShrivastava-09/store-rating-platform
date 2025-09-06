import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export const LogIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      await login(form.email, form.password); // AuthContext sets user and token

      // 🔹 Redirect based on role
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user?.role === "admin") {
        navigate("/admin"); // Admin goes to admin dashboard
      } else {
        navigate("/"); // Normal user goes to home
      }
    } catch (err) {
      setError(err); // Error is a string from AuthContext
    }
  };

  return (
    <div className="auth-container">
      <h2>Log In</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Log In</button>
      </form>
      <p className="auth-switch">
        Don’t have an account? <Link to="/signin" className="auth-link">Sign Up</Link>
      </p>
    </div>
  );
};
