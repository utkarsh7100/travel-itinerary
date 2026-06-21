import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Trip from "../models/Trip.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── TRIPS CRUD ──────────────────────────────────────

// GET all trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create trip
router.post("/", async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update trip
router.put("/:id", async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE trip
router.delete("/:id", async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH save itinerary to trip
router.patch("/:id/itinerary", async (req, res) => {
  try {
    const { itinerary } = req.body;
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { itinerary, aiGenerated: true },
      { new: true }
    );
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── AI GENERATE ─────────────────────────────────────

router.post("/ai/generate", async (req, res) => {
  const { destination, days } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: "destination and days are required" });
  }

  const prompt = `You are an expert travel planner. Create a ${days}-day itinerary for ${destination}.

Return ONLY a valid JSON array, no markdown, no explanation, no backticks:
[
  {
    "day": 1,
    "activities": [
      "Morning: Visit ...",
      "Afternoon: Explore ...",
      "Evening: Dinner at ..."
    ]
  }
]

Make it realistic, specific and exciting. Include local food, culture and hidden gems.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const itinerary = JSON.parse(cleaned);
    res.json({ itinerary });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

export default router;