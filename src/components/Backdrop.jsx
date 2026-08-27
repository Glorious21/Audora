/** Soft blue wash from the top — echoes the hero gradient across the app. */
export default function Backdrop({ intensity = 0.5 }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: `
          radial-gradient(1100px 460px at 50% -160px, rgba(47,111,237,${0.16 * intensity}), transparent 68%),
          radial-gradient(760px 420px at 92% -60px, rgba(120,160,255,${0.12 * intensity}), transparent 70%)
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.6,
          backgroundImage: `
            linear-gradient(var(--line-soft) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-soft) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 70%)",
        }}
      />
    </div>
  );
}
