import type { FarmData, SponsorPlate } from "./types";
import type { Placed } from "./loadFarm";

export function plateFor(entry: Placed, data: FarmData): SponsorPlate | null {
  if (entry.plot.sponsor?.name) return entry.plot.sponsor;
  if (entry.item.landmark) return data.sponsors.landmarks[entry.item.landmark]?.sponsor ?? null;
  if (entry.item.id === "youtube") return data.sponsors.scarecrowWeek.sponsor;
  if (entry.item.id === "dog") return data.sponsors.dog.sponsor;
  return null;
}
