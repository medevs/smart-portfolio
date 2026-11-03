import { offeringById } from "@/config/shop";

export function offeringForItem(item: {
  id: string;
  sku?: string;
  landmark?: string;
  forSale?: boolean;
}) {
  if (item.forSale === false) return null;
  return (
    offeringById(item.id) ||
    (item.landmark
      ? offeringById(item.landmark === "waterTower" ? "water-tower" : item.landmark)
      : null)
  );
}
