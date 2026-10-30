import type { LandmarkId, ShopSku } from "@/config/shop";

/**
 * FarmData is the contract a future /api/farm payload should return.
 * Plots sit on the ground grid. Items are the catalog.
 * Payments are not processed here — shop.ts holds PayPal links,
 * and approved placements land in the sponsors file (later Supabase).
 */

export interface SponsorPlate {
  name: string;
  href?: string;
  message?: string;
  golden?: boolean;
}

export interface FarmLink {
  label: string;
  href: string;
  todo?: boolean;
}

export interface FarmItem {
  id: string;
  /** Card title. */
  name: string;
  /** Short label on the map. */
  label: string;
  /** Building name, e.g. Barn. */
  place?: string;
  sprite: string;
  visual: { w: number; h: number };
  interactive?: boolean;
  pitch?: string;
  image?: string;
  demo?: "reelstyles";
  cta?: { label: string; href: string };
  links?: FarmLink[];
  featured?: boolean;
  /**
   * Shop offering. The ReelStyles barn must not set this.
   * Landmark spots set `landmark` instead of (or in addition to) sku.
   */
  sku?: ShopSku;
  landmark?: LandmarkId;
  /** Window lights relative to the front-center anchor. Negative y is up. */
  lights?: { x: number; y: number; r?: number }[];
  /** When false, the dream-home shop must not offer this spot. */
  forSale?: boolean;
}

export interface Plot {
  id: string;
  /** 0 is the left edge. */
  col: number;
  row: number;
  /** Row 0 is the horizon. Higher rows paint in front. */
  cols?: number;
  rows?: number;
  itemId: string;
  flip?: boolean;
  /** Stagger idle motion, in seconds. */
  animDelay?: number;
  /**
   * Reserved for a visitor who has claimed the plot.
   * Rendered when set. No payment fields.
   */
  sponsor?: SponsorPlate | null;
  sponsorable?: boolean;
}

export interface PlacedSponsor {
  id: string;
  itemId: string;
  col: number;
  row: number;
  cols?: number;
  rows?: number;
  flip?: boolean;
  sponsor: SponsorPlate;
}

export interface LandmarkSlot {
  takeovers: number;
  sponsor: SponsorPlate | null;
}

export interface SponsorsFile {
  landmarks: Record<LandmarkId, LandmarkSlot>;
  scarecrowWeek: { weekOf: string | null; sponsor: SponsorPlate | null };
  dog: {
    status: "auction-placeholder";
    name: string | null;
    sponsor: SponsorPlate | null;
  };
  plotsSold: number;
  featuredGate: { name: string; href?: string; until: string } | null;
  placed: PlacedSponsor[];
}

export interface FundEntry {
  date: string;
  amount: number;
  source: string;
  note: string;
}

export interface FundSpend {
  date: string;
  amount: number;
  item: string;
  note: string;
}

export interface FundFile {
  currency: "USD";
  entries: FundEntry[];
  spent: FundSpend[];
}

export interface GridSpec {
  cols: number;
  rows: number;
  originX: number;
  originY: number;
  cellW: number;
  cellH: number;
}

export interface WorldSize {
  width: number;
  height: number;
}

export interface FarmData {
  world: WorldSize;
  grid: GridSpec;
  items: FarmItem[];
  plots: Plot[];
  sponsors: SponsorsFile;
  fund: FundFile;
}
