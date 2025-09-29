/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENSKY_API_URL?: string;
  readonly VITE_REFRESH_RUN?: string;
  readonly VITE_USE_MOCK_DATA?: string;
  readonly VITE_MOCK_DATA_TYPE?: string;
  readonly VITE_ENABLE_LOGGING?: string;
  readonly VITE_CACHE_DURATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
