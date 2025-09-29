// Domain Entities
export interface FlightEntity {
  readonly icao24: string;
  readonly callsign?: string;
  readonly originCountry?: string;
  readonly position?: Position;
  readonly altitude?: Altitude;
  readonly velocity?: Velocity;
  readonly heading?: Heading;
  readonly onGround: boolean;
  readonly lastContact: Date;
}

// Value Objects
export interface Position {
  readonly latitude: number;
  readonly longitude: number;
}

export interface Altitude {
  readonly value: number; // in feet
  readonly unit: "feet";
}

export interface Velocity {
  readonly value: number; // in km/h
  readonly unit: "km/h";
}

export interface Heading {
  readonly value: number; // in degrees
  readonly unit: "degrees";
}

// Domain Services
export interface FlightRepository {
  getAllFlights(): Promise<FlightEntity[]>;
  getFlightsByCountry(country: string): Promise<FlightEntity[]>;
  getFlightsInBounds(bounds: BoundingBox): Promise<FlightEntity[]>;
}

export interface BoundingBox {
  readonly minLat: number;
  readonly maxLat: number;
  readonly minLon: number;
  readonly maxLon: number;
}

// Domain Events
export interface FlightDataUpdated {
  readonly timestamp: Date;
  readonly flightCount: number;
  readonly source: "api" | "cache";
}

// Domain Specifications
export class FlightSpecifications {
  static isInAir(flight: FlightEntity): boolean {
    return (
      !flight.onGround &&
      flight.altitude !== undefined &&
      flight.altitude.value > 0
    );
  }

  static isCommercialFlight(flight: FlightEntity): boolean {
    return flight.callsign !== undefined && flight.callsign.length > 0;
  }

  static isInAltitudeRange(
    flight: FlightEntity,
    minAlt: number,
    maxAlt: number
  ): boolean {
    if (!flight.altitude) return false;
    return flight.altitude.value >= minAlt && flight.altitude.value <= maxAlt;
  }

  static isInSpeedRange(
    flight: FlightEntity,
    minSpeed: number,
    maxSpeed: number
  ): boolean {
    if (!flight.velocity) return false;
    return (
      flight.velocity.value >= minSpeed && flight.velocity.value <= maxSpeed
    );
  }
}
