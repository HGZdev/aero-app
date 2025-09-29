// Factory for creating appropriate DI Container based on configuration
import { container } from "../di/container";
import { mockContainer } from "../mocks/mock-container";
import { isMockMode, getMockDataType } from "../config/app-config";

export interface DIContainerInterface {
  getFlightData(): any;
  getFlightStatistics(): any;
  refreshFlightData(): any;
  getFlightsByCountry(): any;
  getFlightsInBounds(): any;
  getCacheService(): any;
  getFlightRepository(): any;
  getStatisticsCalculator(): any;
}

export const createContainer = (): DIContainerInterface => {
  if (isMockMode()) {
    console.log(`🚀 Using Mock Data Container (${getMockDataType()})`);
    return mockContainer;
  } else {
    console.log("🌐 Using Real API Container");
    return container;
  }
};

// Export the appropriate container based on configuration
export const appContainer = createContainer();

// Utility function to switch between mock and real data at runtime
export const switchToMockData = (
  mockDataType:
    | "all"
    | "europe"
    | "asia"
    | "busy"
    | "empty"
    | "high-altitude"
    | "low-altitude"
    | "mixed" = "all"
): void => {
  console.log(`🔄 Switching to mock data (${mockDataType})`);
  // This would require re-initializing the app, but for now just log
  console.warn("Mock data switch requires app restart to take effect");
};

export const switchToRealData = (): void => {
  console.log("🔄 Switching to real API data");
  console.warn("Real data switch requires app restart to take effect");
};
