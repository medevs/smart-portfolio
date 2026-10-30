/**
 * All shop prices and payment links live here.
 * PayPal values are placeholders — replace TODO before taking money.
 * No API keys belong in this file.
 *
 * Stated rates: fence post $1, flower $5, named animal $9, plot $49
 * (100 plots), landmarks from $250 doubling each takeover, golden ×3.
 * Weekly scarecrow and the add-on dollar amounts are editable defaults.
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
  upsells: {
    goldenMultiplier: 3,
    /** Editable defaults — confirm before launch. */
    messageSign: 4,
    sponsorLink: 6,
    featuredGate: 21,
    featuredGateDays: 7,
  },
  paypal: {
    fencePost: "https://www.paypal.com/paypalme/TODO/1USD",
    flower: "https://www.paypal.com/paypalme/TODO/5USD",
    namedAnimal: "https://www.paypal.com/paypalme/TODO/9USD",
    plot: "https://www.paypal.com/paypalme/TODO/49USD",
    landmark: "https://www.paypal.com/paypalme/TODO/250USD",
    scarecrowWeek: "https://www.paypal.com/paypalme/TODO/15USD",
    dogAuction: "https://www.paypal.com/paypalme/TODO",
    messageSign: "https://www.paypal.com/paypalme/TODO",
    sponsorLink: "https://www.paypal.com/paypalme/TODO",
    featuredGate: "https://www.paypal.com/paypalme/TODO",
  },
} as const;

export type LandmarkId = "windmill" | "silo" | "waterTower";

export type ShopSku =
  | "fencePost"
  | "flower"
  | "namedAnimal"
  | "plot"
  | "scarecrowWeek"
  | "dogAuction";

export type PaypalKey = keyof typeof shop.paypal;

export function isPaypalReady(url: string) {
  return Boolean(url) && !url.includes("TODO");
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: shop.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Price for the next landmark sponsor. Doubles on every recorded takeover. */
export function landmarkPrice(takeovers: number) {
  const steps = Math.max(0, Math.floor(takeovers));
  return shop.prices.landmarkStart * 2 ** steps;
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

export interface UpsellSelection {
  golden?: boolean;
  message?: boolean;
  link?: boolean;
  featured?: boolean;
}

/** Golden triples the item. Add-ons are flat fees from config. Auctions have no total. */
export function quoteTotal(base: number | null, upsells: UpsellSelection) {
  if (base == null) return null;
  let total = upsells.golden ? base * shop.upsells.goldenMultiplier : base;
  if (upsells.message) total += shop.upsells.messageSign;
  if (upsells.link) total += shop.upsells.sponsorLink;
  if (upsells.featured) total += shop.upsells.featuredGate;
  return total;
}

export interface Offering {
  id: string;
  title: string;
  blurb: string;
  sku?: ShopSku;
  landmark?: LandmarkId;
  paypal: PaypalKey;
}

export const offerings: Offering[] = [
  {
    id: "fence-post",
    title: "Fence post",
    blurb: "A named post on the pasture fence.",
    sku: "fencePost",
    paypal: "fencePost",
  },
  {
    id: "flower",
    title: "Flower",
    blurb: "Plant a flower with your name beside it.",
    sku: "flower",
    paypal: "flower",
  },
  {
    id: "named-animal",
    title: "Named animal",
    blurb: "An animal on the farm, called whatever you choose.",
    sku: "namedAnimal",
    paypal: "namedAnimal",
  },
  {
    id: "plot",
    title: "Plot",
    blurb: "A piece of the grid. One hundred plots, then no more.",
    sku: "plot",
    paypal: "plot",
  },
  {
    id: "windmill",
    title: "Windmill",
    blurb: "One sponsor. The next person pays double to take it over.",
    landmark: "windmill",
    paypal: "landmark",
  },
  {
    id: "silo",
    title: "Silo",
    blurb: "Sponsor the silo. MentorClone stays; your name goes on the band.",
    landmark: "silo",
    paypal: "landmark",
  },
  {
    id: "water-tower",
    title: "Water tower",
    blurb: "One name on the tank. Takeovers double the price.",
    landmark: "waterTower",
    paypal: "landmark",
  },
  {
    id: "youtube",
    title: "Scarecrow this week",
    blurb: "The weekly name on the scarecrow's sign.",
    sku: "scarecrowWeek",
    paypal: "scarecrowWeek",
  },
  {
    id: "dog",
    title: "Name the farm dog",
    blurb: "An auction placeholder. Bids are not live yet.",
    sku: "dogAuction",
    paypal: "dogAuction",
  },
];

export function offeringById(id: string) {
  return offerings.find((item) => item.id === id) ?? null;
}
