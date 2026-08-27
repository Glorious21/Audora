import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single codebase: the React UI lives at the repo root (index.html + src/),
// the Express API lives in server/. In dev, Vite serves the UI on :5173 and
// proxies /api → the Express backend on :3001 so the browser only ever talks
// to one origin and the MemWal delegate key never reaches the frontend.
// In prod, `npm run build` emits dist/ and Express serves it.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
