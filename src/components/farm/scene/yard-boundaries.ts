/** Visible land and physical boundaries share one footprint for walking/driving. */
export const GROUND_HALF = 45;
export const YARD_LIMIT = 44;
export const YARD_WALLS: { position: [number, number, number]; args: [number, number, number] }[] = [
  { position: [-YARD_LIMIT - .5, 2, 0], args: [.5, 2, GROUND_HALF] },
  { position: [YARD_LIMIT + .5, 2, 0], args: [.5, 2, GROUND_HALF] },
  { position: [0, 2, -YARD_LIMIT - .5], args: [GROUND_HALF, 2, .5] },
  { position: [0, 2, YARD_LIMIT + .5], args: [GROUND_HALF, 2, .5] },
];
