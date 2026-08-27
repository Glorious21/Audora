/**
 * /api/memories — capture the context around a piece of creative work as one
 * Walrus Memory, and recall it later with a natural-language query.
 */
import { Router } from "express";
import {
  getMemWal,
  formatMemory,
  withRetry,
  pollRememberJob,
  WORK_TYPES,
  STAGES,
} from "../lib/memwal.js";

export const memoriesRouter = Router();

/**
 * POST /api/memories
 * body: { title, type, date, tags, status, bpm, key, location, notes }
 *
 * Formats the fields into the canonical memory sentence, stores it via
 * remember(), then polls the job briefly. Always returns the job_id (proof of
 * storage); blob_id is included once the relayer finalizes.
 */
memoriesRouter.post("/", async (req, res) => {
  const body = req.body ?? {};
  const title = String(body.title ?? "").trim();

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  if (body.type && !WORK_TYPES.includes(body.type)) {
    return res.status(400).json({ error: `type must be one of: ${WORK_TYPES.join(", ")}` });
  }
  if (body.status && !STAGES.includes(body.status)) {
    return res.status(400).json({ error: `status must be one of: ${STAGES.join(", ")}` });
  }

  const fields = {
    title,
    type: body.type || "other",
    date: body.date || new Date().toISOString().slice(0, 10),
    tags: body.tags,
    status: body.status || "idea",
    bpm: body.bpm,
    key: body.key,
    location: body.location,
    notes: body.notes,
  };
  const memoryText = formatMemory(fields);

  try {
    const memwal = getMemWal();

    const accepted = await withRetry(() => memwal.remember(memoryText), {
      label: "remember",
    });

    // Short window for the relayer to finalize so the response can carry a
    // blob_id. If it's still working, the client polls /api/memories/status.
    const job = await pollRememberJob(accepted.job_id, {
      timeoutMs: 25_000,
      intervalMs: 2500,
    });

    return res.status(201).json({
      job_id: accepted.job_id,
      status: job.status,
      blob_id: job.blob_id ?? null,
      finalized: job.status === "done",
      namespace: job.namespace ?? undefined,
      fields,
      memoryText,
    });
  } catch (err) {
    console.error("POST /api/memories failed:", err);
    return res
      .status(502)
      .json({ error: "Failed to store memory in Walrus Memory", detail: err.message });
  }
});

/**
 * GET /api/memories/status/:jobId — poll a remember job until finalized.
 */
memoriesRouter.get("/status/:jobId", async (req, res) => {
  try {
    const memwal = getMemWal();
    const status = await withRetry(
      () => memwal.getRememberStatus(req.params.jobId),
      { label: "getRememberStatus", tries: 3 },
    );
    return res.json({
      job_id: status.job_id,
      status: status.status,
      blob_id: status.blob_id ?? null,
      finalized: status.status === "done",
      error: status.error ?? null,
    });
  } catch (err) {
    console.error("GET /api/memories/status failed:", err);
    return res.status(502).json({ error: "Failed to read job status", detail: err.message });
  }
});

/**
 * GET /api/memories/search?q=... — natural-language recall.
 */
memoriesRouter.get("/search", async (req, res) => {
  const query = String(req.query.q ?? "").trim();
  if (!query) {
    return res.status(400).json({ error: "query param q is required" });
  }

  try {
    const memwal = getMemWal();

    // The relayer occasionally returns an empty result set on a transient
    // hiccup rather than throwing. Retry a few times before trusting "nothing".
    let result;
    for (let attempt = 1; attempt <= 3; attempt++) {
      result = await withRetry(() => memwal.recall({ query, limit: 12 }), {
        label: "recall",
      });
      if (result.results.length > 0 || attempt === 3) break;
      await new Promise((r) => setTimeout(r, 1200));
    }

    return res.json({
      query,
      total: result.total ?? result.results.length,
      results: result.results.map((r) => ({
        text: r.text,
        distance: r.distance,
        relevance:
          typeof r.distance === "number"
            ? Math.max(0, Math.min(1, 1 - r.distance))
            : null,
        blob_id: r.blob_id,
        fields: parseMemory(r.text),
      })),
    });
  } catch (err) {
    console.error("GET /api/memories/search failed:", err);
    return res
      .status(502)
      .json({ error: "Failed to search Walrus Memory", detail: err.message });
  }
});

/** Pull structured fields back out of the canonical memory sentence. */
export function parseMemory(text = "") {
  const seg = (label, next) => {
    const re = new RegExp(`${label}:\\s*(.*?)\\s*(?:\\.\\s*${next}:|\\.?\\s*$)`, "s");
    const m = text.match(re);
    return m ? m[1].trim().replace(/^—$/, "") : "";
  };
  const head = text.match(/^\s*(.+?)\s+—\s+"(.*?)"\./s);
  const bpm = seg("Tempo", "Key").replace(/\s*BPM$/i, "").replace(/^—$/, "");
  return {
    type: head ? head[1].trim().toLowerCase() : "",
    title: head ? head[2].trim() : "",
    date: seg("Captured on", "Stage"),
    status: seg("Stage", "Tags"),
    tags: seg("Tags", "Tempo"),
    bpm,
    key: seg("Key", "Where it lives"),
    location: seg("Where it lives", "Context"),
    notes: seg("Context", "\\0"),
  };
}
