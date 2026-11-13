import type { FarmLink } from "./types";

/** Links a visitor can follow. Drops placeholders (`todo`) and links without a URL. */
export function visibleLinks(links: FarmLink[] | undefined): FarmLink[] {
  return (links ?? []).filter((link) => !link.todo && link.href.trim() !== "");
}
