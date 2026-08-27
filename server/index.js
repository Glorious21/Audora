/**
 * Audora — Express backend (single codebase).
 *
 * The React UI lives at the repo root (index.html + src/); this server exposes
 * the JSON API and, once `npm run build` has produced dist/, serves the built
 * UI too. The delegate key is read from .env here and NEVER sent to the browser.
 *
 *   GET  /api/health               → relayer health
 *   POST /api/memories             → capture a piece of work as one memory
 *   GET  /api/memories/status/:id  → poll a remember job
 *   GET  /api/memories/search?q=   → natural-language recall
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";

import { getMemWal, NAMESPACE, withRetry, WORK_TYPES, STAGES } from "./lib/memwal.js";
import { memoriesRouter } from "./routes/memories.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");
// In dev the Vite server on :5173 owns the UI; don't also serve a stale dist/.
const hasBuiltUI =
  process.env.AUDORA_DEV !== "1" && fs.existsSync(path.join(DIST_DIR, "index.html"));

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  if (req.url.startsWith("/api")) console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// ── API ────────────────────────────────────────────────────────────────────
app.get("/api", (_req, res) => {
  res.json({
    service: "Audora API",
    namespace: NAMESPACE,
    ok: true,
    endpoints: [
      "GET  /api/health",
      "POST /api/memories",
      "GET  /api/memories/status/:jobId",
      "GET  /api/memories/search?q=...",
    ],
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    const memwal = getMemWal();
    const health = await withRetry(() => memwal.health(), { label: "health", tries: 3 });
    const acct = process.env.MEMWAL_ACCOUNT_ID || "";
    res.json({
      ok: health.status === "ok",
      namespace: NAMESPACE,
      relayer: process.env.MEMWAL_SERVER_URL || "(default)",
      // account object ID is a public Sui object id; masked middle for display
      account: acct,
      accountMasked: acct ? `${acct.slice(0, 8)}…${acct.slice(-6)}` : null,
      writeReady: health.write_ready ?? null,
      relayerVersion: health.relayerVersion ?? health.version,
      workTypes: WORK_TYPES,
      stages: STAGES,
    });
  } catch (err) {
    console.error("GET /api/health failed:", err);
    res.status(502).json({ ok: false, error: err.message });
  }
});

app.use("/api/memories", memoriesRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "not found" }));

// ── UI ─────────────────────────────────────────────────────────────────────
if (hasBuiltUI) {
  app.use(express.static(DIST_DIR));
  // SPA fallback — every non-API route renders the client shell.
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(DIST_DIR, "index.html")));
} else {
  app.get("/", (_req, res) =>
    res
      .type("text/plain")
      .send("Audora API is running. Start the UI with `npm run dev` (or build it with `npm run build`)."),
  );
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n  Audora API   →  http://localhost:${PORT}`);
  console.log(`  namespace    →  ${NAMESPACE}`);
  console.log(`  relayer      →  ${process.env.MEMWAL_SERVER_URL || "(default)"}`);
  console.log(`  UI           →  ${hasBuiltUI ? `served from dist/ at http://localhost:${PORT}` : "run `npm run dev` for the Vite dev server on :5173"}\n`);
  try {
    getMemWal();
  } catch (err) {
    console.error("  ⚠  ", err.message, "\n");
  }
});
