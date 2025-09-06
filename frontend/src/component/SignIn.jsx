import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export const SignIn = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      await register(form); // AuthContext handles login automatically
      navigate("/"); // Redirect to Home
    } catch (err) {
      setError(err); // Error is a string from AuthContext
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <input type="email" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <input type="text" placeholder="Address"
          value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}/>
        <input type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
        <button type="submit">Sign Up</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login" className="auth-link">Log In</Link>
      </p>
    </div>
  );
};
