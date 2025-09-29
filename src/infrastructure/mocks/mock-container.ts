// Mock Dependency Injection Container for Development and Testing
import type {
  GetFlightDataUseCase,
  GetFlightStatisticsUseCase,
  RefreshFlightDataUseCase,
  GetFlightsByCountryUseCase,
  GetFlightsInBoundsUseCase,
  CacheService,
} from "../../application/use-cases/flight-use-cases";
import type { StatisticsCalculator } from "../../domain/analytics/entities";
import type { FlightRepository } from "../../domain/flight/entities";

import {
  GetFlightDataUseCaseImpl,
  GetFlightStatisticsUseCaseImpl,
  RefreshFlightDataUseCaseImpl,
  GetFlightsByCountryUseCaseImpl,
  GetFlightsInBoundsUseCaseImpl,
} from "../../application/use-cases/flight-use-cases";

import { MockFlightRepository, MockCacheService } from "./repositories";
import { FlightStatisticsCalculator } from "../services/statistics-calculator";

export class MockDIContainer {
  private static instance: MockDIContainer;
  private cacheService!: CacheService;
  private flightRepository!: FlightRepository;
  private statisticsCalculator!: StatisticsCalculator;
  private getFlightDataUseCase!: GetFlightDataUseCase;
  private getFlightStatisticsUseCase!: GetFlightStatisticsUseCase;
  private refreshFlightDataUseCase!: RefreshFlightDataUseCase;
  private getFlightsByCountryUseCase!: GetFlightsByCountryUseCase;
  private getFlightsInBoundsUseCase!: GetFlightsInBoundsUseCase;

  private constructor(
    mockDataType:
      | "all"
      | "europe"
      | "asia"
      | "busy"
      | "empty"
      | "high-altitude"
      | "low-altitude"
      | "mixed" = "all"
  ) {
    this.initializeServices(mockDataType);
    this.initializeUseCases();
  }

  static getInstance(
    mockDataType:
      | "all"
      | "europe"
      | "asia"
      | "busy"
      | "empty"
      | "high-altitude"
      | "low-altitude"
      | "mixed" = "all"
  ): MockDIContainer {
    if (!MockDIContainer.instance) {
      MockDIContainer.instance = new MockDIContainer(mockDataType);
    }
    return MockDIContainer.instance;
  }

  private initializeServices(
    mockDataType:
      | "all"
      | "europe"
      | "asia"
      | "busy"
      | "empty"
      | "high-altitude"
      | "low-altitude"
      | "mixed"
  ): void {
    this.cacheService = new MockCacheService();
    this.flightRepository = new MockFlightRepository(mockDataType);
    this.statisticsCalculator = new FlightStatisticsCalculator();
  }

  private initializeUseCases(): void {
    this.getFlightDataUseCase = new GetFlightDataUseCaseImpl(
      this.flightRepository,
      this.cacheService
    );

    this.getFlightStatisticsUseCase = new GetFlightStatisticsUseCaseImpl(
      this.getFlightDataUseCase,
      this.statisticsCalculator
    );

    this.refreshFlightDataUseCase = new RefreshFlightDataUseCaseImpl(
      this.flightRepository,
      this.cacheService
    );

    this.getFlightsByCountryUseCase = new GetFlightsByCountryUseCaseImpl(
      this.flightRepository
    );

    this.getFlightsInBoundsUseCase = new GetFlightsInBoundsUseCaseImpl(
      this.flightRepository
    );
  }

  // Getters for use cases
  getFlightData(): GetFlightDataUseCase {
    return this.getFlightDataUseCase;
  }

  getFlightStatistics(): GetFlightStatisticsUseCase {
    return this.getFlightStatisticsUseCase;
  }

  refreshFlightData(): RefreshFlightDataUseCase {
    return this.refreshFlightDataUseCase;
  }

  getFlightsByCountry(): GetFlightsByCountryUseCase {
    return this.getFlightsByCountryUseCase;
  }

  getFlightsInBounds(): GetFlightsInBoundsUseCase {
    return this.getFlightsInBoundsUseCase;
  }

  // Getters for services
  getCacheService(): CacheService {
    return this.cacheService;
  }

  getFlightRepository(): FlightRepository {
    return this.flightRepository;
  }

  getStatisticsCalculator(): StatisticsCalculator {
    return this.statisticsCalculator;
  }

  // Utility methods for testing
  getMockFlightRepository(): MockFlightRepository {
    return this.flightRepository as MockFlightRepository;
  }

  getMockCacheService(): MockCacheService {
    return this.cacheService as MockCacheService;
  }

  reset(): void {
    this.getMockFlightRepository().clearFlights();
    this.getMockCacheService().clear();
  }
}

// Export singleton instance
export const mockContainer = MockDIContainer.getInstance();
