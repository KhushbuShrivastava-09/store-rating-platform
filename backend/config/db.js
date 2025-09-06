import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "khushbu@27",
  database: "store_app",
});

export default pool;
