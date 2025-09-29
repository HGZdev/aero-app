// Presentation Layer - React Context using DDD
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { appContainer } from "../../infrastructure/factory/container-factory";
import {
  FlightMapper,
  StatisticsMapper,
} from "../../application/dtos/flight-dtos";
import type {
  FlightDTO,
  FlightStatisticsDTO,
} from "../../application/dtos/flight-dtos";
import { ErrorHandler, errorLogger } from "../../domain/shared/errors";
import { useRetry } from "../components/ErrorComponents";

interface FlightContextType {
  flights: FlightDTO[];
  statistics: FlightStatisticsDTO | null;
  loading: boolean;
  lastUpdate: Date;
  error: unknown | null;
  refreshData: () => Promise<void>;
  getFlightById: (icao24: string) => FlightDTO | undefined;
  getFlightsByCountry: (country: string) => FlightDTO[];
  retryCount: number;
  canRetry: boolean;
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
  const [flights, setFlights] = useState<FlightDTO[]>([]);
  const [statistics, setStatistics] = useState<FlightStatisticsDTO | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<unknown | null>(null);

  const { retryCount, canRetry, resetRetry } = useRetry(3);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const useCase = forceRefresh
        ? appContainer.refreshFlightData()
        : appContainer.getFlightData();

      const result = await useCase.execute();

      if (result.isFailure()) {
        throw result.error;
      }

      const flightDTOs = result.value.map(FlightMapper.toDTO);
      setFlights(flightDTOs);
      setLastUpdate(new Date());

      // Fetch statistics
      const statsResult = await appContainer.getFlightStatistics().execute();
      if (statsResult.isSuccess()) {
        setStatistics(StatisticsMapper.toDTO(statsResult.value));
      }

      // Reset retry count on success
      resetRetry();
    } catch (err) {
      errorLogger.logError(err, {
        component: "FlightProvider",
        method: "fetchData",
        forceRefresh,
      });

      const wrappedError = ErrorHandler.wrapError(err, {
        component: "FlightProvider",
        method: "fetchData",
        forceRefresh,
      });

      setError(wrappedError);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData(true);
  };

  const getFlightById = (icao24: string): FlightDTO | undefined => {
    return flights.find((flight) => flight.icao24 === icao24);
  };

  const getFlightsByCountry = (country: string): FlightDTO[] => {
    return flights.filter((flight) => flight.originCountry === country);
  };

  useEffect(() => {
    fetchData(); // First load - will use cache if available

    // Only set up interval if VITE_REFRESH_RUN is true
    const shouldAutoRefresh = import.meta.env.VITE_REFRESH_RUN === "true";

    if (shouldAutoRefresh) {
      const interval = setInterval(() => fetchData(), 300000); // Update every 5 minutes
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
    retryCount,
    canRetry,
    autoRefreshEnabled,
  };

  return (
    <FlightContext.Provider value={value}>{children}</FlightContext.Provider>
  );
};
