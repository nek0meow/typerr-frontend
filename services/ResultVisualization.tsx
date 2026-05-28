export function speedColor(delta: number) {
  const BASE_CPM = 60 * 5
  const t = normalize(BASE_CPM, delta); // -1..1

  // delta near base speed -> neutral color
  if (Math.abs(t) < 0.1) return "inherit";

  if (t < 0) {
    // faster -> greener
    const intensity = Math.round(255 - 255 * Math.abs(t));
    return `rgb(${intensity}, 255, ${intensity})`;
  } else {
    // slower -> redder
    const intensity = Math.round(255 - 255 * t);
    return `rgb(255, ${intensity}, ${intensity})`;
  }
}

function normalize(base_cpm: number, delta: number) {
  if (base_cpm < 1) base_cpm = 1;
  const base_delta = 60_000 / base_cpm;
  const low_delta = Math.max(base_delta - 200, 10);
  const high_delta = base_delta + 200;

  if (delta < low_delta) return -1;
  if (delta > high_delta) return 1;

  return (delta - base_delta) / (high_delta - low_delta);
}