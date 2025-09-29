import React from "react";
import { useFlightContext } from "../contexts/SimplifiedFlightContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import { Plane, MapPin, Activity, TrendingUp, RefreshCw } from "lucide-react";

const COLORS = [
  "var(--color-aero-blue)",
  "var(--color-aero-green)",
  "var(--color-aero-yellow)",
  "var(--color-aero-purple)",
  "var(--color-aero-light)",
];

export const DashboardPage: React.FC = () => {
  const {
    statistics,
    loading,
    lastUpdate,
    error,
    refreshData,
    autoRefreshEnabled,
  } = useFlightContext();
  const [isFromCache, setIsFromCache] = React.useState(false);
  const [isFromMock, setIsFromMock] = React.useState(false);

  // Check if data is from cache or mock by looking at console logs
  React.useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
      if (args[0]?.includes?.("Using cached")) {
        setIsFromCache(true);
        setIsFromMock(false);
      } else if (args[0]?.includes?.("Fetching fresh")) {
        setIsFromCache(false);
        setIsFromMock(false);
      } else if (args[0]?.includes?.("Using mock data")) {
        setIsFromMock(true);
        setIsFromCache(false);
      } else if (args[0]?.includes?.("Successfully fetched data from API")) {
        setIsFromMock(false);
        setIsFromCache(false);
      }
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aero-light mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">
            Loading flight data...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-400 text-xl font-semibold mb-4">
            Error loading data
          </h2>
          <p className="text-aero-gray-light">{String(error)}</p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-aero-gray-light text-xl font-semibold">
            No statistics available
          </h2>
        </div>
      </div>
    );
  }

  const altitudeChartData = Object.entries(statistics.altitudeDistribution)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => parseInt(a.range) - parseInt(b.range));

  const pieData = Object.entries(statistics.countryDistribution)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([country, count]) => ({ name: country, value: count }));

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Plane className="h-10 w-10 text-aero-light" />
            Aero Dashboard
          </h1>
          <p className="text-lg text-aero-light">
            Live Flight Tracking & Analytics
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <p className="text-sm text-aero-light">
              Last updated: {lastUpdate.toLocaleTimeString()} |{" "}
              {statistics.totalFlights} aircraft in the air
              {isFromCache && (
                <span className="ml-2 px-2 py-1 bg-aero-yellow text-white rounded text-xs">
                  📦 Cached
                </span>
              )}
              {isFromMock && (
                <span className="ml-2 px-2 py-1 bg-aero-purple text-white rounded text-xs">
                  🎭 Mock Data
                </span>
              )}
              {autoRefreshEnabled && (
                <span className="ml-2 px-2 py-1 bg-aero-green text-white rounded text-xs">
                  🔄 Auto-refresh
                </span>
              )}
            </p>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1 bg-aero-blue hover:bg-aero-dark disabled:bg-aero-gray-dark text-white rounded-lg transition-colors text-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="aero-card text-center">
            <Plane className="h-8 w-8 mx-auto mb-2 text-aero-light" />
            <h3 className="text-2xl font-bold text-white">
              {statistics.totalFlights}
            </h3>
            <p className="text-aero-light">Aircraft Tracked</p>
          </div>
          <div className="aero-card text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-aero-green" />
            <h3 className="text-2xl font-bold text-white">
              {statistics.countriesCount}
            </h3>
            <p className="text-aero-light">Countries</p>
          </div>
          <div className="aero-card text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-aero-yellow" />
            <h3 className="text-2xl font-bold text-white">
              {Math.round(statistics.avgSpeed)} km/h
            </h3>
            <p className="text-aero-light">Avg Speed</p>
          </div>
          <div className="aero-card text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-aero-purple" />
            <h3 className="text-2xl font-bold text-white">
              {Math.round(statistics.avgAltitude / 1000)} km
            </h3>
            <p className="text-aero-light">Avg Altitude</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Altitude Distribution */}
          <div className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Altitude Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={altitudeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" />
                <XAxis dataKey="range" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Countries */}
          <div className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Top Countries by Aircraft Count
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.topCountries} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" />
                <XAxis type="number" stroke="#FFFFFF" />
                <YAxis
                  dataKey="country"
                  type="category"
                  stroke="#FFFFFF"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Speed vs Altitude */}
          <div className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Speed vs Altitude
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={statistics.speedAltitudeCorrelation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" />
                <XAxis dataKey="speed" name="Speed" stroke="#FFFFFF" />
                <YAxis dataKey="altitude" name="Altitude" stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Scatter dataKey="altitude" fill="#F59E0B" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Country Distribution Pie */}
          <div className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Country Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
