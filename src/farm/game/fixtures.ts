import { plots } from "../plots";
import { GROUND_GRID } from "../grid";
import { CELL, plotPosition } from "../world";

export type SolidBox = { position: [number, number, number]; args: [number, number, number] };

/** The central fence has a real opening, shared by its rails and collision hulls. */
export function fenceSections(cols = 2, opening = 0) {
  const width = Math.max(CELL, cols * CELL * 0.92);
  return opening > 0
    ? [-1, 1].map((side) => ({ x: (side * (width + opening)) / 4, width: (width - opening) / 2 }))
    : [{ x: 0, width }];
}

export const CEDAR_TREES = Array.from({ length: 16 }, (_, i) => ({
  x: -28 + i * 3.8,
  z: -17 - (i % 3) * 3,
  height: 5.2 + (i % 4) * 0.6,
  rotation: i * 2.399,
}));

const boxes: SolidBox[] = [];
const circles: { x: number; z: number; radius: number; height: number }[] = [];
for (const plot of plots) {
  const [x, , z] = plotPosition(plot, GROUND_GRID);
  if (plot.itemId === "fence") {
    for (const section of fenceSections(plot.cols, plot.id === "fence-1" ? 1.8 : 0))
      boxes.push({
        position: [x + section.x, 0.48, z],
        args: [section.width / 2 + 0.05, 0.48, 0.05],
      });
  }
  if (plot.itemId === "greenhouse") boxes.push({ position: [x, 0.6, z], args: [1.24, 0.6, 1.75] });
  if (plot.itemId === "coop")
    boxes.push({ position: [x, 0.75, z + 0.18], args: [0.83, 0.75, 0.8] });
  if (["tree", "blossom"].includes(plot.itemId)) circles.push({ x, z, radius: 0.18, height: 2 });
  // Swimming is not a supported activity: follow the visible bank around the water.
  if (plot.itemId === "pond") circles.push({ x, z, radius: 1.95, height: 1.2 });
}

/** Permanent solid geometry only; optional downloadable scenery never makes an invisible wall. */
export const YARD_FIXTURES: SolidBox[] = [
  ...boxes,
  ...[-0.9, 0.9].map((x): SolidBox => ({ position: [x, 0.7, 7.25], args: [0.06, 0.7, 0.45] })),
  { position: [-12.5, 0.4, 3.4], args: [0.92, 0.4, 0.8] },
  { position: [-11, 0.45, 0.6], args: [0.825, 0.45, 0.325] },
  ...[-1.1, 1.1].map((offset): SolidBox => ({
    position: [-3, 0.29, 19 + offset],
    args: [3, 0.29, 0.2],
  })),
  ...[23, 24.7, 26.4].map((x): SolidBox => ({ position: [x, 0.65, 15], args: [0.6, 0.65, 0.45] })),
  ...[-7, 1].flatMap((x) =>
    [16.5, 21.5].map((z): SolidBox => ({ position: [x, 1.6, z], args: [0.08, 1.5, 0.08] })),
  ),
];
export const YARD_ROUND_FIXTURES = [
  ...circles,
  ...CEDAR_TREES.map((tree) => ({ ...tree, radius: (0.14 * tree.height) / 6, height: 2 })),
];
