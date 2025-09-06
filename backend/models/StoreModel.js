import pool from "../config/db.js";

export const getStores = async () => {
  const [rows] = await pool.query("SELECT * FROM stores");
  return rows;
};

export const getStoreById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM stores WHERE id = ?", [id]);
  return rows[0];
};
