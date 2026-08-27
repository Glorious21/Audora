import { motion } from "framer-motion";
import Icon from "./Icon";
import { TYPE_GLYPH } from "../lib/format";

/** Compact list of what's been captured this session — fills the left rail
 *  and doubles as quick "recall this" shortcuts. */
export default function SessionList({ captures, onRecall }) {
  if (!captures.length) return null;

  return (
    <section className="panel" style={{ padding: 16 }}>
      <div className="kicker" style={{ marginBottom: 10 }}>
        Captured this session · {captures.length}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {captures.map((c) => (
          <motion.div
            key={c.job_id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: "var(--radius-sm)",
              background: "var(--panel-2)",
              border: "1px solid var(--line)",
            }}
          >
            <span style={{ fontSize: 14, color: "var(--amber)" }}>
              {TYPE_GLYPH[c.fields?.type] || "◆"}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 550,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {c.fields?.title || "—"}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10.5,
                  color: c.finalized ? "var(--green)" : "var(--text-3)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {c.blob_id ? `blob ${c.blob_id.slice(0, 14)}…` : `job ${c.job_id.slice(0, 10)}… · finalizing`}
              </div>
            </div>
            <button
              onClick={() => onRecall?.(c.fields?.title)}
              title="recall this"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                padding: "5px 9px",
                borderRadius: 7,
                border: "1px solid var(--line)",
                background: "none",
                color: "var(--text-2)",
                cursor: "pointer",
              }}
            >
              <Icon name="search" size={11} />
              recall
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
