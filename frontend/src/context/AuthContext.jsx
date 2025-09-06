// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Backend API
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Safe parse helper
const safeParse = (item) => {
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    safeParse(localStorage.getItem("currentUser")) || null
  );

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };

  // 🔹 Register
  const register = async (data) => {
    try {
      const res = await API.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      throw err.response?.data?.message || "Registration failed";
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  // 🔹 Update user info (profile fetch)
  const updateUser = async () => {
    try {
      const res = await API.get("/user/me");
      setUser(res.data);
      localStorage.setItem("currentUser", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  // 🔹 Load user on mount if token exists
  useEffect(() => {
    if (localStorage.getItem("token")) updateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
