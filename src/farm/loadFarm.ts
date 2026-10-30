import { isSpriteId } from "./spriteIds";
import { items } from "./items";
import { plots } from "./plots";
import { FARM_WORLD, GROUND_GRID, plotAnchor } from "./grid";
import { shop } from "@/config/shop";
import sponsorsJson from "@/data/sponsors.json";
import fundJson from "@/data/fund.json";
import type { FarmData, FarmItem, Plot, PlacedSponsor, SponsorsFile, FundFile } from "./types";

const sponsors = sponsorsJson as SponsorsFile;
const fund = fundJson as FundFile;

export interface Placed {
  plot: Plot;
  item: FarmItem;
  anchor: ReturnType<typeof plotAnchor>;
}

function placedFromSponsor(entry: PlacedSponsor, itemsById: Map<string, FarmItem>): Plot {
  const item = itemsById.get(entry.itemId);
  return {
    id: entry.id,
    col: entry.col,
    row: entry.row,
    cols: entry.cols,
    rows: entry.rows,
    itemId: entry.itemId,
    flip: entry.flip,
    sponsor: entry.sponsor,
    sponsorable: false,
    ...(item ? {} : {}),
  };
}

export function placePlots(data: Pick<FarmData, "items" | "plots" | "grid" | "sponsors">): Placed[] {
  const itemsById = new Map(data.items.map((item) => [item.id, item]));
  const extra: Plot[] = data.sponsors.placed.map((entry) => placedFromSponsor(entry, itemsById));
  const all = [...data.plots, ...extra];
  const placed: Placed[] = [];

  for (const plot of all) {
    const item = itemsById.get(plot.itemId);
    if (!item) {
      throw new Error(`Plot "${plot.id}" references unknown item "${plot.itemId}"`);
    }
    placed.push({ plot, item, anchor: plotAnchor(plot, data.grid) });
  }

  placed.sort(
    (a, b) => a.plot.row - b.plot.row || a.plot.col - b.plot.col || a.plot.id.localeCompare(b.plot.id)
  );
  return placed;
}

export function assertFarm(data: FarmData) {
  const ids = new Set<string>();
  for (const item of data.items) {
    if (ids.has(item.id)) throw new Error(`Duplicate item id "${item.id}"`);
    ids.add(item.id);
    if (!isSpriteId(item.sprite)) {
      throw new Error(`Item "${item.id}" uses missing sprite "${item.sprite}"`);
    }
    if (item.id === "reelstyles" && (item.forSale || item.sku || item.landmark)) {
      throw new Error("The ReelStyles barn is not for sale");
    }
  }

  const plotIds = new Set<string>();
  for (const plot of data.plots) {
    if (plotIds.has(plot.id)) throw new Error(`Duplicate plot id "${plot.id}"`);
    plotIds.add(plot.id);
    if (!ids.has(plot.itemId)) throw new Error(`Plot "${plot.id}" references unknown item "${plot.itemId}"`);
    if (plot.col < 0 || plot.row < 0 || plot.col >= data.grid.cols || plot.row >= data.grid.rows) {
      throw new Error(`Plot "${plot.id}" is outside the grid`);
    }
  }

  if (data.sponsors.plotsSold > shop.limits.plots) {
    throw new Error("plotsSold exceeds the plot limit");
  }
}

/**
 * Local files today. Replace the body with fetch("/api/farm") when the
 * dream-home ledger moves to an API. Keep the FarmData shape.
 */
export async function loadFarm(): Promise<FarmData> {
  const data: FarmData = {
    world: FARM_WORLD,
    grid: GROUND_GRID,
    items,
    plots,
    sponsors,
    fund,
  };
  assertFarm(data);
  return data;
}

export function findSpot(placed: Placed[], id: string) {
  return placed.find((entry) => entry.plot.id === id || entry.item.id === id || entry.item.landmark === id) ?? null;
}

export function fundRaised(file: FundFile) {
  return file.entries.reduce((sum, entry) => sum + entry.amount, 0);
}

export function fundSpent(file: FundFile) {
  return file.spent.reduce((sum, entry) => sum + entry.amount, 0);
}

export function plotsRemaining(file: SponsorsFile) {
  return Math.max(0, shop.limits.plots - file.plotsSold);
}
