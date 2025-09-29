import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FlightProvider } from "./contexts/FlightContext";
import { Navigation } from "./components/Navigation";
import { DashboardPage } from "./pages/DashboardPage";
import { MapPage } from "./pages/MapPage";
import { FlightsListPage } from "./pages/FlightsListPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <FlightProvider>
      <Router basename="/aero-app">
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/flights" element={<FlightsListPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </FlightProvider>
  );
}

export default App;
