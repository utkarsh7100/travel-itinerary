import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddTrip from "./pages/AddTrip";

export default function App() {   // 👈 Make sure this line exists
  return (
    <BrowserRouter>
      <nav className="flex gap-4 p-4 bg-gray-100 shadow">
        <Link to="/">Home</Link>
        <Link to="/add">Add Trip</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTrip />} />
      </Routes>
    </BrowserRouter>
  );
}
