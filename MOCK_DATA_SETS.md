# Mock Data Sets - Example Data Sets

The Aero Dashboard application contains various mock data sets for testing different scenarios. Each set simulates different airspace conditions and allows testing of different application functionalities.

## Available Data Sets

### 1. `all` - Complete Data Set

**Description:** Complete set with flights from different regions around the world

- **Number of flights:** 15
- **Regions:** Europe, Asia, North America, Australia
- **Altitudes:** 25,000 - 41,000 feet
- **Speeds:** 720 - 920 km/h
- **Usage:** Testing basic functionalities with realistic data

### 2. `europe` - European Flights

**Description:** Flights only from European countries

- **Number of flights:** 7
- **Countries:** Ireland, UK, France, Germany, Netherlands, Sweden, Switzerland
- **Altitudes:** 25,000 - 41,000 feet
- **Speeds:** 750 - 920 km/h
- **Usage:** Testing filtering by regions, European traffic analysis

### 3. `asia` - Asian Flights

**Description:** Flights only from Asian countries

- **Number of flights:** 3
- **Countries:** Japan, Singapore, Thailand
- **Altitudes:** 26,000 - 39,000 feet
- **Speeds:** 720 - 860 km/h
- **Usage:** Testing Asian traffic, differences in flight altitudes

### 4. `busy` - Busy Airspace

**Description:** Many flights concentrated in a small area (London)

- **Number of flights:** 8
- **Location:** All flights around London (51.5074, -0.1278)
- **Altitudes:** 32,000 - 39,000 feet (different levels)
- **Speeds:** 790 - 930 km/h
- **Usage:** Testing performance with many flights in one place, map testing

### 5. `empty` - Empty Airspace

**Description:** No flights in the airspace

- **Number of flights:** 0
- **Usage:** Testing empty states, "no data" messages, UI without data

### 6. `high-altitude` - High Altitude Flights

**Description:** Only flights above 35,000 feet

- **Number of flights:** 4
- **Altitudes:** 36,000 - 41,000 feet
- **Speeds:** 780 - 920 km/h
- **Usage:** Testing long-haul flights, high altitude analysis

### 7. `low-altitude` - Low Altitude Flights

**Description:** Only flights below 30,000 feet

- **Number of flights:** 4
- **Altitudes:** 25,000 - 29,000 feet
- **Speeds:** 720 - 890 km/h
- **Usage:** Testing regional, short-distance flights

### 8. `mixed` - Mixed Scenario

**Description:** Combination of different types of flights and operations

- **Number of flights:** 8
- **Flight types:**
  - Long-haul flights (40,000+ feet)
  - Regional flights (30,000 feet)
  - Short-distance flights (25,000 feet)
  - Ground operations (0 feet)
- **Usage:** Testing different scenarios in one set

## Configuration

### Through Environment Variables

```bash
# In .env file
VITE_USE_MOCK_DATA=true
VITE_MOCK_DATA_TYPE=busy  # Choose data set
```

### Through Code

```typescript
import { switchToMockData } from "./infrastructure/factory/container-factory";

// Switch to busy airspace
switchToMockData("busy");

// Switch to empty airspace
switchToMockData("empty");
```

## Test Scenarios

### 1. Performance Testing

- **Set:** `busy` - testing with many flights in one place
- **Goal:** Checking map and chart performance

### 2. Empty State Testing

- **Set:** `empty` - no flights
- **Goal:** Checking "no data" messages, UI without data

### 3. Filtering Testing

- **Sets:** `europe`, `asia` - different regions
- **Goal:** Checking filtering by countries/regions

### 4. Altitude Analysis Testing

- **Sets:** `high-altitude`, `low-altitude`
- **Goal:** Checking analysis of different flight levels

### 5. Diversity Testing

- **Set:** `mixed` - different flight types
- **Goal:** Checking handling of different flight scenarios

## Usage Examples

### Testing Map

```bash
# Set busy airspace
VITE_MOCK_DATA_TYPE=busy
```

### Testing Charts

```bash
# Set flights at different altitudes
VITE_MOCK_DATA_TYPE=mixed
```

### Testing Error Messages

```bash
# Set empty airspace
VITE_MOCK_DATA_TYPE=empty
```

### Testing Filtering

```bash
# Set only European flights
VITE_MOCK_DATA_TYPE=europe
```

## Data Structure

Each data set contains `FlightEntity` objects with the following fields:

- `icao24`: Unique flight identifier
- `callsign`: Aircraft call sign
- `originCountry`: Country of origin
- `position`: Geographic position (latitude, longitude)
- `altitude`: Flight altitude
- `velocity`: Speed
- `heading`: Flight direction
- `onGround`: Whether aircraft is on ground
- `lastContact`: Last contact with system

## Data Updates

Mock data is generated in real-time with `new Date()`, so:

- `lastContact` always shows current time
- Data is "fresh" on every refresh
- Simulates real API behavior

## Extending

To add a new data set:

1. Add new data to `src/infrastructure/mocks/data/flight-data.ts`
2. Update types in `src/infrastructure/config/app-config.ts`
3. Add handling in `src/infrastructure/mocks/repositories.ts`
4. Update documentation

Example:

```typescript
// In flight-data.ts
export const mockFlightsCustom: FlightEntity[] = [
  // Your data...
];

// In app-config.ts
mockDataType: "all" | "europe" | "asia" | "busy" | "empty" | "high-altitude" | "low-altitude" | "mixed" | "custom";

// In repositories.ts
case "custom":
  this.flights = mockFlightsCustom;
  break;
```
