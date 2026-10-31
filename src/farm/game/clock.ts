export const gameClock = { seconds: 0, paused: false, reduced: false };
export function advanceWorld(dt: number, hidden = false) {
  if (!gameClock.paused && !gameClock.reduced && !hidden) gameClock.seconds += Math.min(Math.max(dt, 0), .05);
  return gameClock.seconds;
}
export function animationDelta(dt: number) {
  return gameClock.paused || gameClock.reduced ? 0 : Math.min(Math.max(dt, 0), .05);
}
export function cycleLighting(seconds: number): "day" | "sunset" | "night" {
  const phase = ((seconds % 360) + 360) % 360;
  return phase < 180 ? "day" : phase < 270 ? "sunset" : "night";
}
