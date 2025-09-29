// Mock Flight Data for Development and Testing
import type { FlightEntity } from "../../../domain/flight/entities";

export const mockFlights: FlightEntity[] = [
  {
    icao24: "4ca2c3",
    callsign: "RYR123",
    originCountry: "Ireland",
    position: {
      latitude: 52.3702,
      longitude: 4.8952,
    },
    altitude: {
      value: 35000,
      unit: "feet",
    },
    velocity: {
      value: 850,
      unit: "km/h",
    },
    heading: {
      value: 45,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:30:00Z"),
  },
  {
    icao24: "4ca2c4",
    callsign: "BAW456",
    originCountry: "United Kingdom",
    position: {
      latitude: 51.5074,
      longitude: -0.1278,
    },
    altitude: {
      value: 28000,
      unit: "feet",
    },
    velocity: {
      value: 920,
      unit: "km/h",
    },
    heading: {
      value: 120,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:31:00Z"),
  },
  {
    icao24: "4ca2c5",
    callsign: "AFR789",
    originCountry: "France",
    position: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    altitude: {
      value: 41000,
      unit: "feet",
    },
    velocity: {
      value: 780,
      unit: "km/h",
    },
    heading: {
      value: 200,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:32:00Z"),
  },
  {
    icao24: "4ca2c6",
    callsign: "DLH012",
    originCountry: "Germany",
    position: {
      latitude: 52.52,
      longitude: 13.405,
    },
    altitude: {
      value: 32000,
      unit: "feet",
    },
    velocity: {
      value: 890,
      unit: "km/h",
    },
    heading: {
      value: 90,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:33:00Z"),
  },
  {
    icao24: "4ca2c7",
    callsign: "KLM345",
    originCountry: "Netherlands",
    position: {
      latitude: 52.3105,
      longitude: 4.7683,
    },
    altitude: {
      value: 25000,
      unit: "feet",
    },
    velocity: {
      value: 750,
      unit: "km/h",
    },
    heading: {
      value: 300,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:34:00Z"),
  },
  {
    icao24: "4ca2c8",
    callsign: "SAS678",
    originCountry: "Sweden",
    position: {
      latitude: 59.3293,
      longitude: 18.0686,
    },
    altitude: {
      value: 38000,
      unit: "feet",
    },
    velocity: {
      value: 820,
      unit: "km/h",
    },
    heading: {
      value: 15,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:35:00Z"),
  },
  {
    icao24: "4ca2c9",
    callsign: "SWR901",
    originCountry: "Switzerland",
    position: {
      latitude: 47.3769,
      longitude: 8.5417,
    },
    altitude: {
      value: 29000,
      unit: "feet",
    },
    velocity: {
      value: 760,
      unit: "km/h",
    },
    heading: {
      value: 180,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:36:00Z"),
  },
  {
    icao24: "4ca2ca",
    callsign: "AFL234",
    originCountry: "Russia",
    position: {
      latitude: 55.7558,
      longitude: 37.6176,
    },
    altitude: {
      value: 36000,
      unit: "feet",
    },
    velocity: {
      value: 880,
      unit: "km/h",
    },
    heading: {
      value: 270,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:37:00Z"),
  },
  {
    icao24: "4ca2cb",
    callsign: "UAL567",
    originCountry: "United States",
    position: {
      latitude: 40.7128,
      longitude: -74.006,
    },
    altitude: {
      value: 33000,
      unit: "feet",
    },
    velocity: {
      value: 900,
      unit: "km/h",
    },
    heading: {
      value: 60,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:38:00Z"),
  },
  {
    icao24: "4ca2cc",
    callsign: "ACA890",
    originCountry: "Canada",
    position: {
      latitude: 43.6532,
      longitude: -79.3832,
    },
    altitude: {
      value: 27000,
      unit: "feet",
    },
    velocity: {
      value: 740,
      unit: "km/h",
    },
    heading: {
      value: 330,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:39:00Z"),
  },
  {
    icao24: "4ca2cd",
    callsign: "JAL123",
    originCountry: "Japan",
    position: {
      latitude: 35.6762,
      longitude: 139.6503,
    },
    altitude: {
      value: 39000,
      unit: "feet",
    },
    velocity: {
      value: 860,
      unit: "km/h",
    },
    heading: {
      value: 150,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:40:00Z"),
  },
  {
    icao24: "4ca2ce",
    callsign: "QFA456",
    originCountry: "Australia",
    position: {
      latitude: -33.8688,
      longitude: 151.2093,
    },
    altitude: {
      value: 31000,
      unit: "feet",
    },
    velocity: {
      value: 800,
      unit: "km/h",
    },
    heading: {
      value: 240,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:41:00Z"),
  },
  {
    icao24: "4ca2cf",
    callsign: "SIA789",
    originCountry: "Singapore",
    position: {
      latitude: 1.3521,
      longitude: 103.8198,
    },
    altitude: {
      value: 34000,
      unit: "feet",
    },
    velocity: {
      value: 870,
      unit: "km/h",
    },
    heading: {
      value: 30,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:42:00Z"),
  },
  {
    icao24: "4ca2d0",
    callsign: "THA012",
    originCountry: "Thailand",
    position: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
    altitude: {
      value: 26000,
      unit: "feet",
    },
    velocity: {
      value: 720,
      unit: "km/h",
    },
    heading: {
      value: 210,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:43:00Z"),
  },
  {
    icao24: "4ca2d1",
    callsign: "ANA345",
    originCountry: "Japan",
    position: {
      latitude: 35.6895,
      longitude: 139.6917,
    },
    altitude: {
      value: 37000,
      unit: "feet",
    },
    velocity: {
      value: 840,
      unit: "km/h",
    },
    heading: {
      value: 75,
      unit: "degrees",
    },
    onGround: false,
    lastContact: new Date("2024-01-15T10:44:00Z"),
  },
];

// Additional mock data for different scenarios
export const mockFlightsEurope: FlightEntity[] = mockFlights.filter(
  (flight) =>
    flight.originCountry &&
    [
      "Ireland",
      "United Kingdom",
      "France",
      "Germany",
      "Netherlands",
      "Sweden",
      "Switzerland",
    ].includes(flight.originCountry)
);

export const mockFlightsAsia: FlightEntity[] = mockFlights.filter(
  (flight) =>
    flight.originCountry &&
    ["Japan", "Singapore", "Thailand"].includes(flight.originCountry)
);

export const mockFlightsHighAltitude: FlightEntity[] = mockFlights.filter(
  (flight) => flight.altitude && flight.altitude.value > 35000
);

export const mockFlightsLowAltitude: FlightEntity[] = mockFlights.filter(
  (flight) => flight.altitude && flight.altitude.value < 30000
);

// Busy airspace scenario - many flights in a small area
export const mockFlightsBusy: FlightEntity[] = [
  {
    icao24: "busy001",
    callsign: "BAW001",
    originCountry: "United Kingdom",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 35000, unit: "feet" },
    velocity: { value: 850, unit: "km/h" },
    heading: { value: 90, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "busy002",
    callsign: "AFR002",
    originCountry: "France",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 36000, unit: "feet" },
    velocity: { value: 870, unit: "km/h" },
    heading: { value: 95, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "busy003",
    callsign: "DLH003",
    originCountry: "Germany",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 37000, unit: "feet" },
    velocity: { value: 890, unit: "km/h" },
    heading: { value: 100, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "busy004",
    callsign: "KLM004",
    originCountry: "Netherlands",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 34000, unit: "feet" },
    velocity: { value: 830, unit: "km/h" },
    heading: { value: 85, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "busy005",
    callsign: "SAS005",
    originCountry: "Sweden",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 38000, unit: "feet" },
    velocity: { value: 910, unit: "km/h" },
    heading: { value: 105, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "busy006",
    callsign: "SWR006",
    originCountry: "Switzerland",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 33000, unit: "feet" },
    velocity: { value: 810, unit: "km/h" },
    heading: { value: 80, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "busy007",
    callsign: "RYR007",
    originCountry: "Ireland",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 39000, unit: "feet" },
    velocity: { value: 930, unit: "km/h" },
    heading: { value: 110, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "busy008",
    callsign: "EZY008",
    originCountry: "United Kingdom",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 32000, unit: "feet" },
    velocity: { value: 790, unit: "km/h" },
    heading: { value: 75, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
];

// Empty airspace scenario - no flights
export const mockFlightsEmpty: FlightEntity[] = [];

// Mixed scenario - combination of different altitudes and speeds
export const mockFlightsMixed: FlightEntity[] = [
  // High altitude long-haul flights
  {
    icao24: "mixed001",
    callsign: "BAW001",
    originCountry: "United Kingdom",
    position: { latitude: 51.5074, longitude: -0.1278 },
    altitude: { value: 41000, unit: "feet" },
    velocity: { value: 920, unit: "km/h" },
    heading: { value: 90, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "mixed002",
    callsign: "UAL002",
    originCountry: "United States",
    position: { latitude: 40.7128, longitude: -74.006 },
    altitude: { value: 40000, unit: "feet" },
    velocity: { value: 900, unit: "km/h" },
    heading: { value: 270, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  // Medium altitude regional flights
  {
    icao24: "mixed003",
    callsign: "AFR003",
    originCountry: "France",
    position: { latitude: 48.8566, longitude: 2.3522 },
    altitude: { value: 32000, unit: "feet" },
    velocity: { value: 780, unit: "km/h" },
    heading: { value: 180, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "mixed004",
    callsign: "DLH004",
    originCountry: "Germany",
    position: { latitude: 52.52, longitude: 13.405 },
    altitude: { value: 30000, unit: "feet" },
    velocity: { value: 750, unit: "km/h" },
    heading: { value: 45, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  // Low altitude short flights
  {
    icao24: "mixed005",
    callsign: "KLM005",
    originCountry: "Netherlands",
    position: { latitude: 52.3105, longitude: 4.7683 },
    altitude: { value: 25000, unit: "feet" },
    velocity: { value: 650, unit: "km/h" },
    heading: { value: 300, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  {
    icao24: "mixed006",
    callsign: "SAS006",
    originCountry: "Sweden",
    position: { latitude: 59.3293, longitude: 18.0686 },
    altitude: { value: 22000, unit: "feet" },
    velocity: { value: 600, unit: "km/h" },
    heading: { value: 15, unit: "degrees" },
    onGround: false,
    lastContact: new Date(),
  },
  // Ground operations
  {
    icao24: "mixed007",
    callsign: "SWR007",
    originCountry: "Switzerland",
    position: { latitude: 47.3769, longitude: 8.5417 },
    altitude: { value: 0, unit: "feet" },
    velocity: { value: 0, unit: "km/h" },
    heading: { value: 0, unit: "degrees" },
    onGround: true,
    lastContact: new Date(),
  },
  {
    icao24: "mixed008",
    callsign: "RYR008",
    originCountry: "Ireland",
    position: { latitude: 52.3702, longitude: 4.8952 },
    altitude: { value: 0, unit: "feet" },
    velocity: { value: 0, unit: "km/h" },
    heading: { value: 0, unit: "degrees" },
    onGround: true,
    lastContact: new Date(),
  },
];

// Mock statistics for testing
export const mockFlightStatistics = {
  totalFlights: mockFlights.length,
  averageAltitude: 32000,
  averageSpeed: 820,
  maxAltitude: 41000,
  maxSpeed: 920,
  countriesCount: 12,
  altitudeDistribution: {
    ranges: [
      { min: 0, max: 999, count: 0, label: "0-999 ft" },
      { min: 1000, max: 2999, count: 0, label: "1,000-2,999 ft" },
      { min: 3000, max: 9999, count: 0, label: "3,000-9,999 ft" },
      { min: 10000, max: 19999, count: 0, label: "10,000-19,999 ft" },
      { min: 20000, max: 29999, count: 4, label: "20,000-29,999 ft" },
      { min: 30000, max: 39999, count: 6, label: "30,000-39,999 ft" },
      { min: 40000, max: 49999, count: 1, label: "40,000-49,999 ft" },
      { min: 50000, max: 999999, count: 0, label: "50,000+ ft" },
    ],
  },
  countryDistribution: {
    countries: [
      { country: "Japan", count: 2, percentage: 13.33 },
      { country: "Ireland", count: 1, percentage: 6.67 },
      { country: "United Kingdom", count: 1, percentage: 6.67 },
      { country: "France", count: 1, percentage: 6.67 },
      { country: "Germany", count: 1, percentage: 6.67 },
      { country: "Netherlands", count: 1, percentage: 6.67 },
      { country: "Sweden", count: 1, percentage: 6.67 },
      { country: "Switzerland", count: 1, percentage: 6.67 },
      { country: "Russia", count: 1, percentage: 6.67 },
      { country: "United States", count: 1, percentage: 6.67 },
      { country: "Canada", count: 1, percentage: 6.67 },
      { country: "Australia", count: 1, percentage: 6.67 },
      { country: "Singapore", count: 1, percentage: 6.67 },
      { country: "Thailand", count: 1, percentage: 6.67 },
    ],
  },
  topCountries: [
    { country: "Japan", count: 2, rank: 1 },
    { country: "Ireland", count: 1, rank: 2 },
    { country: "United Kingdom", count: 1, rank: 3 },
    { country: "France", count: 1, rank: 4 },
    { country: "Germany", count: 1, rank: 5 },
  ],
  speedAltitudeCorrelation: mockFlights
    .filter((f) => f.velocity && f.altitude)
    .map((f) => ({
      speed: f.velocity!.value,
      altitude: f.altitude!.value,
      flightId: f.icao24,
    })),
};
