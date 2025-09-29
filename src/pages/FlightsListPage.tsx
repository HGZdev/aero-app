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
      <div
        className="min-h-screen flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="flights-loading-title"
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-2 border-aero-light mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <h2
            id="flights-loading-title"
            className="text-white text-xl font-semibold"
          >
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
    <div
      data-testid="flights-list-page"
      className="min-h-screen"
      role="main"
      aria-label="Flights list"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1
            data-testid="flights-title"
            className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3"
          >
            <Plane className="h-10 w-10 text-aero-light" aria-hidden="true" />
            Flights List
          </h1>
          <p data-testid="flights-subtitle" className="text-lg text-aero-light">
            Detailed aircraft information
          </p>
          <p
            data-testid="flights-info"
            className="text-sm mt-2 text-aero-light"
          >
            Last updated: {lastUpdate.toLocaleTimeString()} |{" "}
            {filteredFlights.length} of {flights.length} aircraft
          </p>
        </header>

        {/* Filters */}
        <section
          data-testid="filters-section"
          className="aero-card mb-8"
          aria-label="Flight filters"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aero-gray-light"
                aria-hidden="true"
              />
              <input
                data-testid="search-input"
                type="text"
                placeholder="Search by callsign or ICAO24..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-aero-gray-dark border border-aero-gray-dark rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aero-blue"
                aria-label="Search flights by callsign or ICAO24"
                aria-describedby="search-help"
              />
              <div id="search-help" className="sr-only">
                Enter aircraft callsign or ICAO24 code to filter the list
              </div>
            </div>

            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aero-gray-light"
                aria-hidden="true"
              />
              <select
                data-testid="country-filter"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-aero-gray-dark border border-aero-gray-dark rounded-lg text-white focus:outline-none focus:border-aero-blue"
                aria-label="Filter flights by country"
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
                data-testid="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 bg-aero-gray-dark border border-aero-gray-dark rounded-lg text-white focus:outline-none focus:border-aero-blue"
                aria-label="Sort flights by"
              >
                <option value="callsign">Sort by Callsign</option>
                <option value="country">Sort by Country</option>
                <option value="altitude">Sort by Altitude</option>
                <option value="speed">Sort by Speed</option>
              </select>
            </div>
          </div>
        </section>

        {/* Flights Table */}
        <section
          data-testid="flights-table"
          className="aero-card"
          aria-label="Flights data table"
        >
          <div className="overflow-x-auto">
            <table
              className="w-full"
              role="table"
              aria-label="Aircraft flights data"
            >
              <thead>
                <tr className="border-b border-aero-gray-dark" role="row">
                  <th
                    data-testid="th-callsign"
                    className="text-left py-3 px-4 text-white font-semibold"
                    scope="col"
                    role="columnheader"
                  >
                    Callsign
                  </th>
                  <th
                    data-testid="th-icao24"
                    className="text-left py-3 px-4 text-white font-semibold"
                    scope="col"
                    role="columnheader"
                  >
                    ICAO24
                  </th>
                  <th
                    data-testid="th-country"
                    className="text-left py-3 px-4 text-white font-semibold"
                    scope="col"
                    role="columnheader"
                  >
                    Country
                  </th>
                  <th
                    data-testid="th-altitude"
                    className="text-left py-3 px-4 text-white font-semibold"
                    scope="col"
                    role="columnheader"
                  >
                    Altitude
                  </th>
                  <th
                    data-testid="th-speed"
                    className="text-left py-3 px-4 text-white font-semibold"
                    scope="col"
                    role="columnheader"
                  >
                    Speed
                  </th>
                  <th
                    data-testid="th-heading"
                    className="text-left py-3 px-4 text-white font-semibold"
                    scope="col"
                    role="columnheader"
                  >
                    Heading
                  </th>
                  <th
                    data-testid="th-position"
                    className="text-left py-3 px-4 text-white font-semibold"
                    scope="col"
                    role="columnheader"
                  >
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map((flight, index) => (
                  <tr
                    key={flight.icao24}
                    className={`border-b border-aero-gray-dark ${
                      index % 2 === 0 ? "bg-aero-gray-dark/50" : ""
                    }`}
                    role="row"
                    aria-label={`Flight ${flight.callsign || flight.icao24}`}
                  >
                    <td className="py-3 px-4 text-white" role="gridcell">
                      <div className="flex items-center gap-2">
                        <Plane
                          className="h-4 w-4 text-aero-blue"
                          aria-hidden="true"
                        />
                        <span>{flight.callsign || "N/A"}</span>
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 text-aero-gray-light font-mono text-sm"
                      role="gridcell"
                    >
                      {flight.icao24}
                    </td>
                    <td className="py-3 px-4 text-white" role="gridcell">
                      <div className="flex items-center gap-2">
                        <MapPin
                          className="h-4 w-4 text-aero-green"
                          aria-hidden="true"
                        />
                        <span>{flight.originCountry || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white" role="gridcell">
                      <div className="flex items-center gap-2">
                        <TrendingUp
                          className="h-4 w-4 text-aero-purple"
                          aria-hidden="true"
                        />
                        <span>
                          {flight.altitude
                            ? `${flight.altitude.toLocaleString()} ft`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white" role="gridcell">
                      <div className="flex items-center gap-2">
                        <Activity
                          className="h-4 w-4 text-aero-yellow"
                          aria-hidden="true"
                        />
                        <span>
                          {flight.velocity
                            ? `${flight.velocity.toFixed(0)} km/h`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 text-aero-gray-light"
                      role="gridcell"
                    >
                      {flight.trueTrack ? `${flight.trueTrack}°` : "N/A"}
                    </td>
                    <td
                      className="py-3 px-4 text-aero-gray-light"
                      role="gridcell"
                    >
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
            <div className="text-center py-8" role="status" aria-live="polite">
              <p className="text-aero-gray-light">
                No flights found matching your criteria.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
