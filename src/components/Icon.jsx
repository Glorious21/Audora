// Hand-picked stroke icons — keeps Audora from looking like a stock Material app.
const P = {
  search: "M11 4a7 7 0 1 0 4.2 12.6L20 21M11 4a7 7 0 0 1 5 12",
  plus: "M12 5v14M5 12h14",
  copy: "M9 9h10v10H9zM5 15V5h10",
  check: "M4 12l5 5L20 6",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  wave: "M3 12h2l2-6 3 14 3-11 2 5 2-2h4",
  close: "M6 6l12 12M18 6L6 18",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  memory:
    "M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  play: "M8 5v14l11-7z",
  layers: "M12 3l9 5-9 5-9-5zM3 14l9 5 9-5",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  sparkle: "M12 3l1.6 5L18 9.6 13.6 12 12 17l-1.6-5L6 9.6 10.4 8zM19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6z",
  link: "M9 15l6-6M8.5 8.5l-1 1a4 4 0 0 0 5.7 5.7l1-1M15.5 15.5l1-1a4 4 0 0 0-5.7-5.7l-1 1",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
  quote: "M7 7h5v5c0 3-2 5-5 5M17 7h-5",
};

export default function Icon({ name, size = 18, stroke = 1.7, style, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}
      {...rest}
    >
      <path d={P[name]} />
    </svg>
  );
}
