import path from "node:path";
import { lingui } from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/dungeonmix/",
  plugins: [
    react({
      plugins: [["@lingui/swc-plugin", {}]],
    }),
    lingui(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            handler: "StaleWhileRevalidate",
            urlPattern: /.*/,
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
