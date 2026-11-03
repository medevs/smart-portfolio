/**
 * Planned sponsorship prices and catalog.
 * No API keys belong in this file.
 *
 * Stated rates: fence post $1, flower $5, named animal $9, plot $49
 * (100 plots), landmarks from $250 doubling each takeover.
 * Online requests and payments remain unavailable until a backend is configured.
 */

export const shop = {
  currency: "USD" as const,
  prices: {
    fencePost: 1,
    flower: 5,
    namedAnimal: 9,
    plot: 49,
    /** First sponsor on a landmark. The next takeover pays double. */
    landmarkStart: 250,
    /** Editable default — not in the original rate card. */
    scarecrowWeek: 15,
  },
  limits: {
    plots: 100,
  },
} as const;

export type LandmarkId = "windmill" | "silo" | "waterTower";

export type ShopSku =
  "fencePost" | "flower" | "namedAnimal" | "plot" | "scarecrowWeek" | "dogAuction";

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: shop.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Price for the next landmark sponsor. Doubles on every recorded takeover. */
export function landmarkPrice(takeovers: number) {
  if (!Number.isSafeInteger(takeovers) || takeovers < 0)
    throw new Error("Landmark takeovers must be a nonnegative integer");
  const price = shop.prices.landmarkStart * 2 ** takeovers;
  if (!Number.isSafeInteger(price)) throw new Error("Landmark price exceeds the supported range");
  return price;
}

export function skuBasePrice(sku: ShopSku): number | null {
  switch (sku) {
    case "fencePost":
      return shop.prices.fencePost;
    case "flower":
      return shop.prices.flower;
    case "namedAnimal":
      return shop.prices.namedAnimal;
    case "plot":
      return shop.prices.plot;
    case "scarecrowWeek":
      return shop.prices.scarecrowWeek;
    case "dogAuction":
      return null;
  }
}

export interface Offering {
  id: string;
  title: string;
  blurb: string;
  sku?: ShopSku;
  landmark?: LandmarkId;
}

export const offerings: Offering[] = [
  {
    id: "fence-post",
    title: "Fence post",
    blurb: "A named post on the pasture fence.",
    sku: "fencePost",
  },
  {
    id: "flower",
    title: "Flower",
    blurb: "Plant a flower with your name beside it.",
    sku: "flower",
  },
  {
    id: "named-animal",
    title: "Named animal",
    blurb: "An animal on the farm, called whatever you choose.",
    sku: "namedAnimal",
  },
  {
    id: "plot",
    title: "Plot",
    blurb: "A piece of the grid. One hundred plots, then no more.",
    sku: "plot",
  },
  {
    id: "windmill",
    title: "Granary tower",
    blurb: "One sponsor. The next person pays double to take it over.",
    landmark: "windmill",
  },
  {
    id: "silo",
    title: "Granary",
    blurb: "Sponsor the granary. MentorClone stays; your name goes on the wall.",
    landmark: "silo",
  },
  {
    id: "water-tower",
    title: "Water tower",
    blurb: "One name on the tank. Takeovers double the price.",
    landmark: "waterTower",
  },
  {
    id: "youtube",
    title: "Scarecrow this week",
    blurb: "The weekly name on the scarecrow's sign.",
    sku: "scarecrowWeek",
  },
  {
    id: "dog",
    title: "Name the farm dog",
    blurb: "An auction placeholder. Bids are not live yet.",
    sku: "dogAuction",
  },
];

export function offeringById(id: string) {
  return offerings.find((item) => item.id === id) ?? null;
}
