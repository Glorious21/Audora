import { useState } from "react";
import { motion } from "framer-motion";
import RelevanceRing from "./RelevanceRing";
import Icon from "./Icon";
import { STAGE_HUE, TYPE_GLYPH, relativeDate, splitTags } from "../lib/format";

const cardV = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function MemoryCard({ result, rank }) {
  const f = result.fields || {};
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const top = rank === 0;

  const meta = [
    f.status,
    f.date && relativeDate(f.date),
    f.bpm && `${f.bpm} BPM`,
    f.key,
  ].filter(Boolean);

  const copyBlob = () => {
    navigator.clipboard?.writeText(result.blob_id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <motion.article
      variants={cardV}
      whileHover={{ y: -2 }}
      style={{
        position: "relative",
        borderRadius: "var(--radius)",
        padding: "16px",
        background: top ? "linear-gradient(180deg, var(--accent-dim), var(--surface))" : "var(--surface)",
        border: `1px solid ${top ? "var(--accent-tint)" : "var(--line)"}`,
        boxShadow: top ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: top ? "var(--amber)" : "var(--text-3)",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13 }}>{TYPE_GLYPH[f.type] || "◆"}</span>
            {f.type || "memory"}
            {top && <span style={{ marginLeft: 6, color: "var(--amber)" }}>· best match</span>}
          </div>

          <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 650, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
            {f.title || "Untitled"}
          </h3>
        </div>

        <RelevanceRing value={result.relevance ?? 0} />
      </div>

      {meta.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 11 }}>
          {meta.map((m, i) => (
            <span
              key={i}
              style={{
                fontSize: 11.5,
                padding: "3px 8px",
                borderRadius: 6,
                background: "var(--panel-2)",
                border: "1px solid var(--line)",
                color: i === 0 && f.status ? STAGE_HUE[f.status] || "var(--text-2)" : "var(--text-2)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      )}

      {splitTags(f.tags).length > 0 && (
        <div style={{ marginTop: 9, fontSize: 12.5, color: "var(--text-3)" }}>
          {splitTags(f.tags).map((t, i) => (
            <span key={i}>
              {i > 0 && " · "}
              {t}
            </span>
          ))}
        </div>
      )}

      {f.notes && (
        <p style={{ margin: "11px 0 0", fontSize: 13.5, color: "var(--text)", lineHeight: 1.6 }}>
          {f.notes}
        </p>
      )}

      {f.location && (
        <div style={{ marginTop: 9, fontSize: 12, color: "var(--text-3)" }}>
          lives in — <span style={{ color: "var(--text-2)" }}>{f.location}</span>
        </div>
      )}

      <div
        style={{
          marginTop: 13,
          paddingTop: 11,
          borderTop: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: "var(--text-3)",
        }}
      >
        <span>distance {result.distance?.toFixed?.(3)}</span>
        <button
          onClick={copyBlob}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            font: "inherit",
            padding: 0,
          }}
        >
          <Icon name={copied ? "check" : "shield"} size={12} />
          {copied ? "blob id copied" : `blob ${(result.blob_id || "").slice(0, 12)}…`}
        </button>
        <button
          onClick={() => setShowRaw((v) => !v)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-3)",
            font: "inherit",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          {showRaw ? "hide" : "raw memory"}
        </button>
      </div>

      {showRaw && (
        <p
          style={{
            margin: "9px 0 0",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text-3)",
            background: "var(--bg-deep)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 12px",
            fontFamily: "var(--font-mono)",
          }}
        >
          {result.text}
        </p>
      )}
    </motion.article>
  );
}
