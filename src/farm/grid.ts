import type { GridSpec, Plot, WorldSize } from "./types";

export const FARM_WORLD: WorldSize = { width: 1440, height: 900 };

/**
 * Ground cells. Sprites anchor on the front edge and may draw upward
 * past the cell into the sky. Change a plot's col/row to move it.
 */
export const GROUND_GRID: GridSpec = {
  cols: 24,
  rows: 8,
  originX: 40,
  originY: 500,
  cellW: 56,
  cellH: 46,
};

export interface Anchor {
  x: number;
  y: number;
  footW: number;
  footH: number;
}

export function plotAnchor(plot: Pick<Plot, "col" | "row" | "cols" | "rows">, grid: GridSpec = GROUND_GRID): Anchor {
  const cols = plot.cols ?? 1;
  const rows = plot.rows ?? 1;
  return {
    x: grid.originX + plot.col * grid.cellW + (cols * grid.cellW) / 2,
    y: grid.originY + (plot.row + rows) * grid.cellH,
    footW: cols * grid.cellW,
    footH: rows * grid.cellH,
  };
}

export function hotspotBox(anchor: Anchor, visual: { w: number; h: number }, world: WorldSize = FARM_WORLD) {
  const left = anchor.x - visual.w / 2;
  const top = anchor.y - visual.h;
  return {
    left: `${(left / world.width) * 100}%`,
    top: `${(top / world.height) * 100}%`,
    width: `${(visual.w / world.width) * 100}%`,
    height: `${(visual.h / world.height) * 100}%`,
  };
}
