export const TAG_DEFS = [
  {
    id: "difficult",
    label: "Difficult",
    color: "var(--accent-red)",
    baseHex: "#FF3A3A",
  },
  {
    id: "review",
    label: "Review",
    color: "var(--accent-yellow)",
    baseHex: "#FFD747",
  },
  {
    id: "mastered",
    label: "Mastered",
    color: "var(--accent-green)",
    baseHex: "#65DC65",
  },
  {
    id: "practice",
    label: "Practice",
    color: "var(--accent-blue)",
    baseHex: "#6577FF",
  },
  {
    id: "focus",
    label: "Focus",
    color: "var(--accent-purple)",
    baseHex: "#B17AFE",
  },
];

export function getTagDef(tagId) {
  return TAG_DEFS.find((t) => t.id === tagId) || null;
}


