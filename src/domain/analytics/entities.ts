// Analytics Domain
export interface FlightStatistics {
  readonly totalFlights: number;
  readonly averageAltitude: number;
  readonly averageSpeed: number;
  readonly maxAltitude: number;
  readonly maxSpeed: number;
  readonly countriesCount: number;
  readonly altitudeDistribution: AltitudeDistribution;
  readonly countryDistribution: CountryDistribution;
  readonly topCountries: TopCountry[];
  readonly speedAltitudeCorrelation: SpeedAltitudePoint[];
}

export interface AltitudeDistribution {
  readonly ranges: AltitudeRange[];
}

export interface AltitudeRange {
  readonly min: number;
  readonly max: number;
  readonly count: number;
  readonly label: string;
}

export interface CountryDistribution {
  readonly countries: CountryCount[];
}

export interface CountryCount {
  readonly country: string;
  readonly count: number;
  readonly percentage: number;
}

export interface TopCountry {
  readonly country: string;
  readonly count: number;
  readonly rank: number;
}

export interface SpeedAltitudePoint {
  readonly speed: number;
  readonly altitude: number;
  readonly flightId: string;
}

// Analytics Services
export interface StatisticsCalculator {
  calculateStatistics(flights: FlightEntity[]): FlightStatistics;
  calculateAltitudeDistribution(flights: FlightEntity[]): AltitudeDistribution;
  calculateCountryDistribution(flights: FlightEntity[]): CountryDistribution;
  calculateTopCountries(flights: FlightEntity[], limit: number): TopCountry[];
  calculateSpeedAltitudeCorrelation(
    flights: FlightEntity[]
  ): SpeedAltitudePoint[];
}

// Analytics Specifications
export class AnalyticsSpecifications {
  static readonly ALTITUDE_RANGES = [
    { min: 0, max: 999, label: "0-999 ft" },
    { min: 1000, max: 2999, label: "1,000-2,999 ft" },
    { min: 3000, max: 9999, label: "3,000-9,999 ft" },
    { min: 10000, max: 19999, label: "10,000-19,999 ft" },
    { min: 20000, max: 29999, label: "20,000-29,999 ft" },
    { min: 30000, max: 39999, label: "30,000-39,999 ft" },
    { min: 40000, max: 49999, label: "40,000-49,999 ft" },
    { min: 50000, max: 999999, label: "50,000+ ft" },
  ];

  static readonly TOP_COUNTRIES_LIMIT = 10;
  static readonly PIE_CHART_LIMIT = 5;
}

// Import FlightEntity from flight domain
import type { FlightEntity } from "../flight/entities";
