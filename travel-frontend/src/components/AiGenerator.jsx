import { useState } from "react";
import { generateAIItinerary, saveItinerary } from "../api";

function AIGenerator({ trip, onItineraryGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateAIItinerary({
        destination: trip.destination,
        days: trip.days,
      });
      const saved = await saveItinerary(trip._id, data.itinerary);
      onItineraryGenerated(saved);
    } catch (err) {
      setError("Failed to generate. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-generator">
      {error && <p className="ai-error">{error}</p>}
      <button
        className="ai-btn"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <span className="ai-btn-loading">
            <span className="spinner" />
            Generating…
          </span>
        ) : (
          <>
            <span className="ai-icon">✨</span>
            {trip.itinerary?.length > 0
              ? "Regenerate with AI"
              : "Generate with AI"}
          </>
        )}
      </button>
    </div>
  );
}

export default AIGenerator;