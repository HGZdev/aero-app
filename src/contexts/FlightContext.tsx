// Simplified Flight Context - replaces complex DDD architecture
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  FlightService,
  type FlightStats,
  type FlightData,
} from "../services/FlightService";

interface FlightContextType {
  flights: FlightData[];
  statistics: FlightStats | null;
  loading: boolean;
  lastUpdate: Date;
  error: string | null;
  refreshData: () => Promise<void>;
  getFlightById: (icao24: string) => FlightData | undefined;
  getFlightsByCountry: (country: string) => FlightData[];
  autoRefreshEnabled: boolean;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error("useFlightContext must be used within a FlightProvider");
  }
  return context;
};

interface FlightProviderProps {
  children: ReactNode;
}

export const FlightProvider: React.FC<FlightProviderProps> = ({ children }) => {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [statistics, setStatistics] = useState<FlightStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await FlightService.getAllFlights(forceRefresh);
      setFlights(data);
      setLastUpdate(new Date());

      // Calculate statistics
      const stats = FlightService.calculateStats(data);
      setStatistics(stats);
    } catch (err) {
      console.error("Error fetching flight data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch flight data"
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData(true);
  };

  const getFlightById = (icao24: string): FlightData | undefined => {
    return flights.find((flight) => flight.icao24 === icao24);
  };

  const getFlightsByCountry = (country: string): FlightData[] => {
    return flights.filter((flight) => flight.originCountry === country);
  };

  useEffect(() => {
    // In test mode, don't fetch data to avoid API calls
    const isTestMode =
      import.meta.env.MODE === "test" ||
      (typeof window !== "undefined" &&
        window.location.hostname === "localhost" &&
        window.location.port === "5173");

    if (isTestMode) {
      console.log("🧪 Test mode: skipping data fetch");
      setLoading(false);
      return;
    }

    fetchData(); // First load - will use cache if available

    // Auto-refresh every 5 minutes if enabled
    const shouldAutoRefresh = import.meta.env.VITE_REFRESH_RUN === "true";
    if (shouldAutoRefresh) {
      const interval = setInterval(() => fetchData(), 300000);
      return () => clearInterval(interval);
    }
  }, []);

  const autoRefreshEnabled = import.meta.env.VITE_REFRESH_RUN === "true";

  const value: FlightContextType = {
    flights,
    statistics,
    loading,
    lastUpdate,
    error,
    refreshData,
    getFlightById,
    getFlightsByCountry,
    autoRefreshEnabled,
  };

  return (
    <FlightContext.Provider value={value}>{children}</FlightContext.Provider>
  );
};
