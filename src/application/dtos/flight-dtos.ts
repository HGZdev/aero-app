// Application DTOs (Data Transfer Objects)
export interface FlightDTO {
  icao24: string;
  callsign?: string;
  originCountry?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  velocity?: number;
  trueTrack?: number;
  onGround: boolean;
  lastContact: string; // ISO string
}

export interface FlightStatisticsDTO {
  totalFlights: number;
  averageAltitude: number;
  averageSpeed: number;
  maxAltitude: number;
  maxSpeed: number;
  countriesCount: number;
  altitudeDistribution: AltitudeDistributionDTO;
  countryDistribution: CountryDistributionDTO;
  topCountries: TopCountryDTO[];
  speedAltitudeCorrelation: SpeedAltitudePointDTO[];
}

export interface AltitudeDistributionDTO {
  ranges: AltitudeRangeDTO[];
}

export interface AltitudeRangeDTO {
  min: number;
  max: number;
  count: number;
  label: string;
}

export interface CountryDistributionDTO {
  countries: CountryCountDTO[];
}

export interface CountryCountDTO {
  country: string;
  count: number;
  percentage: number;
}

export interface TopCountryDTO {
  country: string;
  count: number;
  rank: number;
}

export interface SpeedAltitudePointDTO {
  speed: number;
  altitude: number;
  flightId: string;
}

// Mappers between Domain and DTO
export class FlightMapper {
  static toDTO(flight: FlightEntity): FlightDTO {
    return {
      icao24: flight.icao24,
      callsign: flight.callsign,
      originCountry: flight.originCountry,
      latitude: flight.position?.latitude,
      longitude: flight.position?.longitude,
      altitude: flight.altitude?.value,
      velocity: flight.velocity?.value,
      trueTrack: flight.heading?.value,
      onGround: flight.onGround,
      lastContact: flight.lastContact.toISOString(),
    };
  }

  static toDomain(dto: FlightDTO): FlightEntity {
    return {
      icao24: dto.icao24,
      callsign: dto.callsign,
      originCountry: dto.originCountry,
      position:
        dto.latitude && dto.longitude
          ? {
              latitude: dto.latitude,
              longitude: dto.longitude,
            }
          : undefined,
      altitude: dto.altitude
        ? {
            value: dto.altitude,
            unit: "feet" as const,
          }
        : undefined,
      velocity: dto.velocity
        ? {
            value: dto.velocity,
            unit: "km/h" as const,
          }
        : undefined,
      heading: dto.trueTrack
        ? {
            value: dto.trueTrack,
            unit: "degrees" as const,
          }
        : undefined,
      onGround: dto.onGround,
      lastContact: new Date(dto.lastContact),
    };
  }
}

export class StatisticsMapper {
  static toDTO(statistics: FlightStatistics): FlightStatisticsDTO {
    return {
      totalFlights: statistics.totalFlights,
      averageAltitude: statistics.averageAltitude,
      averageSpeed: statistics.averageSpeed,
      maxAltitude: statistics.maxAltitude,
      maxSpeed: statistics.maxSpeed,
      countriesCount: statistics.countriesCount,
      altitudeDistribution: {
        ranges: statistics.altitudeDistribution.ranges.map((range) => ({
          min: range.min,
          max: range.max,
          count: range.count,
          label: range.label,
        })),
      },
      countryDistribution: {
        countries: statistics.countryDistribution.countries.map((country) => ({
          country: country.country,
          count: country.count,
          percentage: country.percentage,
        })),
      },
      topCountries: statistics.topCountries.map((country) => ({
        country: country.country,
        count: country.count,
        rank: country.rank,
      })),
      speedAltitudeCorrelation: statistics.speedAltitudeCorrelation.map(
        (point) => ({
          speed: point.speed,
          altitude: point.altitude,
          flightId: point.flightId,
        })
      ),
    };
  }
}

// Import types
import type { FlightEntity } from "../../domain/flight/entities";
import type { FlightStatistics } from "../../domain/analytics/entities";
