import { useState } from "react";
import api from "../api";

export default function AddTrip() {
  const [trip, setTrip] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/trips", trip);
      alert("Trip added successfully!");
      setTrip({ destination: "", startDate: "", endDate: "", notes: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding trip");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 flex flex-col gap-3 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-semibold">Add New Trip</h1>
      <input
        type="text"
        placeholder="Destination"
        value={trip.destination}
        onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        value={trip.startDate}
        onChange={(e) => setTrip({ ...trip, startDate: e.target.value })}
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        value={trip.endDate}
        onChange={(e) => setTrip({ ...trip, endDate: e.target.value })}
        className="border p-2 rounded"
        required
      />
      <textarea
        placeholder="Notes"
        value={trip.notes}
        onChange={(e) => setTrip({ ...trip, notes: e.target.value })}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Add Trip
      </button>
    </form>
  );
}
