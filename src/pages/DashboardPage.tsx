import React from "react";
import { useFlightContext } from "../contexts/FlightContext";
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

  // Show loading overlay instead of replacing entire content
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aero-light mx-auto mb-4"></div>
        <h2 className="text-white text-xl font-semibold">
          Loading flight data...
        </h2>
      </div>
    </div>
  );

  // Show error banner instead of replacing entire content
  const ErrorBanner = () => (
    <div className="bg-red-600 text-white text-center py-2 mb-4">
      <p>Error loading data: {String(error)}</p>
    </div>
  );

  const altitudeChartData = statistics
    ? Object.entries(statistics.altitudeDistribution)
        .map(([range, count]) => ({ range, count }))
        .sort((a, b) => parseInt(a.range) - parseInt(b.range))
    : [];

  const pieData = statistics
    ? Object.entries(statistics.countryDistribution)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([country, count]) => ({ name: country, value: count }))
    : [];

  return (
    <div data-testid="dashboard-page" className="min-h-screen">
      {loading && <LoadingOverlay />}
      {error && <ErrorBanner />}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            data-testid="dashboard-title"
            className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3"
          >
            <Plane className="h-10 w-10 text-aero-light" />
            Aero Dashboard
          </h1>
          <p
            data-testid="dashboard-subtitle"
            className="text-lg text-aero-light"
          >
            Live Flight Tracking & Analytics
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <p data-testid="dashboard-info" className="text-sm text-aero-light">
              Last updated: {lastUpdate.toLocaleTimeString()} |{" "}
              {statistics?.totalFlights || 0} aircraft in the air
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
              data-testid="refresh-button"
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
        <div
          data-testid="stats-cards"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div
            data-testid="stat-aircraft-tracked"
            className="aero-card text-center"
          >
            <Plane className="h-8 w-8 mx-auto mb-2 text-aero-light" />
            <h3
              data-testid="stat-aircraft-count"
              className="text-2xl font-bold text-white"
            >
              {statistics?.totalFlights || 0}
            </h3>
            <p className="text-aero-light">Aircraft Tracked</p>
          </div>
          <div data-testid="stat-countries" className="aero-card text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-aero-green" />
            <h3
              data-testid="stat-countries-count"
              className="text-2xl font-bold text-white"
            >
              {statistics?.countriesCount || 0}
            </h3>
            <p className="text-aero-light">Countries</p>
          </div>
          <div data-testid="stat-avg-speed" className="aero-card text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-aero-yellow" />
            <h3
              data-testid="stat-speed-value"
              className="text-2xl font-bold text-white"
            >
              {statistics ? Math.round(statistics.avgSpeed) : 0} km/h
            </h3>
            <p className="text-aero-light">Avg Speed</p>
          </div>
          <div
            data-testid="stat-avg-altitude"
            className="aero-card text-center"
          >
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-aero-purple" />
            <h3
              data-testid="stat-altitude-value"
              className="text-2xl font-bold text-white"
            >
              {statistics ? Math.round(statistics.avgAltitude / 1000) : 0} km
            </h3>
            <p className="text-aero-light">Avg Altitude</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div
          data-testid="charts-grid"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Altitude Distribution */}
          <div
            data-testid="chart-altitude-distribution"
            className="chart-container"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Altitude Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={altitudeChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-aero-gray)"
                />
                <XAxis dataKey="range" stroke="var(--color-white)" />
                <YAxis stroke="var(--color-white)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-aero-gray-dark)",
                    border: "1px solid var(--color-aero-gray-dark)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="count" fill="var(--color-aero-blue)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Countries */}
          <div data-testid="chart-top-countries" className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Top Countries by Aircraft Count
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={statistics?.topCountries || []}
                layout="horizontal"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-aero-gray)"
                />
                <XAxis type="number" stroke="var(--color-white)" />
                <YAxis
                  dataKey="country"
                  type="category"
                  stroke="var(--color-white)"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-aero-gray-dark)",
                    border: "1px solid var(--color-aero-gray-dark)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="count" fill="var(--color-aero-green)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Speed vs Altitude */}
          <div data-testid="chart-speed-altitude" className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Speed vs Altitude
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={statistics?.speedAltitudeCorrelation || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-aero-gray)"
                />
                <XAxis
                  dataKey="speed"
                  name="Speed"
                  stroke="var(--color-white)"
                />
                <YAxis
                  dataKey="altitude"
                  name="Altitude"
                  stroke="var(--color-white)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-aero-gray-dark)",
                    border: "1px solid var(--color-aero-gray-dark)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Scatter dataKey="altitude" fill="var(--color-aero-yellow)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Country Distribution Pie */}
          <div
            data-testid="chart-country-distribution"
            className="chart-container"
          >
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
                  fill="var(--color-aero-purple)"
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
                    backgroundColor: "var(--color-aero-gray-dark)",
                    border: "1px solid var(--color-aero-gray-dark)",
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
