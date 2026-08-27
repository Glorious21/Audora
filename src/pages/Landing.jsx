import { motion } from "framer-motion";
import Icon from "../components/Icon";
import AudoraLogo, { AudoraMark } from "../components/AudoraLogo";
import { Link, useRoute } from "../lib/router";

const FEATURES = [
  {
    icon: "wave",
    title: "Capture the context, not just the file",
    body: "A working title gets you nowhere in six months. Audora saves the story around each idea — the mood, the session it came from, where the file lives, what it still needs.",
  },
  {
    icon: "search",
    title: "Recall by meaning",
    body: "Describe the memory the way you'd actually remember it — “the amapiano thing with the vocal chop from that late session” — and get the closest matches back, ranked.",
  },
  {
    icon: "layers",
    title: "One structured memory per idea",
    body: "Every capture becomes a single consistent sentence: type, title, date, stage, tags, tempo, key, where it lives, context. Consistency is what keeps recall sharp.",
  },
  {
    icon: "shield",
    title: "Proof of every write",
    body: "Each memory is an encrypted blob on Walrus, registered to your account. You get a job_id the moment it's accepted and a blob_id once it finalizes.",
  },
  {
    icon: "lock",
    title: "Your key never leaves the server",
    body: "The MemWal delegate key is read from the backend only. The browser talks to one origin and never sees a credential.",
  },
  {
    icon: "sparkle",
    title: "No database to run",
    body: "No vector store, no embeddings pipeline, no schema migrations. The Walrus Memory relayer handles embedding, encryption, storage and semantic recall.",
  },
];

const STEPS = [
  {
    k: "01",
    title: "Capture",
    body: "Fill the capture panel — title, type, stage, a line of context. The backend formats it into the canonical sentence and calls remember().",
  },
  {
    k: "02",
    title: "Store",
    body: "Walrus Memory embeds and encrypts the sentence, writes it to Walrus, and returns a job_id → blob_id you can verify.",
  },
  {
    k: "03",
    title: "Recall",
    body: "Later, search in plain language. recall() ranks by semantic distance; Audora re-parses each hit back into structured fields for the card view.",
  },
];

function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backdropFilter: "blur(10px)",
        background: "rgba(251, 251, 253, 0.8)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <AudoraLogo size={28} />
        </Link>
        <nav
          className="lp-nav"
          style={{ display: "flex", gap: 22, marginLeft: 18, fontSize: 13.5, color: "var(--text-2)", fontWeight: 500 }}
        >
          <a href="#how" style={{ textDecoration: "none" }}>How it works</a>
          <a href="#features" style={{ textDecoration: "none" }}>Features</a>
          <a href="#stack" style={{ textDecoration: "none" }}>The stack</a>
        </nav>
        <div style={{ flex: 1 }} />
        <Link to="/studio" className="btn btn-primary" style={{ padding: "9px 18px", fontSize: 13.5 }}>
          Launch Studio
          <Icon name="arrowRight" size={14} stroke={2.2} />
        </Link>
      </div>
      <style>{`@media (max-width: 640px){ .lp-nav{ display:none !important; } }`}</style>
    </header>
  );
}

function Hero() {
  const { navigate } = useRoute();
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 460px at 50% -40px, rgba(47,111,237,0.28), rgba(47,111,237,0.05) 45%, transparent 72%)",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 880,
          margin: "0 auto",
          padding: "88px 20px 76px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="kicker"
          style={{ marginBottom: 18 }}
        >
          Semantic memory for creative work
        </motion.div>
        <motion.h1
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 7vw, 3.8rem)",
            fontWeight: 750,
            lineHeight: 1.06,
            textWrap: "balance",
          }}
        >
          A memory layer for creative work
        </motion.h1>
        <motion.p
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          style={{
            margin: "22px auto 0",
            maxWidth: 560,
            fontSize: 16.5,
            lineHeight: 1.6,
            color: "var(--text-2)",
          }}
        >
          Artists, producers and writers generate a flood of ideas and lose the context
          around them. Audora lets you capture that context in plain language — and
          recall it later by meaning, even when you've forgotten the title.
        </motion.p>
        <motion.div
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}
        >
          <Link to="/studio" className="btn btn-primary" style={{ padding: "13px 24px", fontSize: 15 }}>
            Launch Studio
            <Icon name="arrowRight" size={15} stroke={2.2} />
          </Link>
          <a href="#how" className="btn btn-ghost" style={{ padding: "13px 24px", fontSize: 15 }}>
            How it works
          </a>
        </motion.div>

        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          onClick={() => navigate("/studio")}
          style={{
            marginTop: 54,
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 14,
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--line)",
            background: "var(--surface)",
            boxShadow: "var(--shadow-lg)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div className="kicker" style={{ marginBottom: 8, paddingLeft: 4 }}>Every idea stored as one sentence</div>
          <pre
            className="mono"
            style={{
              margin: 0,
              padding: "16px 18px",
              borderRadius: "var(--radius)",
              background: "var(--text)",
              color: "#e9edf4",
              fontSize: 12,
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
{`Beat — "Third Mainland at 2AM".
Captured on 2026-08-27. Stage: rough.
Tags: amapiano, nocturnal, log drum, vocal chop.
Tempo: 112 BPM. Key: G minor.
Where it lives: Ableton / 2026 / tml_2am_v3.als.
Context: made this straight after the late session
with Zinternet — the vocal chop is the whole idea.`}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section id="how" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "72px 20px 20px" }}>
      <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 720, maxWidth: 520 }}>
        Capture once.
        <br />
        Recall the way you think.
      </h2>
      <div
        style={{
          marginTop: 36,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {STEPS.map((s) => (
          <div key={s.k} className="panel" style={{ padding: "22px 20px" }}>
            <div
              className="mono"
              style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}
            >
              {s.k}
            </div>
            <div style={{ marginTop: 10, fontSize: 16, fontWeight: 650 }}>{s.title}</div>
            <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px 20px 20px" }}>
      <div className="kicker">Built for the way ideas actually arrive</div>
      <h2 style={{ margin: "12px 0 0", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 720, maxWidth: 560 }}>
        A vault that understands what you meant
      </h2>
      <div
        style={{
          marginTop: 36,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            whileHover={{ y: -3 }}
            className="panel"
            style={{ padding: "22px 20px" }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 40,
                height: 40,
                borderRadius: 11,
                background: "var(--accent-dim)",
                color: "var(--accent)",
                border: "1px solid var(--accent-tint)",
              }}
            >
              <Icon name={f.icon} size={19} stroke={1.9} />
            </span>
            <div style={{ marginTop: 14, fontSize: 15.5, fontWeight: 650 }}>{f.title}</div>
            <p style={{ margin: "7px 0 0", fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px 20px 20px" }}>
      <div
        className="panel"
        style={{
          padding: "clamp(24px, 5vw, 44px)",
          display: "grid",
          gap: 28,
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
      >
        <div>
          <div className="kicker">The stack</div>
          <h2 style={{ margin: "12px 0 0", fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)", fontWeight: 720 }}>
            No custom database. Walrus Memory does the hard part.
          </h2>
          <p style={{ margin: "12px 0 0", fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.65, maxWidth: 620 }}>
            Audora is a thin, honest wrapper. The React UI and the Express API live in one
            codebase; the API formats each idea into the canonical sentence and hands it to{" "}
            <span className="mono">@mysten-incubation/memwal</span>. The relayer handles
            embedding, encryption, storage on Walrus, and semantic recall.
          </p>
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {[
            ["React + Vite", "single-page UI"],
            ["Express", "JSON API, holds the key"],
            ["MemWal relayer", "embed · encrypt · recall"],
            ["Walrus", "storage + blob proofs"],
          ].map(([a, b]) => (
            <div
              key={a}
              style={{
                padding: "14px 16px",
                borderRadius: "var(--radius)",
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 650 }}>{a}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px 20px 90px" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--accent-tint)",
          background: "linear-gradient(180deg, var(--accent-dim), var(--surface))",
          padding: "clamp(32px, 6vw, 56px) 24px",
          textAlign: "center",
        }}
      >
        <span style={{ display: "inline-flex" }}>
          <AudoraMark size={40} />
        </span>
        <h2 style={{ margin: "18px 0 0", fontSize: "clamp(1.7rem, 4vw, 2.3rem)", fontWeight: 730 }}>
          Stop losing the good ideas
        </h2>
        <p style={{ margin: "10px auto 0", maxWidth: 440, fontSize: 15, color: "var(--text-2)" }}>
          Open the Studio, capture a memory, and recall it by meaning. The 2-minute demo
          seeds four so recall has something to find.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link to="/studio" className="btn btn-primary" style={{ padding: "13px 26px", fontSize: 15 }}>
            Launch Studio
            <Icon name="arrowRight" size={15} stroke={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "28px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          fontSize: 12.5,
          color: "var(--text-3)",
        }}
      >
        <AudoraLogo size={22} />
        <span style={{ flex: 1 }} />
        <span>
          Semantic memory by <span style={{ color: "var(--text-2)" }}>Walrus Memory</span> ·{" "}
          <span className="mono">@mysten-incubation/memwal</span>
        </span>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: "var(--bg)" }}>
      <Header />
      <Hero />
      <Steps />
      <Features />
      <Stack />
      <CTA />
      <Footer />
    </div>
  );
}
