import React, { useState } from "react";
import { useFlightContext } from "../contexts/FlightContext";
import {
  Search,
  Filter,
  Plane,
  MapPin,
  Activity,
  TrendingUp,
} from "lucide-react";

export const FlightsListPage: React.FC = () => {
  const { flights, loading, lastUpdate } = useFlightContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "callsign" | "country" | "altitude" | "speed"
  >("callsign");
  const [filterCountry, setFilterCountry] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aero-light mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">
            Loading flights list...
          </h2>
        </div>
      </div>
    );
  }

  const countries = Array.from(
    new Set(flights.map((f) => f.originCountry).filter(Boolean))
  ).sort();

  const filteredFlights = flights
    .filter((flight) => {
      const matchesSearch =
        !searchTerm ||
        flight.callsign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.icao24.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        !filterCountry || flight.originCountry === filterCountry;

      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "callsign":
          return (a.callsign || "").localeCompare(b.callsign || "");
        case "country":
          return (a.originCountry || "").localeCompare(b.originCountry || "");
        case "altitude":
          return (b.altitude || 0) - (a.altitude || 0);
        case "speed":
          return (b.velocity || 0) - (a.velocity || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Plane className="h-10 w-10 text-aero-light" />
            Flights List
          </h1>
          <p className="text-lg text-aero-light">
            Detailed aircraft information
          </p>
          <p className="text-sm mt-2 text-aero-light">
            Last updated: {lastUpdate.toLocaleTimeString()} |{" "}
            {filteredFlights.length} of {flights.length} aircraft
          </p>
        </div>

        {/* Filters */}
        <div className="aero-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aero-gray-light" />
              <input
                type="text"
                placeholder="Search by callsign or ICAO24..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-aero-gray-darker border border-aero-gray-dark rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aero-blue"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aero-gray-light" />
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-aero-gray-darker border border-aero-gray-dark rounded-lg text-white focus:outline-none focus:border-aero-blue"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 bg-aero-gray-darker border border-aero-gray-dark rounded-lg text-white focus:outline-none focus:border-aero-blue"
              >
                <option value="callsign">Sort by Callsign</option>
                <option value="country">Sort by Country</option>
                <option value="altitude">Sort by Altitude</option>
                <option value="speed">Sort by Speed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flights Table */}
        <div className="aero-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-aero-gray-dark">
                  <th className="text-left py-3 px-4 text-white font-semibold">
                    Callsign
                  </th>
                  <th className="text-left py-3 px-4 text-white font-semibold">
                    ICAO24
                  </th>
                  <th className="text-left py-3 px-4 text-white font-semibold">
                    Country
                  </th>
                  <th className="text-left py-3 px-4 text-white font-semibold">
                    Altitude
                  </th>
                  <th className="text-left py-3 px-4 text-white font-semibold">
                    Speed
                  </th>
                  <th className="text-left py-3 px-4 text-white font-semibold">
                    Heading
                  </th>
                  <th className="text-left py-3 px-4 text-white font-semibold">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map((flight, index) => (
                  <tr
                    key={flight.icao24}
                    className={`border-b border-aero-gray-dark ${
                      index % 2 === 0 ? "bg-aero-gray-darker/50" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-aero-blue" />
                        {flight.callsign || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-aero-gray-light font-mono text-sm">
                      {flight.icao24}
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-aero-green" />
                        {flight.originCountry || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-aero-purple" />
                        {flight.altitude
                          ? `${flight.altitude.toLocaleString()} ft`
                          : "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-aero-yellow" />
                        {flight.velocity
                          ? `${flight.velocity.toFixed(0)} km/h`
                          : "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-aero-gray-light">
                      {flight.trueTrack ? `${flight.trueTrack}°` : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-aero-gray-light">
                      {flight.latitude && flight.longitude ? (
                        <span className="font-mono text-sm">
                          {flight.latitude.toFixed(4)},{" "}
                          {flight.longitude.toFixed(4)}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFlights.length === 0 && (
            <div className="text-center py-8">
              <p className="text-aero-gray-light">
                No flights found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
