// Mock Repository Implementation for Development and Testing
import type {
  FlightRepository,
  FlightEntity,
  BoundingBox,
} from "../../domain/flight/entities";
import {
  mockFlights,
  mockFlightsEurope,
  mockFlightsAsia,
  mockFlightsBusy,
  mockFlightsEmpty,
  mockFlightsHighAltitude,
  mockFlightsLowAltitude,
  mockFlightsMixed,
} from "./data/flight-data";

export class MockFlightRepository implements FlightRepository {
  private flights: FlightEntity[] = mockFlights;
  private delay: number = 500; // Simulate network delay

  constructor(
    useMockData:
      | "all"
      | "europe"
      | "asia"
      | "busy"
      | "empty"
      | "high-altitude"
      | "low-altitude"
      | "mixed" = "all"
  ) {
    switch (useMockData) {
      case "europe":
        this.flights = mockFlightsEurope;
        break;
      case "asia":
        this.flights = mockFlightsAsia;
        break;
      case "busy":
        this.flights = mockFlightsBusy;
        break;
      case "empty":
        this.flights = mockFlightsEmpty;
        break;
      case "high-altitude":
        this.flights = mockFlightsHighAltitude;
        break;
      case "low-altitude":
        this.flights = mockFlightsLowAltitude;
        break;
      case "mixed":
        this.flights = mockFlightsMixed;
        break;
      default:
        this.flights = mockFlights;
    }
  }

  async getAllFlights(): Promise<FlightEntity[]> {
    await this.simulateDelay();
    return [...this.flights]; // Return copy to prevent mutations
  }

  async getFlightsByCountry(country: string): Promise<FlightEntity[]> {
    await this.simulateDelay();
    return this.flights.filter((flight) => flight.originCountry === country);
  }

  async getFlightsInBounds(bounds: BoundingBox): Promise<FlightEntity[]> {
    await this.simulateDelay();
    return this.flights.filter((flight) => {
      if (!flight.position) return false;

      return (
        flight.position.latitude >= bounds.minLat &&
        flight.position.latitude <= bounds.maxLat &&
        flight.position.longitude >= bounds.minLon &&
        flight.position.longitude <= bounds.maxLon
      );
    });
  }

  // Utility methods for testing
  setFlights(flights: FlightEntity[]): void {
    this.flights = flights;
  }

  addFlight(flight: FlightEntity): void {
    this.flights.push(flight);
  }

  removeFlight(icao24: string): void {
    this.flights = this.flights.filter((flight) => flight.icao24 !== icao24);
  }

  clearFlights(): void {
    this.flights = [];
  }

  setDelay(delayMs: number): void {
    this.delay = delayMs;
  }

  private async simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }
}

// Mock Cache Service for testing
export class MockCacheService {
  private cache: Map<string, { data: any; expiresAt?: number }> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.cache.set(key, {
      data: value,
      expiresAt: ttl ? Date.now() + ttl : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Utility methods for testing
  getCacheSize(): number {
    return this.cache.size;
  }

  hasKey(key: string): boolean {
    return this.cache.has(key);
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}
