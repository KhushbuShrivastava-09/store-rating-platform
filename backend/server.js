import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
