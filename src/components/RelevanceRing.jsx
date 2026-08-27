import { motion } from "framer-motion";

/** Circular % match indicator that draws itself in. */
export default function RelevanceRing({ value = 0, size = 44 }) {
  const pct = Math.round((value || 0) * 100);
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const hue = pct >= 55 ? "var(--green)" : pct >= 35 ? "var(--accent)" : "var(--text-3)";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={3} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={hue}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11.5,
          fontWeight: 700,
          color: hue,
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-mono)",
        }}
      >
        {pct}
      </div>
    </div>
  );
}
