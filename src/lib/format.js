export const WORK_TYPES = [
  "beat",
  "song",
  "lyrics",
  "voice note",
  "concept",
  "sample",
  "other",
];

export const STAGES = ["idea", "rough", "refining", "done"];

export const STAGE_HUE = {
  idea: "#8b8194",
  rough: "#ffb25b",
  refining: "#ff6f91",
  done: "#4ade80",
};

/** glyph per work type — simple, legible, on-brand */
export const TYPE_GLYPH = {
  beat: "◈",
  song: "♪",
  lyrics: "✎",
  "voice note": "◍",
  concept: "✦",
  sample: "▤",
  other: "◆",
};

export function relativeDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return iso;
  const days = Math.round((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

export function splitTags(tags) {
  return String(tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
