import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    open: "/index.html",
    port: 3000,
    hmr: {
      overlay: true,
    },
  },
});
