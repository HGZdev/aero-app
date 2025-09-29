# Aero App - Flight Tracking Dashboard

A modern React application for tracking and visualizing live flight data using the OpenSky API.

## Features

- **Live Flight Tracking**: Real-time flight data from OpenSky API
- **Interactive Dashboard**: Charts and statistics for flight analytics
- **Map Visualization**: Geographic view of flights
- **Comprehensive Error Handling**: Robust error management with retry mechanisms
- **Mock Data Support**: Development and testing with realistic mock data
- **Configurable Auto-refresh**: Optional automatic data updates
- **Caching System**: Efficient data caching with localStorage
- **Domain-Driven Design**: Clean architecture with separation of concerns

## Quick Start

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd aero-app
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp env.example .env
   ```

   Configure your environment variables:

   - `VITE_REFRESH_RUN=true` - Enable auto-refresh (optional)
   - `VITE_USE_MOCK_DATA=true` - Use mock data for development

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Variables

| Variable              | Description             | Default | Options               |
| --------------------- | ----------------------- | ------- | --------------------- |
| `VITE_REFRESH_RUN`    | Enable auto-refresh     | `false` | `true`/`false`        |
| `VITE_USE_MOCK_DATA`  | Use mock data           | `true`  | `true`/`false`        |
| `VITE_MOCK_DATA_TYPE` | Mock data set           | `all`   | `all`/`europe`/`asia` |
| `VITE_ENABLE_LOGGING` | Enable detailed logging | `true`  | `true`/`false`        |

## Auto-Refresh Configuration

The application supports configurable auto-refresh functionality:

- **Enabled**: Set `VITE_REFRESH_RUN=true` in your environment
- **Disabled**: Set `VITE_REFRESH_RUN=false` or leave empty
- **Manual Refresh**: Always available via the refresh button

When auto-refresh is enabled:

- Data updates every 5 minutes automatically
- Visual indicator shows "🔄 Auto-refresh" status
- Reduces manual intervention for live monitoring

## Architecture

The application follows Domain-Driven Design (DDD) principles:

```
src/
├── domain/           # Business logic and entities
│   ├── flight/       # Flight domain
│   ├── analytics/    # Analytics domain
│   └── shared/       # Shared types and utilities
├── application/      # Use cases and DTOs
│   ├── use-cases/    # Business use cases
│   └── dtos/         # Data transfer objects
├── infrastructure/   # External services and repositories
│   ├── api/          # API implementations
│   ├── services/     # Domain services
│   ├── mocks/        # Mock data and services
│   └── di/           # Dependency injection
└── presentation/     # React components and hooks
    ├── components/   # Reusable UI components
    ├── pages/        # Page components
    └── hooks/        # Custom React hooks
```

## Error Handling

The application includes comprehensive error handling:

- **Error Boundaries**: Catch and handle React component errors
- **Retry Mechanisms**: Automatic retry for transient failures
- **User-Friendly Messages**: Clear error messages for users
- **Logging**: Detailed error logging for debugging
- **Fallback Strategies**: Graceful degradation when services fail

## Mock Data System

For development and testing, the application includes:

- **Realistic Mock Data**: 15+ sample flights with real coordinates
- **Configurable Datasets**: Different data sets (all, europe, asia)
- **Mock Services**: Complete mock implementations of repositories
- **Easy Switching**: Toggle between mock and real data

## API Integration

- **OpenSky API**: Primary data source for flight information
- **Rate Limiting**: Built-in rate limiting to respect API limits
- **Caching**: Intelligent caching to reduce API calls
- **Error Recovery**: Graceful handling of API failures

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Strict Mode**: Enhanced error detection

## Deployment

The application is configured for GitHub Pages deployment:

- **Base Path**: `/aero-app/` for production builds
- **404 Handling**: Automatic redirect for client-side routing
- **Asset Optimization**: Optimized builds for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
