import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sr-navbar">
      <div className="sr-navbar-logo">⭐ Store Rating</div>

      {/* Desktop Links */}
      <ul className={`sr-navbar-links ${isOpen ? "sr-open" : ""}`}>
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "sr-active" : "")}>
            Home
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/stores" className={({ isActive }) => (isActive ? "sr-active" : "")}>
            Stores
          </NavLink>
        </li> */}
        <li>
          <NavLink to="/signin" className={({ isActive }) => (isActive ? "sr-active" : "")}>
            Signup
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/login" className={({ isActive }) => (isActive ? "sr-active" : "")}>
            Login
          </NavLink>
        </li> */}
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "sr-active" : "")}>
            Profile
          </NavLink>
        </li>
      </ul>

      {/* Hamburger Icon */}
      <div className="sr-navbar-toggle" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};
