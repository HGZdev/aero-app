// Application Use Cases
import type {
  FlightEntity,
  FlightRepository,
} from "../../domain/flight/entities";
import type {
  FlightStatistics,
  StatisticsCalculator,
} from "../../domain/analytics/entities";
import type { Result } from "../../domain/shared/types";
import { ErrorHandler, errorLogger } from "../../domain/shared/errors";

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface GetFlightDataUseCase {
  execute(): Promise<Result<FlightEntity[], Error>>;
}

export interface GetFlightStatisticsUseCase {
  execute(): Promise<Result<FlightStatistics, Error>>;
}

export interface RefreshFlightDataUseCase {
  execute(): Promise<Result<FlightEntity[], Error>>;
}

export interface GetFlightsByCountryUseCase {
  execute(country: string): Promise<Result<FlightEntity[], Error>>;
}

export interface GetFlightsInBoundsUseCase {
  execute(bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }): Promise<Result<FlightEntity[], Error>>;
}

// Use Case Implementations
export class GetFlightDataUseCaseImpl implements GetFlightDataUseCase {
  constructor(
    private readonly flightRepository: FlightRepository,
    private readonly cacheService: CacheService
  ) {}

  async execute(): Promise<Result<FlightEntity[], Error>> {
    try {
      // Try cache first
      const cachedData = await this.cacheService.get<FlightEntity[]>(
        "flight-data"
      );
      if (cachedData) {
        return new Success(cachedData);
      }

      // Fallback to API
      const flights = await this.flightRepository.getAllFlights();
      await this.cacheService.set("flight-data", flights, 5 * 60 * 1000); // 5 minutes

      return new Success(flights);
    } catch (error) {
      errorLogger.logError(error, {
        component: "GetFlightDataUseCaseImpl",
        method: "execute",
      });

      return new Failure(
        ErrorHandler.wrapError(error, {
          useCase: "GetFlightData",
          operation: "execute",
        })
      );
    }
  }
}

export class GetFlightStatisticsUseCaseImpl
  implements GetFlightStatisticsUseCase
{
  constructor(
    private readonly getFlightDataUseCase: GetFlightDataUseCase,
    private readonly statisticsCalculator: StatisticsCalculator
  ) {}

  async execute(): Promise<Result<FlightStatistics, Error>> {
    try {
      const flightsResult = await this.getFlightDataUseCase.execute();

      if (flightsResult.isFailure()) {
        return new Failure(flightsResult.error);
      }

      const statistics = this.statisticsCalculator.calculateStatistics(
        flightsResult.value
      );
      return new Success(statistics);
    } catch (error) {
      return new Failure(error as Error);
    }
  }
}

export class RefreshFlightDataUseCaseImpl implements RefreshFlightDataUseCase {
  constructor(
    private readonly flightRepository: FlightRepository,
    private readonly cacheService: CacheService
  ) {}

  async execute(): Promise<Result<FlightEntity[], Error>> {
    try {
      // Force refresh from API
      const flights = await this.flightRepository.getAllFlights();
      await this.cacheService.set("flight-data", flights, 5 * 60 * 1000);

      return new Success(flights);
    } catch (error) {
      return new Failure(error as Error);
    }
  }
}

export class GetFlightsByCountryUseCaseImpl
  implements GetFlightsByCountryUseCase
{
  constructor(private readonly flightRepository: FlightRepository) {}

  async execute(country: string): Promise<Result<FlightEntity[], Error>> {
    try {
      const flights = await this.flightRepository.getFlightsByCountry(country);
      return new Success(flights);
    } catch (error) {
      return new Failure(error as Error);
    }
  }
}

export class GetFlightsInBoundsUseCaseImpl
  implements GetFlightsInBoundsUseCase
{
  constructor(private readonly flightRepository: FlightRepository) {}

  async execute(bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }): Promise<Result<FlightEntity[], Error>> {
    try {
      const flights = await this.flightRepository.getFlightsInBounds({
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
        minLon: bounds.minLon,
        maxLon: bounds.maxLon,
      });
      return new Success(flights);
    } catch (error) {
      return new Failure(error as Error);
    }
  }
}

// Cache Service Interface
export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Import Success and Failure
import { Success, Failure } from "../../domain/shared/types";
