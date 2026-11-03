import Link from "next/link";
import { formatMoney, landmarkPrice, skuBasePrice, type Offering } from "@/config/shop";
import { plotsRemaining } from "@/farm/loadFarm";
import type { SponsorsFile } from "@/farm/types";

export function SponsorshipNotice({
  offering,
  sponsors,
}: {
  offering: Offering;
  sponsors: SponsorsFile;
}) {
  const price = offering.landmark
    ? landmarkPrice(sponsors.landmarks[offering.landmark].takeovers)
    : offering.sku
      ? skuBasePrice(offering.sku)
      : null;
  return (
    <section className="buy-block" aria-label="Sponsorship availability">
      <h3>{offering.title}</h3>
      <p className="note">{offering.blurb}</p>
      {price !== null && <p className="total">Planned price: {formatMoney(price)}</p>}
      {offering.sku === "plot" && <p className="note">{plotsRemaining(sponsors)} plots remain.</p>}
      <p className="warn">
        Online sponsorship requests and payments are not available yet. This page does not submit a
        request or reserve a place.
      </p>
      <Link className="text-link" href="/impressum">
        Contact details to discuss sponsorship
      </Link>
    </section>
  );
}
