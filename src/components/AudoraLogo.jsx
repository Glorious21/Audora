/**
 * Audora logo — a rounded "ink" tile holding a waveform-into-recall-arc glyph:
 * three rising bars (capture) whose peak curves back on itself (recall).
 * Monochrome so it sits cleanly on the light UI; pass `tone="mono"` to render
 * it as a single currentColor shape (e.g. in a footer).
 */
export function AudoraMark({ size = 30, tone = "ink" }) {
  const mono = tone === "mono";
  const tile = mono ? "currentColor" : "var(--text)";
  const glyph = mono ? "var(--surface)" : "#ffffff";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Audora"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect x="0" y="0" width="32" height="32" rx="9" fill={tile} />
      {/* rising bars */}
      <g fill={glyph}>
        <rect x="7" y="18" width="3.4" height="7" rx="1.7" />
        <rect x="12.3" y="14" width="3.4" height="11" rx="1.7" />
      </g>
      {/* peak bar curving back — the recall arc */}
      <path
        d="M17.6 25V13.4a4.6 4.6 0 1 1 4.6 4.6h-2.2"
        fill="none"
        stroke={glyph}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AudoraLogo({ size = 30, wordmark = true, tone = "ink" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <AudoraMark size={size} tone={tone} />
      {wordmark && (
        <span
          style={{
            fontSize: size * 0.62,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          Audora
        </span>
      )}
    </span>
  );
}
