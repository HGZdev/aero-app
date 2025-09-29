import type { FlightData, OpenSkyResponse } from "../types/FlightData";

export class OpenSkyService {
  private static readonly BASE_URL = "https://opensky-network.org/api";
  private static lastRequestTime = 0;
  private static requestCount = 0;
  private static readonly MAX_REQUESTS_PER_MINUTE = 10;
  private static readonly CACHE_KEY = "aero-app-flight-data";
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Cache management methods
   */
  private static getCachedData(): {
    data: FlightData[];
    timestamp: number;
  } | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - parsed.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn("Error reading cache:", error);
      localStorage.removeItem(this.CACHE_KEY);
      return null;
    }
  }

  private static setCachedData(data: FlightData[]): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Error saving cache:", error);
    }
  }

  /**
   * Rate limiting mechanism to avoid 429 errors
   */
  private static async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // Reset counter every minute
    if (timeSinceLastRequest > 60000) {
      this.requestCount = 0;
    }

    // If we've made too many requests, wait
    if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      const waitTime = 60000 - timeSinceLastRequest;
      if (waitTime > 0) {
        console.log(
          `Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        this.requestCount = 0;
      }
    }

    // Always wait at least 1 second between requests
    if (timeSinceLastRequest < 1000) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Get all flights currently in the air
   */
  static async getAllFlights(forceRefresh = false): Promise<FlightData[]> {
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cached = this.getCachedData();
      if (cached) {
        console.log("Using cached flight data");
        return cached.data;
      }
    }

    try {
      await this.enforceRateLimit();

      console.log("Fetching fresh flight data from API...");
      const response = await fetch(`${this.BASE_URL}/states/all`);

      if (!response.ok) {
        if (response.status === 429) {
          console.warn("Rate limit exceeded. Trying cached data...");
          const cached = this.getCachedData();
          if (cached) {
            console.log("Using cached data due to rate limit");
            return cached.data;
          }
          throw new Error("Rate limit exceeded and no cached data available");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenSkyResponse = await response.json();

      if (!data.states) {
        return [];
      }

      const flights = data.states.map((state) => this.parseFlightState(state));

      // Cache the fresh data
      this.setCachedData(flights);
      console.log(`Cached ${flights.length} flights`);

      return flights;
    } catch (error) {
      console.error("Error fetching flights:", error);

      // If API fails, try to return cached data
      const cached = this.getCachedData();
      if (cached) {
        console.log("API failed, using cached data");
        return cached.data;
      }

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
