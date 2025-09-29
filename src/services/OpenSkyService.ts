import type { FlightData, OpenSkyResponse } from "../types/FlightData";

export class OpenSkyService {
  private static readonly BASE_URL = "https://opensky-network.org/api";
  // private static readonly RATE_LIMIT_DELAY = 10000; // 10 seconds

  /**
   * Get all flights currently in the air
   */
  static async getAllFlights(): Promise<FlightData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/states/all`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenSkyResponse = await response.json();

      if (!data.states) {
        return [];
      }

      return data.states.map((state) => this.parseFlightState(state));
    } catch (error) {
      console.error("Error fetching flights:", error);
      throw error;
    }
  }

  /**
   * Get flights within a specific bounding box
   */
  static async getFlightsInBounds(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
  ): Promise<FlightData[]> {
    try {
      const url = `${this.BASE_URL}/states/all?lamin=${minLat}&lamax=${maxLat}&lomin=${minLon}&lomax=${maxLon}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenSkyResponse = await response.json();

      if (!data.states) {
        return [];
      }

      return data.states.map((state) => this.parseFlightState(state));
    } catch (error) {
      console.error("Error fetching flights in bounds:", error);
      throw error;
    }
  }

  /**
   * Get flights for a specific aircraft by ICAO24
   */
  static async getFlightsByAircraft(icao24: string): Promise<FlightData[]> {
    try {
      const url = `${this.BASE_URL}/states/all?icao24=${icao24}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenSkyResponse = await response.json();

      if (!data.states) {
        return [];
      }

      return data.states.map((state) => this.parseFlightState(state));
    } catch (error) {
      console.error("Error fetching flights by aircraft:", error);
      throw error;
    }
  }

  /**
   * Parse raw state data from OpenSky API into FlightData object
   */
  private static parseFlightState(
    state: (string | number | boolean | null)[]
  ): FlightData {
    return {
      icao24: state[0] as string,
      callsign: (state[1] as string) || undefined,
      originCountry: (state[2] as string) || undefined,
      timePosition: (state[3] as number) || undefined,
      lastContact: (state[4] as number) || undefined,
      longitude: (state[5] as number) || undefined,
      latitude: (state[6] as number) || undefined,
      altitude: (state[7] as number) || undefined,
      onGround: state[8] as boolean,
      velocity: (state[9] as number) || undefined,
      trueTrack: (state[10] as number) || undefined,
      verticalRate: (state[11] as number) || undefined,
      sensors: (state[12] as number[] | null) || undefined,
      geoAltitude: (state[13] as number) || undefined,
      squawk: (state[14] as string) || undefined,
      spi: state[15] as boolean,
      positionSource: state[16] as number,
    };
  }

  /**
   * Get flights over Europe (approximate bounding box)
   */
  static async getFlightsOverEurope(): Promise<FlightData[]> {
    return this.getFlightsInBounds(35, 70, -25, 40);
  }

  /**
   * Get flights over North America
   */
  static async getFlightsOverNorthAmerica(): Promise<FlightData[]> {
    return this.getFlightsInBounds(25, 70, -170, -50);
  }

  /**
   * Filter flights by altitude range
   */
  static filterByAltitude(
    flights: FlightData[],
    minAlt: number,
    maxAlt: number
  ): FlightData[] {
    return flights.filter(
      (flight) =>
        flight.altitude &&
        flight.altitude >= minAlt &&
        flight.altitude <= maxAlt
    );
  }

  /**
   * Filter flights by speed range
   */
  static filterBySpeed(
    flights: FlightData[],
    minSpeed: number,
    maxSpeed: number
  ): FlightData[] {
    return flights.filter(
      (flight) =>
        flight.velocity &&
        flight.velocity >= minSpeed &&
        flight.velocity <= maxSpeed
    );
  }

  /**
   * Get statistics for flights
   */
  static getFlightStats(flights: FlightData[]) {
    const validFlights = flights.filter((f) => f.altitude && f.velocity);

    if (validFlights.length === 0) {
      return {
        totalFlights: flights.length,
        avgAltitude: 0,
        avgSpeed: 0,
        maxAltitude: 0,
        maxSpeed: 0,
        countries: 0,
      };
    }

    const altitudes = validFlights.map((f) => f.altitude!).filter((a) => a > 0);
    const speeds = validFlights.map((f) => f.velocity!).filter((v) => v > 0);
    const countries = new Set(
      flights.map((f) => f.originCountry).filter(Boolean)
    );

    return {
      totalFlights: flights.length,
      avgAltitude: altitudes.reduce((a, b) => a + b, 0) / altitudes.length,
      avgSpeed: speeds.reduce((a, b) => a + b, 0) / speeds.length,
      maxAltitude: Math.max(...altitudes),
      maxSpeed: Math.max(...speeds),
      countries: countries.size,
    };
  }
}
