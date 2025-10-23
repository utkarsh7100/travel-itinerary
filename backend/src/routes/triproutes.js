import express from "express";
import Trip from "../models/Trip.js";

const router = express.Router();


router.post("/add", async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    await newTrip.save();
    res.status(201).json({ message: "Trip added successfully!", trip: newTrip });
  } catch (error) {
    console.error("Error adding trip:", error); 
    res.status(500).json({ error: "Failed to add trip", details: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error); 
    res.status(500).json({ error: "Failed to fetch trips", details: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Error deleting trip" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export default router;