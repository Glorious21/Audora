import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon";

function Row({ label, value, canCopy }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
      <span style={{ width: 68, flexShrink: 0, color: "var(--text-3)", fontSize: 11 }}>{label}</span>
      <span
        className="mono"
        style={{ flex: 1, minWidth: 0, wordBreak: "break-all", fontSize: 12, color: "var(--text)" }}
      >
        {value}
      </span>
      {canCopy && (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-3)",
            fontSize: 11,
          }}
        >
          <Icon name={copied ? "check" : "copy"} size={11} />
          {copied ? "copied" : "copy"}
        </button>
      )}
    </div>
  );
}

export default function StoredReceipt({ result }) {
  const done = result.finalized;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: "var(--radius)",
        border: `1px solid ${done ? "rgba(22,163,74,0.35)" : "var(--accent-tint)"}`,
        background: `linear-gradient(180deg, ${done ? "var(--green-dim)" : "var(--accent-dim)"}, var(--surface))`,
        padding: 15,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 650,
          fontSize: 13,
          marginBottom: 11,
          color: done ? "var(--green)" : "var(--accent-strong)",
        }}
      >
        <Icon name={done ? "check" : "clock"} size={15} stroke={2.2} />
        {done ? "Stored on Walrus" : "Accepted — relayer finalizing"}
      </div>

      <div style={{ display: "grid", gap: 7 }}>
        <Row label="job_id" value={result.job_id} canCopy />
        <Row label="blob_id" value={result.blob_id || "writing to Walrus…"} canCopy={!!result.blob_id} />
        <Row label="status" value={result.status} />
        <Row label="namespace" value={result.namespace || "audora-demo"} />
      </div>

      <div className="kicker" style={{ marginTop: 11, marginBottom: 5, letterSpacing: "0.1em" }}>
        exact memory stored
      </div>
      <p
        className="mono"
        style={{
          margin: 0,
          fontSize: 11.5,
          lineHeight: 1.6,
          color: "var(--text-2)",
          background: "var(--bg-deep)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 12px",
        }}
      >
        {result.memoryText}
      </p>
    </motion.div>
  );
}
