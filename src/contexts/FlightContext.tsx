import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { OpenSkyService } from "../services/OpenSkyService";
import type { FlightData } from "../types/FlightData";

interface FlightStats {
  totalFlights: number;
  avgAltitude: number;
  avgSpeed: number;
  maxAltitude: number;
  maxSpeed: number;
  countries: number;
  altitudeDistribution: Record<string, number>;
  countryDistribution: Record<string, number>;
  topCountries: Array<{ country: string; count: number }>;
  speedAltitudeData: Array<{ speed: number; altitude: number }>;
}

interface FlightContextType {
  flights: FlightData[];
  stats: FlightStats;
  loading: boolean;
  lastUpdate: Date;
  error: string | null;
  refreshData: () => Promise<void>;
  getFlightById: (icao24: string) => FlightData | undefined;
  getFlightsByCountry: (country: string) => FlightData[];
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
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const calculateStats = (flightData: FlightData[]): FlightStats => {
    // Altitude distribution
    const altitudeData = flightData.reduce((acc, flight) => {
      const range = Math.floor((flight.altitude || 0) / 1000) * 1000;
      const key = `${range}-${range + 999}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Country distribution
    const countryData = flightData.reduce((acc, flight) => {
      if (flight.originCountry) {
        acc[flight.originCountry] = (acc[flight.originCountry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    const speedAltitudeData = flightData
      .filter((f) => f.velocity && f.altitude)
      .map((f) => ({ speed: f.velocity!, altitude: f.altitude! }));

    const validFlights = flightData.filter((f) => f.altitude && f.velocity);
    const altitudes = validFlights.map((f) => f.altitude!).filter((a) => a > 0);
    const speeds = validFlights.map((f) => f.velocity!).filter((v) => v > 0);
    const countries = new Set(
      flightData.map((f) => f.originCountry).filter(Boolean)
    );

    return {
      totalFlights: flightData.length,
      avgAltitude:
        altitudes.length > 0
          ? altitudes.reduce((a, b) => a + b, 0) / altitudes.length
          : 0,
      avgSpeed:
        speeds.length > 0
          ? speeds.reduce((a, b) => a + b, 0) / speeds.length
          : 0,
      maxAltitude: altitudes.length > 0 ? Math.max(...altitudes) : 0,
      maxSpeed: speeds.length > 0 ? Math.max(...speeds) : 0,
      countries: countries.size,
      altitudeDistribution: altitudeData,
      countryDistribution: countryData,
      topCountries,
      speedAltitudeData,
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OpenSkyService.getAllFlights();
      setFlights(data);
      setLastUpdate(new Date());
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
    await fetchData();
  };

  const getFlightById = (icao24: string): FlightData | undefined => {
    return flights.find((flight) => flight.icao24 === icao24);
  };

  const getFlightsByCountry = (country: string): FlightData[] => {
    return flights.filter((flight) => flight.originCountry === country);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = calculateStats(flights);

  const value: FlightContextType = {
    flights,
    stats,
    loading,
    lastUpdate,
    error,
    refreshData,
    getFlightById,
    getFlightsByCountry,
  };

  return (
    <FlightContext.Provider value={value}>{children}</FlightContext.Provider>
  );
};
