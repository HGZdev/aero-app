// Simplified Flight Service - replaces complex DDD architecture

export interface FlightData {
  icao24: string;
  callsign?: string;
  originCountry?: string;
  timePosition?: number;
  lastContact?: number;
  longitude?: number;
  latitude?: number;
  altitude?: number;
  onGround: boolean;
  velocity?: number;
  trueTrack?: number;
  verticalRate?: number;
  sensors?: number[];
  geoAltitude?: number;
  squawk?: string;
  spi: boolean;
  positionSource: number;
}

export interface OpenSkyResponse {
  time: number;
  states: (string | number | boolean | null)[][];
}

export interface FlightStats {
  totalFlights: number;
  avgAltitude: number;
  avgSpeed: number;
  maxAltitude: number;
  maxSpeed: number;
  countriesCount: number;
  altitudeDistribution: Record<string, number>;
  countryDistribution: Record<string, number>;
  topCountries: Array<{ country: string; count: number }>;
  speedAltitudeCorrelation: Array<{ speed: number; altitude: number }>;
}

export class FlightService {
  private static readonly BASE_URL = "https://opensky-network.org/api";
  private static readonly CACHE_KEY = "aero-app-flight-data";
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static lastRequestTime = 0;
  private static requestCount = 0;
  private static readonly MAX_REQUESTS_PER_MINUTE = 10;

  // Cache management
  private static getCachedData(): {
    data: FlightData[];
    timestamp: number;
  } | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const now = Date.now();

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
      const cacheData = { data, timestamp: Date.now() };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Error saving cache:", error);
    }
  }

  // Rate limiting
  private static async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest > 60000) {
      this.requestCount = 0;
    }

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

    if (timeSinceLastRequest < 1000) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  // Parse flight state from OpenSky API
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

  // Calculate statistics from flight data
  static calculateStats(flights: FlightData[]): FlightStats {
    // Altitude distribution
    const altitudeData = flights.reduce((acc, flight) => {
      const range = Math.floor((flight.altitude || 0) / 1000) * 1000;
      const key = `${range}-${range + 999}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Country distribution
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

    const validFlights = flights.filter((f) => f.altitude && f.velocity);
    const altitudes = validFlights.map((f) => f.altitude!).filter((a) => a > 0);
    const speeds = validFlights.map((f) => f.velocity!).filter((v) => v > 0);
    const countries = new Set(
      flights.map((f) => f.originCountry).filter(Boolean)
    );

    return {
      totalFlights: flights.length,
      avgAltitude:
        altitudes.length > 0
          ? altitudes.reduce((a, b) => a + b, 0) / altitudes.length
          : 0,
      avgSpeed:
        speeds.length > 0
          ? speeds.reduce((a, b) => a + b, 0) / speeds.length
          : 0,
      maxAltitude: altitudes.length > 0 ? Math.max(...altitudes) : 0,
      maxSpeed: speeds.length > 0 ? Math.max(...speeds) : 0,
      countriesCount: countries.size,
      altitudeDistribution: altitudeData,
      countryDistribution: countryData,
      topCountries,
      speedAltitudeCorrelation: speedAltitudeData,
    };
  }

  // Get all flights
  static async getAllFlights(forceRefresh = false): Promise<FlightData[]> {
    // In test mode, return empty data to avoid API calls
    const isTestMode =
      import.meta.env.MODE === "test" ||
      (typeof window !== "undefined" &&
        window.location.hostname === "localhost" &&
        window.location.port === "5173");

    if (isTestMode) {
      console.log("🧪 Test mode: returning empty flight data");
      return [];
    }

    // Check cache first
    if (!forceRefresh) {
      const cached = this.getCachedData();
      if (cached) {
        console.log("📦 Using cached flight data");
        return cached.data;
      }
    }

    try {
      await this.enforceRateLimit();

      console.log("🌐 Fetching fresh flight data from API...");
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

      const data = await response.json();

      if (!data.states) {
        return [];
      }

      const flights = data.states.map((state: any) =>
        this.parseFlightState(state)
      );

      // Cache the fresh data
      this.setCachedData(flights);
      console.log(
        `✅ Successfully fetched data from API - ${flights.length} flights`
      );

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

  // Get flights in bounds
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

      const data = await response.json();

      if (!data.states) {
        return [];
      }

      return data.states.map((state: any) => this.parseFlightState(state));
    } catch (error) {
      console.error("Error fetching flights in bounds:", error);
      throw error;
    }
  }

  // Clear cache
  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    console.log("Cache cleared");
  }
}
