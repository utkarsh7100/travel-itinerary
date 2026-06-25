const BASE_URL = "http://localhost:4000/api";

// ─── TRIPS ───────────────────────────────────────────

export const getTrips = async () => {
  const res = await fetch(`${BASE_URL}/trips`);
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
};

export const createTrip = async (trip) => {
  const res = await fetch(`${BASE_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
};

export const updateTrip = async (id, trip) => {
  const res = await fetch(`${BASE_URL}/trips/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip),
  });
  if (!res.ok) throw new Error("Failed to update trip");
  return res.json();
};

export const deleteTrip = async (id) => {
  const res = await fetch(`${BASE_URL}/trips/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete trip");
  return res.json();
};

export const saveItinerary = async (id, itinerary) => {
  const res = await fetch(`${BASE_URL}/trips/${id}/itinerary`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itinerary }),
  });
  if (!res.ok) throw new Error("Failed to save itinerary");
  return res.json();
};

// ─── AI ──────────────────────────────────────────────

export const generateAIItinerary = async ({ destination, days }) => {
  const res = await fetch(`${BASE_URL}/trips/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destination, days }),
  });
  if (!res.ok) throw new Error("Failed to generate itinerary");
  return res.json();
};