import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

/** Live relayer status — full hostname on desktop, compact word on mobile. */
export default function HealthPill({ onData }) {
  const [s, setS] = useState({ loading: true });

  useEffect(() => {
    let alive = true;
    const check = () =>
      api
        .health()
        .then((h) => {
          if (!alive) return;
          setS({ loading: false, ...h });
          onData?.(h);
        })
        .catch((e) => alive && setS({ loading: false, ok: false, error: e.message }));
    check();
    const t = setInterval(check, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [onData]);

  const color = s.loading
    ? "#6f7a8d"
    : !s.ok
      ? "var(--red)"
      : s.writeReady
        ? "var(--green)"
        : "var(--amber)";

  const host = (s.relayer || "").replace(/^https?:\/\//, "") || "relayer";
  const short = s.loading
    ? "connecting"
    : !s.ok
      ? "offline"
      : s.writeReady
        ? "online"
        : "read-only";
  const full = s.loading ? "connecting…" : !s.ok ? "relayer offline" : s.writeReady ? host : `${host} · read-only`;

  return (
    <span
      title={s.ok ? `Walrus Memory relayer · namespace ${s.namespace} · write_ready=${s.writeReady}` : s.error || ""}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 11px",
        borderRadius: 999,
        border: "1px solid var(--line)",
        background: "var(--panel-2)",
        fontSize: 12,
        color: "var(--text-2)",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-mono)",
        flexShrink: 0,
      }}
    >
      <motion.span
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <span className="hp-full">{full}</span>
      <span className="hp-short">{short}</span>
      <style>{`
        .hp-short { display: inline; }
        .hp-full { display: none; }
        @media (min-width: 680px) {
          .hp-short { display: none; }
          .hp-full { display: inline; }
        }
      `}</style>
    </span>
  );
}
