"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { formatMoney, landmarkPrice, offerings, shop, skuBasePrice } from "@/config/shop";
import type { Placed } from "@/farm/loadFarm";
import { plotsRemaining } from "@/farm/loadFarm";
import type { FarmData } from "@/farm/types";
import { BuyForm, ShareSpot, offeringForItem } from "./BuyForm";

function ReelDemo() {
  return (
    <div className="reel-demo" aria-hidden="true">
      <div className="reel-sky" />
      <div className="reel-sun" />
      <div className="reel-hill" />
      <div className="reel-barn" />
    </div>
  );
}

export function SpotCard({
  entry,
  data,
  onClose,
}: {
  entry: Placed | null;
  data: FarmData;
  onClose: () => void;
}) {
  const item = entry?.item;
  const offering = item ? offeringForItem(item) : null;

  return (
    <Dialog.Root open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="product-card" aria-describedby={undefined}>
          {item && entry && (
            <>
              <Dialog.Close className="close-btn" aria-label="Close">
                ×
              </Dialog.Close>
              {item.place && <p className="kicker">{item.place}</p>}
              <Dialog.Title asChild>
                <h2>{item.name}</h2>
              </Dialog.Title>
              {item.pitch && (
                <Dialog.Description className="pitch">{item.pitch}</Dialog.Description>
              )}
              {item.demo === "reelstyles" && <ReelDemo />}
              {item.image && (
                <div className="card-media">
                  <Image src={item.image} alt={`${item.name} preview`} width={800} height={450} />
                </div>
              )}
              {item.cta && (
                <a className="cta" href={item.cta.href} {...linkAttrs(item.cta.href)}>
                  {item.cta.label}
                </a>
              )}
              {item.links && item.links.length > 0 && (
                <div className="link-row">
                  {item.links.map((link) =>
                    link.todo || !link.href ? (
                      <p key={link.label} className="todo">
                        TODO: {link.label}
                      </p>
                    ) : (
                      <a key={link.label} className="text-link" href={link.href} {...linkAttrs(link.href)}>
                        {link.label}
                      </a>
                    )
                  )}
                </div>
              )}
              {offering && (
                <BuyForm offering={offering} spotId={entry.plot.id} sponsors={data.sponsors} />
              )}
              <ShareSpot id={entry.plot.id} />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ShopDialog({
  open,
  data,
  onClose,
}: {
  open: boolean;
  data: FarmData;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="product-card shop-dialog">
          <Dialog.Close className="close-btn" aria-label="Close">
            ×
          </Dialog.Close>
          <p className="kicker">Dream home</p>
          <Dialog.Title asChild>
            <h2>Help build the farm</h2>
          </Dialog.Title>
          <Dialog.Description className="pitch">
            Buy a post, a flower, an animal, or a plot. Landmarks have one sponsor at a time. The courtyard workshop is
            ReelStyles and is not for sale.
          </Dialog.Description>
          <ul className="shop-list">
            {offerings.map((offering) => {
              const price = offering.landmark
                ? formatMoney(landmarkPrice(data.sponsors.landmarks[offering.landmark].takeovers))
                : offering.sku === "dogAuction"
                  ? "Auction"
                  : offering.sku
                    ? formatMoney(skuBasePrice(offering.sku) ?? 0)
                    : "";
              const extra =
                offering.sku === "plot" ? ` · ${plotsRemaining(data.sponsors)}/${shop.limits.plots} left` : "";
              return (
                <li key={offering.id}>
                  <a href={`/spot/${offering.id}`}>
                    <span className="price">
                      {price}
                      {extra}
                    </span>
                    <strong>{offering.title}</strong>
                    <div className="note">{offering.blurb}</div>
                  </a>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function linkAttrs(href: string) {
  if (href.startsWith("http")) {
    return { target: "_blank", rel: "noopener noreferrer" } as const;
  }
  return {};
}
