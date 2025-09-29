import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FlightProvider } from "./contexts/FlightContext";
import { Navigation } from "./components/Navigation";
import { DashboardPage } from "./pages/DashboardPage";
import { MapPage } from "./pages/MapPage";
import { FlightsListPage } from "./pages/FlightsListPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ErrorBoundary } from "./presentation/components/ErrorBoundary";
import { NetworkStatus } from "./presentation/components/ErrorComponents";
import { useState, useEffect } from "react";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastError, setLastError] = useState<unknown>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleError = (event: ErrorEvent) => {
      setLastError(event.error);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <FlightProvider>
        <Router basename={import.meta.env.PROD ? "/aero-app" : ""}>
          <div className="min-h-screen">
            <NetworkStatus isOnline={isOnline} lastError={lastError} />
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
    </ErrorBoundary>
  );
}

export default App;
