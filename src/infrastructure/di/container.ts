// Dependency Injection Container
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

import { OpenSkyFlightRepository } from "../api/opensky-repository";
import { LocalStorageCacheService } from "../api/opensky-repository";
import { FlightStatisticsCalculator } from "../services/statistics-calculator";

export class DIContainer {
  private static instance: DIContainer;
  private cacheService!: CacheService;
  private flightRepository!: FlightRepository;
  private statisticsCalculator!: StatisticsCalculator;
  private getFlightDataUseCase!: GetFlightDataUseCase;
  private getFlightStatisticsUseCase!: GetFlightStatisticsUseCase;
  private refreshFlightDataUseCase!: RefreshFlightDataUseCase;
  private getFlightsByCountryUseCase!: GetFlightsByCountryUseCase;
  private getFlightsInBoundsUseCase!: GetFlightsInBoundsUseCase;

  private constructor() {
    this.initializeServices();
    this.initializeUseCases();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    this.cacheService = new LocalStorageCacheService();
    this.flightRepository = new OpenSkyFlightRepository();
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
}

// Export singleton instance
export const container = DIContainer.getInstance();
