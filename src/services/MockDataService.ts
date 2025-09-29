// Mock Data Service - provides realistic flight data for development and fallback
import type { FlightData } from "./FlightService";

export class MockDataService {
  private static readonly MOCK_FLIGHTS: FlightData[] = [
    // European flights
    {
      icao24: "4ca1a1",
      callsign: "RYR123",
      originCountry: "Ireland",
      timePosition: Date.now() / 1000 - 300,
      lastContact: Date.now() / 1000 - 60,
      longitude: 2.3522,
      latitude: 48.8566,
      altitude: 35000,
      onGround: false,
      velocity: 850,
      trueTrack: 45,
      verticalRate: 0,
      sensors: [1, 2],
      geoAltitude: 35000,
      squawk: "1234",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1a2",
      callsign: "BAW456",
      originCountry: "United Kingdom",
      timePosition: Date.now() / 1000 - 180,
      lastContact: Date.now() / 1000 - 30,
      longitude: -0.1276,
      latitude: 51.5074,
      altitude: 28000,
      onGround: false,
      velocity: 720,
      trueTrack: 90,
      verticalRate: 500,
      sensors: [1],
      geoAltitude: 28000,
      squawk: "5678",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1a3",
      callsign: "AFR789",
      originCountry: "France",
      timePosition: Date.now() / 1000 - 120,
      lastContact: Date.now() / 1000 - 15,
      longitude: 4.8357,
      latitude: 45.764,
      altitude: 41000,
      onGround: false,
      velocity: 920,
      trueTrack: 180,
      verticalRate: -200,
      sensors: [1, 2, 3],
      geoAltitude: 41000,
      squawk: "9012",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1a4",
      callsign: "DLH234",
      originCountry: "Germany",
      timePosition: Date.now() / 1000 - 90,
      lastContact: Date.now() / 1000 - 10,
      longitude: 13.405,
      latitude: 52.52,
      altitude: 33000,
      onGround: false,
      velocity: 780,
      trueTrack: 270,
      verticalRate: 0,
      sensors: [1, 2],
      geoAltitude: 33000,
      squawk: "3456",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1a5",
      callsign: "KLM567",
      originCountry: "Netherlands",
      timePosition: Date.now() / 1000 - 60,
      lastContact: Date.now() / 1000 - 5,
      longitude: 4.9041,
      latitude: 52.3676,
      altitude: 25000,
      onGround: false,
      velocity: 650,
      trueTrack: 135,
      verticalRate: 300,
      sensors: [1],
      geoAltitude: 25000,
      squawk: "7890",
      spi: false,
      positionSource: 0,
    },
    // Asian flights
    {
      icao24: "4ca1a6",
      callsign: "ANA890",
      originCountry: "Japan",
      timePosition: Date.now() / 1000 - 240,
      lastContact: Date.now() / 1000 - 45,
      longitude: 139.6917,
      latitude: 35.6895,
      altitude: 38000,
      onGround: false,
      velocity: 880,
      trueTrack: 60,
      verticalRate: 0,
      sensors: [1, 2, 3],
      geoAltitude: 38000,
      squawk: "1234",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1a7",
      callsign: "SIA123",
      originCountry: "Singapore",
      timePosition: Date.now() / 1000 - 150,
      lastContact: Date.now() / 1000 - 20,
      longitude: 103.8198,
      latitude: 1.3521,
      altitude: 42000,
      onGround: false,
      velocity: 950,
      trueTrack: 120,
      verticalRate: -100,
      sensors: [1, 2],
      geoAltitude: 42000,
      squawk: "5678",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1a8",
      callsign: "KAL456",
      originCountry: "South Korea",
      timePosition: Date.now() / 1000 - 100,
      lastContact: Date.now() / 1000 - 12,
      longitude: 126.978,
      latitude: 37.5665,
      altitude: 36000,
      onGround: false,
      velocity: 820,
      trueTrack: 200,
      verticalRate: 150,
      sensors: [1],
      geoAltitude: 36000,
      squawk: "9012",
      spi: false,
      positionSource: 0,
    },
    // North American flights
    {
      icao24: "4ca1a9",
      callsign: "UAL789",
      originCountry: "United States",
      timePosition: Date.now() / 1000 - 200,
      lastContact: Date.now() / 1000 - 40,
      longitude: -74.006,
      latitude: 40.7128,
      altitude: 39000,
      onGround: false,
      velocity: 900,
      trueTrack: 300,
      verticalRate: 0,
      sensors: [1, 2, 3],
      geoAltitude: 39000,
      squawk: "3456",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1aa",
      callsign: "ACA012",
      originCountry: "Canada",
      timePosition: Date.now() / 1000 - 80,
      lastContact: Date.now() / 1000 - 8,
      longitude: -79.3832,
      latitude: 43.6532,
      altitude: 31000,
      onGround: false,
      velocity: 750,
      trueTrack: 15,
      verticalRate: 400,
      sensors: [1, 2],
      geoAltitude: 31000,
      squawk: "7890",
      spi: false,
      positionSource: 0,
    },
    // Ground operations
    {
      icao24: "4ca1ab",
      callsign: "EZY345",
      originCountry: "United Kingdom",
      timePosition: Date.now() / 1000 - 30,
      lastContact: Date.now() / 1000 - 2,
      longitude: -0.1276,
      latitude: 51.5074,
      altitude: 0,
      onGround: true,
      velocity: 0,
      trueTrack: 0,
      verticalRate: 0,
      sensors: [1],
      geoAltitude: 0,
      squawk: "1234",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1ac",
      callsign: "WZZ678",
      originCountry: "Poland",
      timePosition: Date.now() / 1000 - 45,
      lastContact: Date.now() / 1000 - 3,
      longitude: 21.0122,
      latitude: 52.2297,
      altitude: 0,
      onGround: true,
      velocity: 0,
      trueTrack: 0,
      verticalRate: 0,
      sensors: [1],
      geoAltitude: 0,
      squawk: "5678",
      spi: false,
      positionSource: 0,
    },
    // High altitude flights
    {
      icao24: "4ca1ad",
      callsign: "SWR901",
      originCountry: "Switzerland",
      timePosition: Date.now() / 1000 - 70,
      lastContact: Date.now() / 1000 - 7,
      longitude: 8.2275,
      latitude: 46.8182,
      altitude: 45000,
      onGround: false,
      velocity: 980,
      trueTrack: 75,
      verticalRate: 0,
      sensors: [1, 2, 3],
      geoAltitude: 45000,
      squawk: "9012",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1ae",
      callsign: "OSA234",
      originCountry: "Austria",
      timePosition: Date.now() / 1000 - 50,
      lastContact: Date.now() / 1000 - 4,
      longitude: 16.3738,
      latitude: 48.2082,
      altitude: 43000,
      onGround: false,
      velocity: 920,
      trueTrack: 165,
      verticalRate: -50,
      sensors: [1, 2],
      geoAltitude: 43000,
      squawk: "3456",
      spi: false,
      positionSource: 0,
    },
    {
      icao24: "4ca1af",
      callsign: "IBE567",
      originCountry: "Spain",
      timePosition: Date.now() / 1000 - 35,
      lastContact: Date.now() / 1000 - 1,
      longitude: -3.7038,
      latitude: 40.4168,
      altitude: 27000,
      onGround: false,
      velocity: 680,
      trueTrack: 225,
      verticalRate: 250,
      sensors: [1],
      geoAltitude: 27000,
      squawk: "7890",
      spi: false,
      positionSource: 0,
    },
  ];

  static getMockData(type: string = "all"): FlightData[] {
    console.log(`🎭 Using mock data (type: ${type})`);

    switch (type.toLowerCase()) {
      case "europe":
        return this.MOCK_FLIGHTS.filter((flight) =>
          [
            "Ireland",
            "United Kingdom",
            "France",
            "Germany",
            "Netherlands",
            "Poland",
            "Switzerland",
            "Austria",
            "Spain",
          ].includes(flight.originCountry || "")
        );

      case "asia":
        return this.MOCK_FLIGHTS.filter((flight) =>
          ["Japan", "Singapore", "South Korea"].includes(
            flight.originCountry || ""
          )
        );

      case "busy":
        // Return flights concentrated around London
        return this.MOCK_FLIGHTS.filter(
          (flight) =>
            flight.longitude &&
            flight.latitude &&
            flight.longitude >= -1 &&
            flight.longitude <= 1 &&
            flight.latitude >= 50 &&
            flight.latitude <= 52
        );

      case "empty":
        return [];

      case "high-altitude":
        return this.MOCK_FLIGHTS.filter(
          (flight) => flight.altitude && flight.altitude > 35000
        );

      case "low-altitude":
        return this.MOCK_FLIGHTS.filter(
          (flight) => flight.altitude && flight.altitude < 30000
        );

      case "mixed":
        // Return a mix of different types
        return [
          ...this.MOCK_FLIGHTS.slice(0, 5), // First 5 flights
          ...this.MOCK_FLIGHTS.filter((f) => f.onGround).slice(0, 2), // 2 ground flights
          ...this.MOCK_FLIGHTS.filter(
            (f) => f.altitude && f.altitude > 40000
          ).slice(0, 3), // 3 high altitude
        ];

      case "all":
      default:
        return [...this.MOCK_FLIGHTS];
    }
  }

  static getMockDataCount(type: string = "all"): number {
    return this.getMockData(type).length;
  }
}
