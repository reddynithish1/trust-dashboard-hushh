export const getTrustScoreColor = (score: number): string => {
  const safeScore = Math.max(0, Math.min(100, score));

  // RGB target bounds
  const RED = { r: 255, g: 77, b: 79 };
  const YELLOW = { r: 255, g: 193, b: 7 };
  const GREEN = { r: 34, g: 197, b: 94 };

  const lerp = (start: number, end: number, t: number) => {
    return Math.round(start + (end - start) * t);
  };

  if (safeScore <= 50) {
    const t = safeScore / 50;
    const r = lerp(RED.r, YELLOW.r, t);
    const g = lerp(RED.g, YELLOW.g, t);
    const b = lerp(RED.b, YELLOW.b, t);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // 51 to 100
    const t = (safeScore - 50) / 50;
    const r = lerp(YELLOW.r, GREEN.r, t);
    const g = lerp(YELLOW.g, GREEN.g, t);
    const b = lerp(YELLOW.b, GREEN.b, t);
    return `rgb(${r}, ${g}, ${b})`;
  }
};
