export function speedColor(delta: number) {
  const t = normalize(delta); // -1..1

  // delta near base speed -> neutral color
  if (Math.abs(t) < 0.15) return "inherit";

  if (t < 0) {
    // faster -> greener
    const intensity = Math.round(180 + 75 * Math.abs(t));
    return `rgb(0, ${intensity}, 0)`;
  } else {
    // slower -> redder
    const intensity = Math.round(180 + 75 * t);
    return `rgb(${intensity}, 0, 0)`;
  }
}

function normalize(delta: number) {
  // TODO calcuate this all instead
  const base = 200;
  const low = 120;
  const high = 500;

  if (delta < low) return -1;
  if (delta > high) return 1;

  return (delta - base) / (high - base);
}