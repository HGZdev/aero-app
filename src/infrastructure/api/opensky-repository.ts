// Infrastructure Layer - External API Implementation
import type {
  FlightRepository,
  FlightEntity,
  BoundingBox,
} from "../../domain/flight/entities";
import type { CacheService } from "../../application/use-cases/flight-use-cases";
import {
  NetworkError,
  TimeoutError,
  RateLimitError,
  ParsingError,
  RetryUtil,
  DEFAULT_RETRY_CONFIG,
  errorLogger,
} from "../../domain/shared/errors";

// OpenSky API Implementation
export class OpenSkyFlightRepository implements FlightRepository {
  private static readonly BASE_URL = "https://opensky-network.org/api";
  private static lastRequestTime = 0;
  private static requestCount = 0;
  private static readonly MAX_REQUESTS_PER_MINUTE = 10;

  async getAllFlights(): Promise<FlightEntity[]> {
    return RetryUtil.executeWithRetry(
      async () => {
        await this.enforceRateLimit();

        const url = `${OpenSkyFlightRepository.BASE_URL}/states/all`;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "User-Agent": "AeroApp/1.0",
            },
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            if (response.status === 429) {
              const retryAfter = response.headers.get("Retry-After");
              throw new RateLimitError(
                "OpenSky API rate limit exceeded",
                retryAfter ? parseInt(retryAfter) * 1000 : undefined,
                { url, statusCode: response.status }
              );
            }

            throw new NetworkError(
              `OpenSky API request failed`,
              response.status,
              url,
              { statusText: response.statusText }
            );
          }

          const data = await response.json();

          if (!data || typeof data !== "object") {
            throw new ParsingError(
              "Invalid response format from OpenSky API",
              data,
              { url }
            );
          }

          if (!data.states || !Array.isArray(data.states)) {
            return [];
          }

          return data.states.map((state: any) => this.parseFlightState(state));
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            throw new TimeoutError("OpenSky API request timeout", 10000, {
              url,
            });
          }
          throw error;
        }
      },
      {
        ...DEFAULT_RETRY_CONFIG,
        retryableErrors: (error) => {
          return Boolean(
            error instanceof RateLimitError ||
              error instanceof TimeoutError ||
              (error instanceof NetworkError &&
                error.statusCode &&
                error.statusCode >= 500)
          );
        },
      }
    );
  }

  async getFlightsByCountry(country: string): Promise<FlightEntity[]> {
    const allFlights = await this.getAllFlights();
    return allFlights.filter((flight) => flight.originCountry === country);
  }

  async getFlightsInBounds(bounds: BoundingBox): Promise<FlightEntity[]> {
    return RetryUtil.executeWithRetry(
      async () => {
        await this.enforceRateLimit();

        const url = `${OpenSkyFlightRepository.BASE_URL}/states/all?lamin=${bounds.minLat}&lamax=${bounds.maxLat}&lomin=${bounds.minLon}&lomax=${bounds.maxLon}`;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "User-Agent": "AeroApp/1.0",
            },
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            if (response.status === 429) {
              const retryAfter = response.headers.get("Retry-After");
              throw new RateLimitError(
                "OpenSky API rate limit exceeded",
                retryAfter ? parseInt(retryAfter) * 1000 : undefined,
                { url, statusCode: response.status, bounds }
              );
            }

            throw new NetworkError(
              `OpenSky API request failed`,
              response.status,
              url,
              { statusText: response.statusText, bounds }
            );
          }

          const data = await response.json();

          if (!data || typeof data !== "object") {
            throw new ParsingError(
              "Invalid response format from OpenSky API",
              data,
              { url, bounds }
            );
          }

          if (!data.states || !Array.isArray(data.states)) {
            return [];
          }

          return data.states.map((state: any) => this.parseFlightState(state));
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            throw new TimeoutError("OpenSky API request timeout", 10000, {
              url,
              bounds,
            });
          }
          throw error;
        }
      },
      {
        ...DEFAULT_RETRY_CONFIG,
        retryableErrors: (error) => {
          return Boolean(
            error instanceof RateLimitError ||
              error instanceof TimeoutError ||
              (error instanceof NetworkError &&
                error.statusCode &&
                error.statusCode >= 500)
          );
        },
      }
    );
  }

  private parseFlightState(state: any[]): FlightEntity {
    try {
      if (!Array.isArray(state) || state.length < 11) {
        throw new ParsingError("Invalid flight state data format", state, {
          expectedLength: 11,
          actualLength: state?.length,
        });
      }

      const icao24 = state[0];
      if (!icao24 || typeof icao24 !== "string") {
        throw new ParsingError("Invalid ICAO24 identifier", state, {
          field: "icao24",
          value: icao24,
        });
      }

      return {
        icao24,
        callsign: (state[1] as string) || undefined,
        originCountry: (state[2] as string) || undefined,
        position:
          state[5] &&
          state[6] &&
          typeof state[5] === "number" &&
          typeof state[6] === "number"
            ? {
                latitude: state[6] as number,
                longitude: state[5] as number,
              }
            : undefined,
        altitude:
          state[7] && typeof state[7] === "number"
            ? {
                value: state[7] as number,
                unit: "feet" as const,
              }
            : undefined,
        velocity:
          state[9] && typeof state[9] === "number"
            ? {
                value: state[9] as number,
                unit: "km/h" as const,
              }
            : undefined,
        heading:
          state[10] && typeof state[10] === "number"
            ? {
                value: state[10] as number,
                unit: "degrees" as const,
              }
            : undefined,
        onGround: Boolean(state[8]),
        lastContact:
          state[4] && typeof state[4] === "number"
            ? new Date(state[4] * 1000)
            : new Date(),
      };
    } catch (error) {
      errorLogger.logError(error, {
        component: "OpenSkyFlightRepository",
        method: "parseFlightState",
        stateData: state,
      });
      throw error;
    }
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - OpenSkyFlightRepository.lastRequestTime;

    // Reset counter every minute
    if (timeSinceLastRequest > 60000) {
      OpenSkyFlightRepository.requestCount = 0;
    }

    // If we've made too many requests, wait
    if (
      OpenSkyFlightRepository.requestCount >=
      OpenSkyFlightRepository.MAX_REQUESTS_PER_MINUTE
    ) {
      const waitTime = 60000 - timeSinceLastRequest;
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        OpenSkyFlightRepository.requestCount = 0;
      }
    }

    // Always wait at least 1 second between requests
    if (timeSinceLastRequest < 1000) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 - timeSinceLastRequest)
      );
    }

    OpenSkyFlightRepository.lastRequestTime = Date.now();
    OpenSkyFlightRepository.requestCount++;
  }
}

// LocalStorage Cache Implementation
export class LocalStorageCacheService implements CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (parsed.expiresAt && now > parsed.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      errorLogger.logError(error, {
        component: "LocalStorageCacheService",
        method: "get",
        key,
      });

      // If there's an error reading cache, remove the corrupted entry
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        errorLogger.logError(removeError, {
          component: "LocalStorageCacheService",
          method: "get",
          operation: "removeCorruptedEntry",
          key,
        });
      }

      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const cacheData = {
        data: value,
        timestamp: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : undefined,
      };

      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      errorLogger.logError(error, {
        component: "LocalStorageCacheService",
        method: "set",
        key,
        ttl,
        valueType: typeof value,
      });

      // If localStorage is full, try to clear old entries
      if (error instanceof Error && error.name === "QuotaExceededError") {
        try {
          await this.clearOldEntries();
          // Retry once after clearing
          const cacheData = {
            data: value,
            timestamp: Date.now(),
            expiresAt: ttl ? Date.now() + ttl : undefined,
          };
          localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (retryError) {
          errorLogger.logError(retryError, {
            component: "LocalStorageCacheService",
            method: "set",
            operation: "retryAfterClear",
            key,
          });
        }
      }
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      errorLogger.logError(error, {
        component: "LocalStorageCacheService",
        method: "delete",
        key,
      });
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      errorLogger.logError(error, {
        component: "LocalStorageCacheService",
        method: "clear",
      });
    }
  }

  private async clearOldEntries(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();

      for (const key of keys) {
        try {
          const cached = localStorage.getItem(key);
          if (!cached) continue;

          const parsed = JSON.parse(cached);
          if (parsed.expiresAt && now > parsed.expiresAt) {
            localStorage.removeItem(key);
          }
        } catch (parseError) {
          // Remove corrupted entries
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      errorLogger.logError(error, {
        component: "LocalStorageCacheService",
        method: "clearOldEntries",
      });
    }
  }
}
