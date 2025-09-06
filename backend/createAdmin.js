// backend/createAdmin.js
import pool from "./config/db.js";
import bcrypt from "bcryptjs";

async function createOrUpdateAdmin() {
  const name = "Admin User";
  const email = "admin@example.com";
  const password = "admin123";
  const role = "admin";
  const address = "Nagpur";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      // Update password if admin exists
      await pool.query("UPDATE users SET password = ?, name = ?, role = ?, address = ? WHERE email = ?", [
        hashedPassword,
        name,
        role,
        address,
        email,
      ]);
      console.log("Admin user updated successfully.");
    } else {
      // Insert new admin
      await pool.query("INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, ?, ?)", [
        name,
        email,
        hashedPassword,
        role,
        address,
      ]);
      console.log("Admin user created successfully.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error creating/updating admin:", err);
    process.exit(1);
  }
}

createOrUpdateAdmin();
