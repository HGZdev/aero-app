import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useFlightContext } from "../contexts/FlightContext";
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

export const MapPage: React.FC = () => {
  const { flights, loading, lastUpdate } = useFlightContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aero-light mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">
            Loading flight map...
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
          <h1 className="text-4xl font-bold text-white mb-2">
            Live Flight Map
          </h1>
          <p className="text-lg text-aero-light">
            Real-time aircraft positions
          </p>
          <p className="text-sm mt-2 text-aero-light">
            Last updated: {lastUpdate.toLocaleTimeString()} | {flights.length}{" "}
            aircraft visible
          </p>
        </div>

        {/* Map */}
        <div className="chart-container">
          <div className="h-[80vh] rounded-lg overflow-hidden">
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
                    fillColor="#3B82F6"
                    color="#1E40AF"
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
};
