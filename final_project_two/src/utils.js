export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  const diff = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diff;
}

export function formatDueText(dateStr) {
  const d = daysUntil(dateStr);
  if (d === null) return "No upcoming piece";
  if (d === 0) return "Next piece due today";
  if (d === 1) return "Next piece due tomorrow";
  if (d > 1) return `Next piece due in ${d} days`;
  return "Next piece overdue";
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr || "";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  if (Number.isNaN(d.getTime())) return dateStr || "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function stripMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function callLLM(prompt, maxTokens = 2000) {
  if (!window.CONFIG || !CONFIG.MISTRAL_API_KEY) {
    throw new Error("Missing CONFIG.MISTRAL_API_KEY (check config.js)");
  }
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${CONFIG.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-medium-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();
  const responseText = data.choices?.[0]?.message?.content || "(no response)";
  return stripMarkdown(responseText);
}


