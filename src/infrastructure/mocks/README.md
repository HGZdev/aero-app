# Mock Data Documentation

This folder contains mock data and implementations for development and testing purposes.

## Structure

```
src/infrastructure/mocks/
├── data/
│   └── flight-data.ts          # Mock flight data
├── repositories.ts             # Mock repository implementations
├── mock-container.ts           # Mock DI container
└── README.md                   # This file

src/infrastructure/config/
└── app-config.ts               # Configuration for mock/real data switching

src/infrastructure/factory/
└── container-factory.ts        # Factory for creating appropriate container
```

## Mock Data

### Flight Data (`flight-data.ts`)

Contains realistic mock flight data including:

- **15 sample flights** from different countries
- **Realistic coordinates** for major cities
- **Varied altitudes** (25,000 - 41,000 feet)
- **Different speeds** (720 - 920 km/h)
- **Various headings** and flight patterns

### Data Sets

- `mockFlights` - All 15 flights
- `mockFlightsEurope` - European flights only
- `mockFlightsAsia` - Asian flights only
- `mockFlightsHighAltitude` - Flights above 35,000 ft
- `mockFlightsLowAltitude` - Flights below 30,000 ft

## Mock Implementations

### MockFlightRepository

Simulates the OpenSky API with:

- **Configurable delay** (default 500ms)
- **All repository methods** implemented
- **Utility methods** for testing (addFlight, removeFlight, etc.)

### MockCacheService

In-memory cache implementation for testing:

- **Map-based storage**
- **TTL support**
- **Utility methods** for inspection

### MockDIContainer

Complete mock dependency injection container:

- **All use cases** implemented
- **Configurable data sets**
- **Testing utilities**

## Configuration

### Environment-based Configuration

```typescript
// Development
useMockData: true;
mockDataType: "all";

// Test
useMockData: true;
mockDataType: "europe";
apiDelay: 100;

// Production
useMockData: false;
```

### Runtime Configuration

```typescript
import { setConfig } from "./config/app-config";

// Switch to mock data
setConfig({ useMockData: true, mockDataType: "europe" });

// Switch to real data
setConfig({ useMockData: false });
```

## Usage Examples

### Using Mock Data in Development

```typescript
import { appContainer } from "./factory/container-factory";

// Automatically uses mock data in development
const flights = await appContainer.getFlightData().execute();
```

### Testing with Specific Data Sets

```typescript
import { MockDIContainer } from "./mocks/mock-container";

const mockContainer = MockDIContainer.getInstance("europe");
const flights = await mockContainer.getFlightData().execute();
```

### Adding Custom Test Data

```typescript
const mockRepo = mockContainer.getMockFlightRepository();
mockRepo.addFlight(customFlight);
mockRepo.setDelay(1000); // Simulate slow network
```

## Benefits

1. **No API Dependencies** - Work offline
2. **Consistent Data** - Same data every time
3. **Fast Testing** - No network delays
4. **Controlled Scenarios** - Test edge cases
5. **Development Speed** - No rate limiting
6. **Reliable CI/CD** - Tests don't depend on external services

## Switching Between Mock and Real Data

The application automatically switches based on:

- **Environment** (development/test/production)
- **Configuration** (app-config.ts)
- **Runtime settings** (setConfig)

To force mock data in any environment:

```typescript
setConfig({ useMockData: true });
```

To force real data:

```typescript
setConfig({ useMockData: false });
```
