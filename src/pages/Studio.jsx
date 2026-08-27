import { useCallback, useState } from "react";

import Backdrop from "../components/Backdrop";
import TopBar from "../components/TopBar";
import AccountStrip from "../components/AccountStrip";
import CapturePanel from "../components/CapturePanel";
import RecallPanel from "../components/RecallPanel";
import ProofsPanel from "../components/ProofsPanel";
import SessionList from "../components/SessionList";
import Icon from "../components/Icon";
import { api } from "../api";

const DEMO_SEED = [
  {
    title: "Third Mainland at 2AM",
    type: "beat",
    status: "rough",
    tags: "amapiano, nocturnal, log drum, vocal chop",
    bpm: "112",
    key: "G minor",
    location: "Ableton / 2026 / tml_2am_v3.als",
    notes:
      "Made this straight after the late session with Zinternet. The vocal chop on the hook is the whole idea — pitched her ad-lib up a fourth. Needs real drums.",
  },
  {
    title: "leaving lagos (verse scratch)",
    type: "lyrics",
    status: "idea",
    tags: "diaspora, homesick, bittersweet",
    location: "Notes app + voice memo 41",
    notes:
      "Verse about packing a life into two suitcases. 'I kept the noise, I left the address.' Want it over something sparse.",
  },
  {
    title: "dark piano trap sketch",
    type: "beat",
    status: "idea",
    tags: "trap, cinematic, minor piano, no drums",
    bpm: "140",
    key: "C# minor",
    location: "hard drive / sketches / march",
    notes: "Just a looped grand piano phrase from March. Villain-arc energy. Never added drums.",
  },
  {
    title: "car hum — chorus melody",
    type: "voice note",
    status: "idea",
    tags: "melody, catchy, driving",
    location: "phone voice memo, Aug 12",
    notes:
      "Hummed a full chorus melody at a red light on the way back from Dayo's. Da-da-DAAA, then it falls. Don't lose this one.",
  },
];

function Tab({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 15px",
        borderRadius: 999,
        border: "1px solid",
        borderColor: active ? "var(--accent-tint)" : "var(--line)",
        background: active ? "var(--accent-dim)" : "var(--surface)",
        color: active ? "var(--accent-strong)" : "var(--text-2)",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <Icon name={icon} size={15} />
      {label}
      {badge > 0 && (
        <span
          className="mono"
          style={{
            fontSize: 10.5,
            padding: "1px 6px",
            borderRadius: 999,
            background: active ? "var(--accent-tint)" : "var(--surface-3)",
            color: active ? "var(--accent-strong)" : "var(--text-2)",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Studio() {
  const [tab, setTab] = useState("studio");
  const [health, setHealth] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [pendingQuery, setPendingQuery] = useState(null);
  const [demoRunning, setDemoRunning] = useState(false);

  const onHealth = useCallback((h) => setHealth(h), []);

  const onCaptured = useCallback((res) => {
    if (!res?.job_id) return;
    setCaptures((prev) => {
      const i = prev.findIndex((c) => c.job_id === res.job_id);
      if (i === -1) return [{ ...res }, ...prev];
      const next = [...prev];
      next[i] = { ...next[i], ...res };
      return next;
    });
  }, []);

  async function runDemo() {
    if (demoRunning) return;
    setDemoRunning(true);
    setTab("studio");
    try {
      for (const seed of DEMO_SEED) {
        try {
          const res = await api.capture(seed);
          onCaptured(res);
          if (!res.finalized) pollDemo(res.job_id);
        } catch (e) {
          console.warn("demo seed failed:", seed.title, e.message);
        }
      }
      setPendingQuery("the melody I hummed in the car on the drive home");
      setTab("studio");
    } finally {
      setDemoRunning(false);
    }
  }

  async function pollDemo(jobId, n = 0) {
    if (n > 30) return;
    try {
      const s = await api.jobStatus(jobId);
      onCaptured({ job_id: jobId, ...s });
      if (s.finalized || s.status === "failed") return;
    } catch {
      /* transient */
    }
    setTimeout(() => pollDemo(jobId, n + 1), 4000);
  }

  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: "var(--bg)" }}>
      <Backdrop intensity={0.7} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <TopBar onHealth={onHealth} onRunDemo={runDemo} demoRunning={demoRunning} />
        <AccountStrip health={health} />

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "24px 20px 100px" }}>
          <div style={{ marginBottom: 18 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 720 }}>Studio</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--text-2)" }}>
              Capture the context around a piece of work on the left. Recall it by meaning on the right.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <Tab active={tab === "studio"} onClick={() => setTab("studio")} icon="wave" label="Studio" />
            <Tab
              active={tab === "proofs"}
              onClick={() => setTab("proofs")}
              icon="shield"
              label="On-Chain Proofs"
              badge={captures.length}
            />
          </div>

          {tab === "studio" ? (
            <div className="studio-grid">
              <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
                <CapturePanel onCaptured={onCaptured} />
                <SessionList captures={captures} onRecall={(q) => setPendingQuery(q)} />
              </div>
              <RecallPanel
                pendingQuery={pendingQuery}
                onConsumeQuery={() => setPendingQuery(null)}
              />
            </div>
          ) : (
            <ProofsPanel captures={captures} />
          )}
        </div>

        <footer
          style={{
            textAlign: "center",
            padding: "0 20px 36px",
            fontSize: 11.5,
            color: "var(--text-3)",
          }}
        >
          Audora · semantic memory by <span style={{ color: "var(--text-2)" }}>Walrus Memory</span> ·{" "}
          <span className="mono">@mysten-incubation/memwal</span>
        </footer>
      </div>

      <style>{`
        .studio-grid { display: grid; gap: 16px; align-items: start; }
        @media (min-width: 900px) {
          .studio-grid { grid-template-columns: minmax(340px, 400px) 1fr; }
        }
      `}</style>
    </div>
  );
}
