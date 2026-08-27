import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../api";
import Icon from "./Icon";
import MemoryCard from "./MemoryCard";

const EXAMPLES = [
  "the amapiano idea with the vocal chop from that late session",
  "lyrics about leaving Lagos",
  "dark trap beat with the piano, no drums yet",
  "voice note where I hummed a chorus in the car",
];

export default function RecallPanel({ pendingQuery, onConsumeQuery }) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function run(query) {
    const term = (query ?? q).trim();
    if (!term || busy) return;
    setQ(term);
    setBusy(true);
    setError(null);
    try {
      setData(await api.recall(term));
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setBusy(false);
    }
  }

  // a capture's title can be pushed in from the left panel
  useEffect(() => {
    if (pendingQuery) {
      run(pendingQuery);
      onConsumeQuery?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuery]);

  return (
    <section className="panel" style={{ display: "flex", flexDirection: "column", minHeight: 520 }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
        <div className="kicker">Recall</div>
        <div style={{ marginTop: 4, fontSize: 15, fontWeight: 650 }}>Find it by meaning</div>
        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>
          Describe the memory the way you'd remember it — not the filename.
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          style={{ marginTop: 12 }}
        >
          <motion.div
            animate={{
              borderColor: focus ? "var(--accent)" : "var(--line-strong)",
              boxShadow: focus ? "0 0 0 3px var(--accent-ring)" : "0 0 0 0 transparent",
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 5px 5px 12px",
              borderRadius: 12,
              border: "1px solid var(--line-strong)",
              background: "var(--surface)",
            }}
          >
            <span style={{ color: focus ? "var(--accent)" : "var(--text-3)" }}>
              <Icon name="search" size={17} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              placeholder="describe it…"
              style={{
                flex: 1,
                minWidth: 0,
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text)",
                fontFamily: "var(--font-ui)",
                fontSize: 14,
                padding: "9px 0",
              }}
            />
            <motion.button
              type="submit"
              disabled={busy || !q.trim()}
              whileTap={{ scale: 0.96 }}
              className="btn btn-primary"
              style={{ padding: "9px 16px", fontSize: 13 }}
            >
              {busy ? "searching" : "recall"}
              {!busy && <Icon name="arrowRight" size={14} stroke={2.2} />}
            </motion.button>
          </motion.div>
        </form>
      </div>

      <div style={{ padding: 18, flex: 1, overflowY: "auto" }}>
        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--red-dim)",
              border: "1px solid var(--red-border)",
              color: "var(--red)",
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        {busy && (
          <div style={{ display: "grid", gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                style={{ height: 104, borderRadius: "var(--radius)", background: "var(--panel-2)", border: "1px solid var(--line)" }}
              />
            ))}
          </div>
        )}

        {!busy && !data && (
          <div style={{ textAlign: "center", padding: "40px 10px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 14px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "var(--accent)",
                border: "1px solid var(--accent-tint)",
                background: "var(--accent-dim)",
              }}
            >
              <Icon name="memory" size={24} stroke={1.7} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 650 }}>Ready to recall</div>
            <p style={{ margin: "6px auto 16px", maxWidth: 320, fontSize: 13, color: "var(--text-3)" }}>
              Your vault is semantic. Ask for a vibe, a moment, a half-remembered
              line — Walrus Memory returns the closest matches.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, maxWidth: 380, margin: "0 auto" }}>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => run(ex)}
                  style={{
                    fontSize: 12.5,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--panel-2)",
                    border: "1px solid var(--line)",
                    color: "var(--text-2)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ color: "var(--text-3)" }}>“</span>
                  {ex}
                  <span style={{ color: "var(--text-3)" }}>”</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {data && !busy && (
            <motion.div key={data.query} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 12, fontFamily: "var(--font-mono)" }}>
                {data.results.length} {data.results.length === 1 ? "match" : "matches"} · “{data.query}”
              </div>

              {data.results.length === 0 ? (
                <div
                  style={{
                    padding: "26px 18px",
                    textAlign: "center",
                    borderRadius: "var(--radius)",
                    border: "1px dashed var(--line-strong)",
                    color: "var(--text-2)",
                    fontSize: 13,
                  }}
                >
                  Nothing came back. Capture a few memories, or describe it more loosely.
                </div>
              ) : (
                <motion.div
                  variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                  initial="hidden"
                  animate="show"
                  style={{ display: "grid", gap: 12 }}
                >
                  {data.results.map((r, i) => (
                    <MemoryCard key={r.blob_id || i} result={r} rank={i} />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
