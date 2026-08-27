import { useState } from "react";
import Icon from "./Icon";

function Field({ label, value, mono = true, copyable }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <span className="kicker" style={{ letterSpacing: "0.1em" }}>
        {label}
      </span>
      <span
        className={mono ? "mono" : undefined}
        style={{
          color: "var(--text-2)",
          fontSize: 12.5,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value || "—"}
      </span>
      {copyable && value && (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-3)",
            display: "inline-flex",
            padding: 0,
          }}
        >
          <Icon name={copied ? "check" : "copy"} size={12} />
        </button>
      )}
    </div>
  );
}

export default function AccountStrip({ health }) {
  const h = health || {};
  return (
    <div style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-deep)" }}>
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "9px 20px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <Field
          label="Registered account"
          value={h.account || h.accountMasked}
          copyable
        />
        <span style={{ color: "var(--line-strong)" }}>|</span>
        <Field label="Namespace" value={h.namespace || "audora-demo"} />
        <span style={{ color: "var(--line-strong)" }}>|</span>
        <Field
          label="Delegate key"
          value="relayer-managed (x-seal-session)"
          mono={false}
        />
        <div style={{ flex: 1 }} />
        <span
          className="mono"
          style={{ fontSize: 11.5, color: "var(--text-3)", whiteSpace: "nowrap" }}
        >
          relayer v{h.relayerVersion || "—"}
        </span>
      </div>
    </div>
  );
}
