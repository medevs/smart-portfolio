import type { Metadata } from "next";
import { seoConfig } from "../config/seo";
import type { Placed } from "../farm/loadFarm";

export function spotUrl(id: string): string {
  return `${seoConfig.siteUrl}/spot/${encodeURIComponent(id)}`;
}

/** Ids worth indexing: each plot and each product. Legacy landmark aliases stay out so they do not duplicate a page. */
export function indexableSpotIds(placed: Placed[]): string[] {
  return [...new Set(placed.flatMap((entry) => [entry.plot.id, entry.item.id]))];
}

export function buildSpotMetadata(id: string, title: string): Metadata {
  const description = `${title} on medevsmaker's farm.`;
  const url = spotUrl(id);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} · medevsmaker`, description, url },
    twitter: { card: "summary_large_image", title: `${title} · medevsmaker`, description },
  };
}
