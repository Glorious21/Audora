import { motion } from "framer-motion";
import Icon from "./Icon";
import HealthPill from "./HealthPill";
import AudoraLogo from "./AudoraLogo";
import { Link } from "../lib/router";

/** Studio header — brand, live relayer status, seed-demo action. */
export default function TopBar({ onHealth, onRunDemo, demoRunning }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backdropFilter: "blur(10px)",
        background: "rgba(251, 251, 253, 0.82)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <AudoraLogo size={28} />
        </Link>

        <span
          className="mono"
          data-badge
          style={{
            display: "none",
            padding: "3px 9px",
            borderRadius: 7,
            border: "1px solid var(--line)",
            background: "var(--surface-2)",
            color: "var(--text-3)",
            fontSize: 11,
          }}
        >
          Studio
        </span>

        <div style={{ flex: 1 }} />

        <HealthPill onData={onHealth} />

        <motion.button
          onClick={onRunDemo}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          disabled={demoRunning}
          className="btn btn-ghost"
          style={{ padding: "8px 15px", fontSize: 13, opacity: demoRunning ? 0.7 : 1 }}
        >
          <Icon name="play" size={13} stroke={2} />
          <span className="demo-full">{demoRunning ? "Seeding…" : "Run 2-min demo"}</span>
          <span className="demo-short">{demoRunning ? "…" : "Demo"}</span>
        </motion.button>
      </div>

      <style>{`
        .demo-short { display: inline; }
        .demo-full { display: none; }
        @media (min-width: 560px) {
          .demo-short { display: none; }
          .demo-full { display: inline; }
        }
        @media (min-width: 760px){ [data-badge]{ display:inline-block !important; } }
      `}</style>
    </header>
  );
}
