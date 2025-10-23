// src/models/Trip.js
import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  estimatedBudget: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
