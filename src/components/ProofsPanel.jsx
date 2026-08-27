import { useState } from "react";
import Icon from "./Icon";
import { TYPE_GLYPH } from "../lib/format";

function Copyable({ value, short }) {
  const [copied, setCopied] = useState(false);
  if (!value) return <span style={{ color: "var(--text-3)" }}>—</span>;
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-2)",
        fontSize: 11.5,
        padding: 0,
      }}
      title={value}
    >
      <Icon name={copied ? "check" : "copy"} size={11} />
      {copied ? "copied" : short ? `${value.slice(0, 14)}…` : value}
    </button>
  );
}

export default function ProofsPanel({ captures }) {
  return (
    <section className="panel">
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
        <div className="kicker">On-chain proofs</div>
        <div style={{ marginTop: 4, fontSize: 15, fontWeight: 650 }}>
          Everything captured this session
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>
          Each memory is a Walrus blob registered to your account. The{" "}
          <span className="mono">job_id</span> is returned on write; the{" "}
          <span className="mono">blob_id</span> once the relayer finalizes.
        </div>
      </div>

      {captures.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
          <div
            style={{
              width: 52,
              height: 52,
              margin: "0 auto 12px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "var(--accent)",
              border: "1px solid var(--accent-tint)",
              background: "var(--accent-dim)",
            }}
          >
            <Icon name="shield" size={22} stroke={1.7} />
          </div>
          No writes yet. Capture a memory or run the 2-minute demo.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 640 }}>
            <thead>
              <tr style={{ color: "var(--text-3)", textAlign: "left" }}>
                {["", "Memory", "job_id", "blob_id", "status"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 600, borderBottom: "1px solid var(--line)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {captures.map((c) => (
                <tr key={c.job_id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", color: "var(--amber)", fontSize: 14 }}>
                    {TYPE_GLYPH[c.fields?.type] || "◆"}
                  </td>
                  <td style={{ padding: "12px 14px", color: "var(--text)", fontWeight: 550 }}>
                    {c.fields?.title || "—"}
                    {c.fields?.type && (
                      <span style={{ color: "var(--text-3)", fontWeight: 400 }}> · {c.fields.type}</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Copyable value={c.job_id} short />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Copyable value={c.blob_id} short />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        padding: "2px 7px",
                        borderRadius: 5,
                        color: c.finalized ? "var(--green)" : "var(--accent)",
                        background: c.finalized ? "var(--green-dim)" : "var(--accent-dim)",
                      }}
                    >
                      {c.finalized ? "done" : c.status || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
