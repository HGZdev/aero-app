import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === "build" ? "/aero-app/" : "/",
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
}));
