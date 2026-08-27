/**
 * Dev entrypoint — Vite on :5173 owns the UI in development, so tell the API
 * to skip serving any (stale) dist/ build and just expose the JSON endpoints.
 */
process.env.AUDORA_DEV = "1";
await import("./index.js");
