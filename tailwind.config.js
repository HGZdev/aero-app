import { defineConfig } from "@tailwindcss/vite";

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "aero-blue": "#3B82F6",
        "aero-dark": "#1E40AF",
        "aero-light": "#60A5FA",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
});
