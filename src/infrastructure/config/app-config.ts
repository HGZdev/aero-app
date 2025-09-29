// Configuration for switching between mock and real data
export interface AppConfig {
  useMockData: boolean;
  mockDataType:
    | "all"
    | "europe"
    | "asia"
    | "busy"
    | "empty"
    | "high-altitude"
    | "low-altitude"
    | "mixed";
  apiDelay: number; // Simulated delay for mock data
  enableLogging: boolean;
  cacheEnabled: boolean;
  cacheTTL: number; // Time to live in milliseconds
}

export const defaultConfig: AppConfig = {
  useMockData: false, // Set to true for development/testing
  mockDataType: "all",
  apiDelay: 500,
  enableLogging: true,
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
};

// Environment-based configuration
export const getConfig = (): AppConfig => {
  // Check environment variables first
  const envUseMockData = import.meta.env.VITE_USE_MOCK_DATA;
  const envMockDataType = import.meta.env.VITE_MOCK_DATA_TYPE as
    | "all"
    | "europe"
    | "asia"
    | "busy"
    | "empty"
    | "high-altitude"
    | "low-altitude"
    | "mixed";
  const envEnableLogging = import.meta.env.VITE_ENABLE_LOGGING;

  // Use environment variables if available, otherwise fall back to mode-based config
  const isDevelopment = import.meta.env.DEV;
  const isTest = import.meta.env.MODE === "test";

  if (isTest) {
    return {
      ...defaultConfig,
      useMockData:
        envUseMockData !== undefined ? envUseMockData === "true" : true,
      mockDataType: envMockDataType || "europe",
      apiDelay: 100, // Faster for tests
      enableLogging:
        envEnableLogging !== undefined ? envEnableLogging === "true" : false,
    };
  }

  if (isDevelopment) {
    return {
      ...defaultConfig,
      useMockData:
        envUseMockData !== undefined ? envUseMockData === "true" : true,
      mockDataType: envMockDataType || "all",
      enableLogging:
        envEnableLogging !== undefined ? envEnableLogging === "true" : true,
    };
  }

  // Production
  return {
    ...defaultConfig,
    useMockData:
      envUseMockData !== undefined ? envUseMockData === "true" : false,
    mockDataType: envMockDataType || "all",
    enableLogging:
      envEnableLogging !== undefined ? envEnableLogging === "true" : false,
  };
};

// Runtime configuration override
let runtimeConfig: Partial<AppConfig> = {};

export const setConfig = (config: Partial<AppConfig>): void => {
  runtimeConfig = { ...runtimeConfig, ...config };
};

export const getRuntimeConfig = (): AppConfig => {
  return { ...getConfig(), ...runtimeConfig };
};

// Helper functions
export const isMockMode = (): boolean => {
  return getRuntimeConfig().useMockData;
};

export const getMockDataType = ():
  | "all"
  | "europe"
  | "asia"
  | "busy"
  | "empty"
  | "high-altitude"
  | "low-altitude"
  | "mixed" => {
  return getRuntimeConfig().mockDataType;
};

export const getApiDelay = (): number => {
  return getRuntimeConfig().apiDelay;
};

export const isLoggingEnabled = (): boolean => {
  return getRuntimeConfig().enableLogging;
};

export const isCacheEnabled = (): boolean => {
  return getRuntimeConfig().cacheEnabled;
};

export const getCacheTTL = (): number => {
  return getRuntimeConfig().cacheTTL;
};
