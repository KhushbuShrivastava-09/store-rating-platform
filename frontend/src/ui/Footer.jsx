import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>Store Rating</h2>
          <p>Building a smarter web experience with sleek design and smooth UX.</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="link-group">
            <h4>Support</h4>
            <ul>
              <li>Contact</li>
              <li>FAQs</li>
              <li>Help Center</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="newsletter">
        <h3>Subscribe to our newsletter</h3>
        <p>Get the latest updates, news, and offers directly in your inbox.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2025 Store Rating. All rights reserved.
      </div>
    </footer>
  );
};
