import pool from "../config/db.js";

export const createUser = async ({ name, email, password, address }) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, 'user', ?)",
    [name, email, password, address]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query("SELECT id, name, email, role, address FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const updatePassword = async (id, newPassword) => {
  await pool.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, id]);
};
