"use client";

import { useState, type FormEvent } from "react";
import {
  formatMoney,
  isPaypalReady,
  landmarkPrice,
  offeringById,
  quoteTotal,
  shop,
  skuBasePrice,
  type Offering,
  type UpsellSelection,
} from "@/config/shop";
import type { SponsorsFile } from "@/farm/types";
import { plotsRemaining } from "@/farm/loadFarm";

export function BuyForm({
  offering,
  spotId,
  sponsors,
}: {
  offering: Offering;
  spotId: string;
  sponsors: SponsorsFile;
}) {
  const [upsells, setUpsells] = useState<UpsellSelection>({});
  const [name, setName] = useState("");
  const [href, setHref] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  const takeovers = offering.landmark ? sponsors.landmarks[offering.landmark].takeovers : 0;
  const base = offering.landmark
    ? landmarkPrice(takeovers)
    : offering.sku
      ? skuBasePrice(offering.sku)
      : null;
  const auction = offering.sku === "dogAuction";
  const soldOut = offering.sku === "plot" && plotsRemaining(sponsors) <= 0;
  const total = auction ? null : quoteTotal(base, upsells);
  const paypalUrl = shop.paypal[offering.paypal];
  const payable = isPaypalReady(paypalUrl);

  function toggle(key: keyof UpsellSelection) {
    setUpsells((current) => ({ ...current, [key]: !current[key] }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setNote("");
    try {
      const response = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          spotId,
          offeringId: offering.id,
          sku: offering.sku ?? null,
          landmark: offering.landmark ?? null,
          name,
          href,
          message,
          upsells,
          total,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setNote(data.message || "Could not queue this. Try again.");
        return;
      }
      setStatus("done");
      setNote(data.message || "Queued for a person to approve.");
    } catch {
      setStatus("error");
      setNote("Could not reach the queue.");
    }
  }

  return (
    <form className="buy-block" onSubmit={submit}>
      <h3 style={{ margin: "0 0 6px", fontFamily: "var(--font-fraunces), Georgia, serif" }}>{offering.title}</h3>
      <p className="note">{offering.blurb}</p>
      {offering.sku === "plot" && (
        <p className="note">
          {plotsRemaining(sponsors)} of {shop.limits.plots} plots left.
        </p>
      )}
      {offering.landmark && (
        <p className="note">
          Next sponsor pays {formatMoney(landmarkPrice(takeovers))}. After that the price doubles.
        </p>
      )}
      {auction && <p className="note">No live bids yet. Leave a name and we will hold your place in the queue.</p>}

      {!auction && base != null && (
        <>
          <label className="upsell">
            <input type="checkbox" checked={!!upsells.golden} onChange={() => toggle("golden")} />
            <span>
              Golden version — animated glow, {shop.upsells.goldenMultiplier}× the price (
              {formatMoney(base * shop.upsells.goldenMultiplier)})
            </span>
          </label>
          <label className="upsell">
            <input type="checkbox" checked={!!upsells.message} onChange={() => toggle("message")} />
            <span>Message sign next to it — {formatMoney(shop.upsells.messageSign)}</span>
          </label>
          <label className="upsell">
            <input type="checkbox" checked={!!upsells.link} onChange={() => toggle("link")} />
            <span>
              Link to your site or X — {formatMoney(shop.upsells.sponsorLink)}. Shown as sponsored, nofollow.
            </span>
          </label>
          <label className="upsell">
            <input type="checkbox" checked={!!upsells.featured} onChange={() => toggle("featured")} />
            <span>
              Featured on the farm gate for {shop.upsells.featuredGateDays} days — {formatMoney(shop.upsells.featuredGate)}
            </span>
          </label>
          <p className="total">{total != null ? formatMoney(total) : ""}</p>
        </>
      )}

      <label className="field">
        Name on the farm
        <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={40} name="name" />
      </label>
      <label className="field">
        Website or X link
        <input
          value={href}
          onChange={(event) => setHref(event.target.value)}
          maxLength={200}
          placeholder="https://"
          inputMode="url"
          name="href"
        />
      </label>
      <label className="field">
        Message
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={140} rows={3} name="message" />
      </label>

      {payable ? (
        <a className="cta" href={paypalUrl} target="_blank" rel="noopener noreferrer">
          Pay with PayPal
        </a>
      ) : (
        <p className="warn">PayPal link is not configured yet. You can still join the approval queue.</p>
      )}

      <button className="cta secondary" type="submit" disabled={soldOut || status === "sending" || status === "done"}>
        {soldOut ? "Plots are sold out" : status === "sending" ? "Sending…" : "Submit for approval"}
      </button>
      {note && <p className="note">{note}</p>}
      <p className="note">A person approves each spot before it appears. Nothing is charged on this page.</p>
    </form>
  );
}

export function ShareSpot({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/spot/${id}`;

  async function share() {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "medevsmaker's farm", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <div className="share-row">
      <button type="button" className="text-link" onClick={share}>
        {copied ? "Link copied" : "Share my spot"}
      </button>
      <input readOnly value={path} aria-label="Link to this spot" />
    </div>
  );
}

export function offeringForItem(item: { id: string; sku?: string; landmark?: string; forSale?: boolean }) {
  if (item.forSale === false) return null;
  return (
    offeringById(item.id) ||
    (item.landmark ? offeringById(item.landmark === "waterTower" ? "water-tower" : item.landmark) : null)
  );
}
