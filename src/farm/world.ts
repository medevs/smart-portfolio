import type { GridSpec, Plot } from "./types";

/** Meters per grid cell. Row 0 is the far edge; higher rows sit closer to the camera. */
export const CELL = 2.2;

export function plotPosition(plot: Pick<Plot, "col" | "row" | "cols" | "rows">, grid: GridSpec): [number, number, number] {
  const cols = plot.cols ?? 1;
  const rows = plot.rows ?? 1;
  const x = (plot.col + cols / 2 - grid.cols / 2) * CELL;
  const z = (plot.row + rows / 2 - grid.rows / 2) * CELL;
  return [x, 0, z];
}
