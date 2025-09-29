// Infrastructure - Statistics Calculator Implementation
import type {
  FlightStatistics,
  StatisticsCalculator,
  AltitudeDistribution,
  CountryDistribution,
  TopCountry,
  SpeedAltitudePoint,
} from "../../domain/analytics/entities";
import type { FlightEntity } from "../../domain/flight/entities";
import { AnalyticsSpecifications } from "../../domain/analytics/entities";

export class FlightStatisticsCalculator implements StatisticsCalculator {
  calculateStatistics(flights: FlightEntity[]): FlightStatistics {
    const validFlights = flights.filter((f) => f.altitude && f.velocity);

    if (validFlights.length === 0) {
      return {
        totalFlights: flights.length,
        averageAltitude: 0,
        averageSpeed: 0,
        maxAltitude: 0,
        maxSpeed: 0,
        countriesCount: 0,
        altitudeDistribution: { ranges: [] },
        countryDistribution: { countries: [] },
        topCountries: [],
        speedAltitudeCorrelation: [],
      };
    }

    const altitudes = validFlights
      .map((f) => f.altitude!.value)
      .filter((a) => a > 0);
    const speeds = validFlights
      .map((f) => f.velocity!.value)
      .filter((v) => v > 0);
    const countries = new Set(
      flights.map((f) => f.originCountry).filter(Boolean)
    );

    return {
      totalFlights: flights.length,
      averageAltitude: altitudes.reduce((a, b) => a + b, 0) / altitudes.length,
      averageSpeed: speeds.reduce((a, b) => a + b, 0) / speeds.length,
      maxAltitude: Math.max(...altitudes),
      maxSpeed: Math.max(...speeds),
      countriesCount: countries.size,
      altitudeDistribution: this.calculateAltitudeDistribution(flights),
      countryDistribution: this.calculateCountryDistribution(flights),
      topCountries: this.calculateTopCountries(
        flights,
        AnalyticsSpecifications.TOP_COUNTRIES_LIMIT
      ),
      speedAltitudeCorrelation: this.calculateSpeedAltitudeCorrelation(flights),
    };
  }

  calculateAltitudeDistribution(flights: FlightEntity[]): AltitudeDistribution {
    const ranges = AnalyticsSpecifications.ALTITUDE_RANGES.map((range) => {
      const count = flights.filter(
        (flight) =>
          flight.altitude &&
          flight.altitude.value >= range.min &&
          flight.altitude.value <= range.max
      ).length;

      return {
        min: range.min,
        max: range.max,
        count,
        label: range.label,
      };
    });

    return { ranges };
  }

  calculateCountryDistribution(flights: FlightEntity[]): CountryDistribution {
    const countryCounts = flights.reduce((acc, flight) => {
      if (flight.originCountry) {
        acc[flight.originCountry] = (acc[flight.originCountry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const total = flights.length;
    const countries = Object.entries(countryCounts).map(([country, count]) => ({
      country,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));

    return { countries };
  }

  calculateTopCountries(flights: FlightEntity[], limit: number): TopCountry[] {
    const countryCounts = flights.reduce((acc, flight) => {
      if (flight.originCountry) {
        acc[flight.originCountry] = (acc[flight.originCountry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, limit)
      .map(([country, count], index) => ({
        country,
        count: count as number,
        rank: index + 1,
      }));
  }

  calculateSpeedAltitudeCorrelation(
    flights: FlightEntity[]
  ): SpeedAltitudePoint[] {
    return flights
      .filter((f) => f.velocity && f.altitude)
      .map((f) => ({
        speed: f.velocity!.value,
        altitude: f.altitude!.value,
        flightId: f.icao24,
      }));
  }
}
