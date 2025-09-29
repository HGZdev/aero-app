import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
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
import { Plane, MapPin, Activity, TrendingUp } from "lucide-react";
import { OpenSkyService } from "./services/OpenSkyService";
import type { FlightData } from "./types/FlightData";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const COLORS = [
  "var(--color-aero-blue)",
  "var(--color-aero-green)",
  "var(--color-aero-yellow)",
  "var(--color-aero-purple)",
  "var(--color-aero-light)",
];

function App() {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await OpenSkyService.getAllFlights();
        setFlights(data);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flight data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Prepare data for charts
  const altitudeData = flights.reduce((acc, flight) => {
    const range = Math.floor((flight.altitude || 0) / 1000) * 1000;
    const key = `${range}-${range + 999}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const altitudeChartData = Object.entries(altitudeData)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => parseInt(a.range) - parseInt(b.range));

  const countryData = flights.reduce((acc, flight) => {
    if (flight.originCountry) {
      acc[flight.originCountry] = (acc[flight.originCountry] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(countryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  const speedAltitudeData = flights
    .filter((f) => f.velocity && f.altitude)
    .map((f) => ({ speed: f.velocity!, altitude: f.altitude! }));

  const pieData = Object.entries(countryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([country, count]) => ({ name: country, value: count }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4"
            style={{ borderColor: "var(--color-aero-light)" }}
          ></div>
          <h2 className="text-white text-xl font-semibold">
            Loading flight data...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Plane
              className="h-10 w-10"
              style={{ color: "var(--color-aero-light)" }}
            />
            Aero Dashboard
          </h1>
          <p className="text-lg" style={{ color: "var(--color-aero-light)" }}>
            Live Flight Tracking & Analytics
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-aero-light)" }}
          >
            Last updated: {lastUpdate.toLocaleTimeString()} | {flights.length}{" "}
            aircraft in the air
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="aero-card text-center">
            <Plane
              className="h-8 w-8 mx-auto mb-2"
              style={{ color: "var(--color-aero-light)" }}
            />
            <h3 className="text-2xl font-bold text-white">{flights.length}</h3>
            <p style={{ color: "var(--color-aero-light)" }}>Aircraft Tracked</p>
          </div>
          <div className="aero-card text-center">
            <MapPin
              className="h-8 w-8 mx-auto mb-2"
              style={{ color: "var(--color-aero-green)" }}
            />
            <h3 className="text-2xl font-bold text-white">
              {Object.keys(countryData).length}
            </h3>
            <p style={{ color: "var(--color-aero-light)" }}>Countries</p>
          </div>
          <div className="aero-card text-center">
            <Activity
              className="h-8 w-8 mx-auto mb-2"
              style={{ color: "var(--color-aero-yellow)" }}
            />
            <h3 className="text-2xl font-bold text-white">
              {Math.round(
                flights.reduce((sum, f) => sum + (f.velocity || 0), 0) /
                  flights.length
              )}{" "}
              km/h
            </h3>
            <p style={{ color: "var(--color-aero-light)" }}>Avg Speed</p>
          </div>
          <div className="aero-card text-center">
            <TrendingUp
              className="h-8 w-8 mx-auto mb-2"
              style={{ color: "var(--color-aero-purple)" }}
            />
            <h3 className="text-2xl font-bold text-white">
              {Math.round(
                flights.reduce((sum, f) => sum + (f.altitude || 0), 0) /
                  flights.length /
                  1000
              )}{" "}
              km
            </h3>
            <p style={{ color: "var(--color-aero-light)" }}>Avg Altitude</p>
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
                <Bar dataKey="count" fill="var(--color-aero-blue)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Countries */}
          <div className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Top Countries by Aircraft Count
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCountries} layout="horizontal">
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
                <Bar dataKey="count" fill="var(--color-aero-green)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Speed vs Altitude */}
          <div className="chart-container">
            <h3 className="text-xl font-semibold text-white mb-4">
              Speed vs Altitude
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={speedAltitudeData}>
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
                <Scatter dataKey="altitude" fill="var(--color-aero-yellow)" />
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

        {/* Live Map */}
        <div className="chart-container">
          <h3 className="text-xl font-semibold text-white mb-4">
            Live Flight Map
          </h3>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[50, 10]}
              zoom={4}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {flights
                .filter((flight) => flight.latitude && flight.longitude)
                .map((flight, index) => (
                  <CircleMarker
                    key={`${flight.icao24}-${index}`}
                    center={[flight.latitude!, flight.longitude!]}
                    radius={3}
                    fillColor="var(--color-aero-blue)"
                    color="var(--color-aero-dark)"
                    weight={1}
                    opacity={0.8}
                    fillOpacity={0.6}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p>
                          <strong>Callsign:</strong> {flight.callsign || "N/A"}
                        </p>
                        <p>
                          <strong>Country:</strong>{" "}
                          {flight.originCountry || "N/A"}
                        </p>
                        <p>
                          <strong>Altitude:</strong>{" "}
                          {flight.altitude?.toLocaleString()} ft
                        </p>
                        <p>
                          <strong>Speed:</strong> {flight.velocity?.toFixed(0)}{" "}
                          km/h
                        </p>
                        <p>
                          <strong>Heading:</strong> {flight.trueTrack || "N/A"}°
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
