import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { motion } from "framer-motion";

import { api } from "../api";
import Icon from "./Icon";
import StoredReceipt from "./StoredReceipt";
import { WORK_TYPES, STAGES } from "../lib/format";

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = {
  title: "",
  type: "beat",
  status: "idea",
  date: today(),
  tags: "",
  bpm: "",
  key: "",
  location: "",
  notes: "",
};

export default function CapturePanel({ onCaptured }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const musical = ["beat", "song", "sample"].includes(form.type);

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.capture(form);
      setResult(res);
      onCaptured?.(res);
      if (!res.finalized) poll(res.job_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function poll(jobId, n = 0) {
    if (n > 40) return;
    try {
      const s = await api.jobStatus(jobId);
      setResult((r) => (r && r.job_id === jobId ? { ...r, ...s } : r));
      onCaptured?.({ job_id: jobId, ...s });
      if (s.finalized || s.status === "failed") return;
    } catch {
      /* transient */
    }
    setTimeout(() => poll(jobId, n + 1), 4000);
  }

  function reset() {
    setForm({ ...EMPTY, date: today() });
    setResult(null);
    setError(null);
  }

  return (
    <section className="panel" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
        <div className="kicker">Capture</div>
        <div style={{ marginTop: 4, fontSize: 15, fontWeight: 650 }}>
          Save the context around a piece of work
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>
          One structured memory per idea. Stored & encrypted on Walrus.
        </div>
      </div>

      <div style={{ padding: 18 }}>
        {!result ? (
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <TextField
              label="Working title"
              size="small"
              value={form.title}
              onChange={set("title")}
              required
              fullWidth
              placeholder="Night Drive Loop"
            />

            <div style={{ display: "flex", gap: 10 }}>
              <TextField select label="Type" size="small" value={form.type} onChange={set("type")} fullWidth>
                {WORK_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label="Stage" size="small" value={form.status} onChange={set("status")} fullWidth>
                {STAGES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <TextField
                label="Date"
                type="date"
                size="small"
                value={form.date}
                onChange={set("date")}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: "1 1 150px" }}
              />
              {musical && (
                <>
                  <TextField label="BPM" type="number" size="small" value={form.bpm} onChange={set("bpm")} sx={{ width: 84 }} />
                  <TextField label="Key" size="small" value={form.key} onChange={set("key")} sx={{ width: 92 }} />
                </>
              )}
            </div>

            <TextField
              label="Tags / mood"
              size="small"
              value={form.tags}
              onChange={set("tags")}
              fullWidth
              placeholder="afrobeat, moody, night drive"
              helperText="comma-separated"
            />
            <TextField
              label="Where it lives"
              size="small"
              value={form.location}
              onChange={set("location")}
              fullWidth
              placeholder="Drive link, phone voice memo, Ableton project…"
            />
            <TextField
              label="Context — what's the story?"
              size="small"
              value={form.notes}
              onChange={set("notes")}
              fullWidth
              multiline
              minRows={3}
              placeholder="Made this after the session with Tolu. Hook isn't there yet but the chord movement is the whole vibe."
            />

            {error && (
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--red)",
                  background: "var(--red-dim)",
                  border: "1px solid var(--red-border)",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={busy || !form.title.trim()}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
              style={{
                marginTop: 2,
                width: "100%",
                padding: "13px 16px",
                fontSize: 14,
                fontWeight: 650,
              }}
            >
              {busy ? "Storing in Walrus Memory…" : "Store memory"}
            </motion.button>
          </form>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <StoredReceipt result={result} />
            <button
              onClick={reset}
              style={{
                padding: "11px 16px",
                borderRadius: 10,
                border: "1px solid var(--line-strong)",
                background: "var(--panel-2)",
                color: "var(--text)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Icon name="plus" size={14} stroke={2.2} />
              Capture another
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
