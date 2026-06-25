import React, { useState, useEffect } from "react";
import { createTrip, getTrips, deleteTrip, updateTrip } from "./api";
import AIGenerator from "./components/AIGenerator";
import "./App.css";

function App() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchTrips(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTrips = async () => {
    setFetching(true);
    try {
      const data = await getTrips();
      setItineraries(data);
    } catch {
      showToast("Failed to load trips", "error");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination.trim() || !days) return;
    setLoading(true);
    try {
      const newTrip = await createTrip({ destination, days });
      setItineraries((prev) => [newTrip, ...prev]);
      setDestination("");
      setDays("");
      setExpandedTrip(newTrip._id);
      showToast(`✈️ Trip to ${newTrip.destination} created!`);
    } catch {
      showToast("Failed to create trip", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      setItineraries((prev) => prev.filter((t) => t._id !== id));
      setDeleteConfirm(null);
      if (expandedTrip === id) setExpandedTrip(null);
      showToast("Trip deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleEdit = async () => {
    if (!editModal) return;
    const { id, destination: dest, days: d } = editModal;
    try {
      const updated = await updateTrip(id, { destination: dest, days: d });
      setItineraries((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setEditModal(null);
      showToast(`✏️ Trip updated!`);
    } catch {
      showToast("Failed to update", "error");
    }
  };

  // Called when AI generates and saves itinerary
  const handleItineraryGenerated = (updatedTrip) => {
    setItineraries((prev) =>
      prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t))
    );
    showToast(`✨ AI itinerary generated for ${updatedTrip.destination}!`);
  };

  return (
    <div className="app">
      <div className="bg-texture" />

      <header className="header">
        <div className="header-inner">
          <div className="logo-mark">TI</div>
          <div>
            <h1 className="site-title">Travel Itinerary</h1>
            <p className="site-tagline">Plan. Explore. Remember.</p>
          </div>
          <div className="header-stat">
            <span className="stat-num">{itineraries.length}</span>
            <span className="stat-label">trips planned</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="form-section">
          <div className="section-label">NEW TRIP</div>
          <h2 className="section-title">Where are you headed?</h2>
          <form className="trip-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Destination</label>
              <div className="input-wrap">
                <span className="input-icon">🌍</span>
                <input
                  className="trip-input"
                  type="text"
                  placeholder="Tokyo, Bali, Paris…"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group input-group--small">
              <label className="input-label">Duration</label>
              <div className="input-wrap">
                <span className="input-icon">📅</span>
                <input
                  className="trip-input"
                  type="number"
                  placeholder="7"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  required
                />
                <span className="input-suffix">days</span>
              </div>
            </div>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="dot-pulse" />Planning…
                </span>
              ) : (
                <><span>Add Trip</span><span className="btn-arrow">→</span></>
              )}
            </button>
          </form>
        </section>

        <div className="divider">
          <span className="divider-line" />
          <span className="divider-icon">✦</span>
          <span className="divider-line" />
        </div>

        <section className="trips-section">
          <div className="trips-header">
            <div>
              <div className="section-label">YOUR JOURNEYS</div>
              <h2 className="section-title">Saved Trips</h2>
            </div>
            {itineraries.length > 0 && (
              <span className="trip-count">{itineraries.length}</span>
            )}
          </div>

          {fetching ? (
            <div className="loading-state">
              <div className="loading-globe">🌐</div>
              <p>Loading your trips…</p>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <h3>No adventures yet</h3>
              <p>Add your first destination above to get started</p>
            </div>
          ) : (
            <div className="trips-list">
              {itineraries.map((trip, idx) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  index={idx}
                  expanded={expandedTrip === trip._id}
                  onToggle={() =>
                    setExpandedTrip(expandedTrip === trip._id ? null : trip._id)
                  }
                  onEdit={() =>
                    setEditModal({ id: trip._id, destination: trip.destination, days: trip.days })
                  }
                  onDelete={() => setDeleteConfirm(trip._id)}
                  onItineraryGenerated={handleItineraryGenerated}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditModal(null)}>✕</button>
            <div className="modal-header">
              <div className="section-label">EDIT TRIP</div>
              <h3 className="modal-title">Update your plans</h3>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Destination</label>
                <div className="input-wrap">
                  <span className="input-icon">🌍</span>
                  <input
                    className="trip-input"
                    type="text"
                    value={editModal.destination}
                    onChange={(e) => setEditModal((m) => ({ ...m, destination: e.target.value }))}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Duration (days)</label>
                <div className="input-wrap">
                  <span className="input-icon">📅</span>
                  <input
                    className="trip-input"
                    type="number"
                    min="1"
                    value={editModal.days}
                    onChange={(e) => setEditModal((m) => ({ ...m, days: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="modal-save" onClick={handleEdit}>Save changes →</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal--danger" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="delete-icon">🗑️</div>
              <h3 className="modal-title">Delete this trip?</h3>
              <p className="modal-subtitle">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setDeleteConfirm(null)}>Keep it</button>
              <button className="modal-delete" onClick={() => handleDelete(deleteConfirm)}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

      <footer className="footer">
        <p>Built with React · Node.js · MongoDB · Gemini AI</p>
      </footer>
    </div>
  );
}

function TripCard({ trip, index, expanded, onToggle, onEdit, onDelete, onItineraryGenerated }) {
  const DEST_COLORS = ["#c8a97e","#8bafd1","#9dc08b","#c98ba0","#a08bc9","#c9b58b","#8bc9c5"];
  const color = DEST_COLORS[index % DEST_COLORS.length];

  return (
    <div className={`trip-card ${expanded ? "trip-card--expanded" : ""}`} style={{ "--accent": color }}>
      <div className="trip-card-header" onClick={onToggle}>
        <div className="trip-card-left">
          <div className="trip-initial" style={{ background: color }}>
            {trip.destination[0].toUpperCase()}
          </div>
          <div className="trip-meta">
            <h3 className="trip-destination">
              {trip.destination}
              {trip.aiGenerated && <span className="ai-badge">AI</span>}
            </h3>
            <p className="trip-duration">
              {trip.days} {trip.days == 1 ? "day" : "days"}
              {trip.itinerary?.length > 0 && (
                <span className="trip-days-count"> · {trip.itinerary.length} days planned</span>
              )}
            </p>
          </div>
        </div>
        <div className="trip-card-right">
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Edit">✏️</button>
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete">🗑️</button>
          <span className={`expand-icon ${expanded ? "expanded" : ""}`}>▾</span>
        </div>
      </div>

      {expanded && (
        <div className="itinerary-body">
          {/* AI Generator button always visible when expanded */}
          <AIGenerator trip={trip} onItineraryGenerated={onItineraryGenerated} />

          {trip.itinerary?.length > 0 && (
            <div className="itinerary-timeline">
              {trip.itinerary.map((day, i) => (
                <div className="timeline-day" key={day.day}>
                  <div className="timeline-marker">
                    <div className="marker-dot" style={{ background: color }} />
                    {i < trip.itinerary.length - 1 && <div className="marker-line" />}
                  </div>
                  <div className="timeline-content">
                    <div className="day-label">Day {day.day}</div>
                    <ul className="activities-list">
                      {day.activities.map((act, j) => (
                        <li key={j} className="activity-item">
                          <span className="activity-bullet">◆</span>
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;