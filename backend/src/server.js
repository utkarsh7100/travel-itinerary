import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import tripRoutes from "./routes/triproutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("🚀 Travel Itinerary Backend is running successfully!");
});


app.use("/api/trips", tripRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});



