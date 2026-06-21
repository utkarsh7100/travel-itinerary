import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  itinerary: {
    type: Array,
    default: [],
  },
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;