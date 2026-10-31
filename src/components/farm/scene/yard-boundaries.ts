import { ORCHARD_TREES } from "@/farm/game/world";

/** Visible land and physical boundaries share one footprint for walking/driving. */
export const GROUND_HALF = 45;
export const YARD_LIMIT = 44;
export const YARD_WALLS: { position: [number, number, number]; args: [number, number, number] }[] = [
  { position: [-YARD_LIMIT - .5, 2, 0], args: [.5, 2, GROUND_HALF] },
  { position: [YARD_LIMIT + .5, 2, 0], args: [.5, 2, GROUND_HALF] },
  { position: [0, 2, -YARD_LIMIT - .5], args: [GROUND_HALF, 2, .5] },
  { position: [0, 2, YARD_LIMIT + .5], args: [GROUND_HALF, 2, .5] },
];

export const YARD_BUILDINGS: { position: [number, number, number]; args: [number, number, number] }[] = [
  { position: [1.1, 1.6, -2.2], args: [3.1, 1.6, 2.1] },
  { position: [-11, 1.4, -2.2], args: [2.5, 1.4, 1.9] },
  { position: [8.8, 2.1, -3.2], args: [1.2, 2.1, 1.2] },
  { position: [14.3, 1.1, -2.2], args: [1.6, 1.1, 1.3] },
  { position: [19.5, 2.2, -5.5], args: [1.3, 2.2, 1.3] },
  { position: [0, 1.8, -18], args: [5.2, 1.8, 2.4] },
  { position: [17, 1.24, -16.52], args: [2.16, 1.24, 1.04] },
  { position: [24, 1.24, -16.52], args: [2.16, 1.24, 1.04] },
  { position: [-20, .35, -15.3], args: [1.4, .35, .45] },
  { position: [-3, .5, 19], args: [3, .5, .65] },
];

export function safeSpawn(point: { x: number; z: number }) {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.z) || Math.abs(point.x) > 43 || Math.abs(point.z) > 43) return false;
  if (ORCHARD_TREES.some(tree => Math.hypot(point.x - tree.x, point.z - tree.z) < .55) || Math.abs(point.x + 12.5) < 1.18 && Math.abs(point.z - 3.4) < 1.18) return false;
  return !YARD_BUILDINGS.some(block => Math.abs(point.x - block.position[0]) < block.args[0] + .4 && Math.abs(point.z - block.position[2]) < block.args[2] + .4);
}
