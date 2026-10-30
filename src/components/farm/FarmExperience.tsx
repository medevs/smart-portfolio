"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { formatMoney, landmarkPrice, skuBasePrice } from "@/config/shop";
import { findSpot, fundRaised, placePlots } from "@/farm/loadFarm";
import type { FarmData } from "@/farm/types";
import { FarmScene, hotspotStyle, plateFor } from "./FarmScene";
import { ShopDialog, SpotCard } from "./SpotCard";
import "./farm.css";

const BOOT = `(function(){try{var p=new URLSearchParams(location.search);var phase=p.get("phase");var time=p.get("time");var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;var spot=p.get("spot")||p.get("open");var onSpot=location.pathname.indexOf("/spot/")===0;var mode=phase==="sketch"&&!reduce?"sketch":(phase==="color"||reduce||spot||onSpot?"color":"intro");document.documentElement.dataset.farmPhase=mode;var h=new Date().getHours();var night=time==="night"||(time!=="day"&&(h<6||h>=19));document.documentElement.dataset.farmNight=night?"1":"0";}catch(e){}})();`;

function priceFor(item: FarmData["items"][number], farm: FarmData) {
  if (item.forSale === false) return null;
  if (item.landmark) return formatMoney(landmarkPrice(farm.sponsors.landmarks[item.landmark].takeovers));
  if (item.sku === "dogAuction") return "Auction";
  if (!item.sku) return null;
  const amount = skuBasePrice(item.sku);
  return amount == null ? null : formatMoney(amount);
}

function readSpot() {
  const params = new URLSearchParams(window.location.search);
  const fromPath = window.location.pathname.match(/^\/spot\/([^/]+)/);
  return (fromPath && decodeURIComponent(fromPath[1])) || params.get("spot") || params.get("open") || "";
}

export function FarmExperience({ farm, initialSpot = null }: { farm: FarmData; initialSpot?: string | null }) {
  const placed = useMemo(() => placePlots(farm), [farm]);
  const [phase, setPhase] = useState<"intro" | "sketch" | "color">("intro");
  const [night, setNight] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [hint, setHint] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ id: -1, x: 0, y: 0, left: 0, top: 0, moved: false });
  const suppressClick = useRef(false);

  const active = activeId ? findSpot(placed, activeId) : null;
  const raised = fundRaised(farm.fund);

  useLayoutEffect(() => {
    const mode = document.documentElement.dataset.farmPhase;
    const nextPhase = mode === "sketch" ? "sketch" : mode === "color" ? "color" : "intro";
    setPhase(nextPhase);
    setNight(document.documentElement.dataset.farmNight === "1");
    setShowGrid(new URLSearchParams(window.location.search).get("grid") === "1");
    const spot = initialSpot || readSpot();
    if (spot && nextPhase !== "sketch") setActiveId(spot);

    const el = scrollerRef.current;
    const target = (spot && findSpot(placed, spot)) || findSpot(placed, "reelstyles");
    if (el && target) {
      const scale = el.scrollWidth / farm.world.width;
      el.scrollLeft = Math.max(0, target.anchor.x * scale - el.clientWidth / 2);
      const bottom = Math.max(0, el.scrollHeight - el.clientHeight);
      const preferred = target.anchor.y * scale - el.clientHeight * 0.72;
      el.scrollTop = Math.max(0, Math.min(bottom, preferred));
    }
    document.documentElement.dataset.farmReady = "1";
  }, [farm.world.width, initialSpot, placed]);

  useEffect(() => {
    if (phase !== "intro") return;
    const timer = window.setTimeout(() => setPhase("color"), 4700);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && phase !== "color") {
        setPhase("color");
      }
      if (activeId || shopOpen) return;
      const el = scrollerRef.current;
      if (!el) return;
      const step = event.shiftKey ? 120 : 56;
      if (event.key === "ArrowRight") {
        el.scrollLeft += step;
        event.preventDefault();
      } else if (event.key === "ArrowLeft") {
        el.scrollLeft -= step;
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        el.scrollTop += step;
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        el.scrollTop -= step;
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, phase, shopOpen]);

  function toggleNight() {
    const next = !night;
    setNight(next);
    document.documentElement.dataset.farmNight = next ? "1" : "0";
  }

  return (
    <div className={`farm-root is-${phase}`}>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <a className="skip-link" href="#farm-links">
        Skip to the list of places
      </a>
      <header className="hud">
        <div>
          <h1 className="wordmark">medevsmaker</h1>
          <p className="tagline">
            the farm
            {farm.sponsors.featuredGate &&
            !Number.isNaN(Date.parse(farm.sponsors.featuredGate.until)) &&
            Date.parse(farm.sponsors.featuredGate.until) > Date.now()
              ? ` · gate: ${farm.sponsors.featuredGate.name}`
              : ""}
          </p>
        </div>
        <div className="hud-actions">
          {phase !== "color" && (
            <button type="button" className="hud-btn skip-btn" onClick={() => setPhase("color")}>
              Skip
            </button>
          )}
          <a className="hud-btn fund-link" href="/open">
            Dream Home Fund <strong>{formatMoney(raised)}</strong>
          </a>
          <button type="button" className="hud-btn" onClick={() => setShopOpen(true)}>
            Help build
          </button>
          <button type="button" className="hud-btn" onClick={toggleNight} aria-pressed={night}>
            {night ? "Night" : "Day"}
          </button>
          <a className="hud-btn" href="/list">
            List
          </a>
        </div>
      </header>
      {phase === "intro" && <div className="intro-bar" aria-hidden="true" />}
      <div
        className="farm-scroll"
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label="Illustrated farm. Scroll or drag to look around."
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          const el = scrollerRef.current;
          if (!el) return;
          drag.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            left: el.scrollLeft,
            top: el.scrollTop,
            moved: false,
          };
          el.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const state = drag.current;
          if (state.id !== event.pointerId) return;
          const dx = event.clientX - state.x;
          const dy = event.clientY - state.y;
          if (!state.moved && Math.hypot(dx, dy) < 6) return;
          state.moved = true;
          const el = scrollerRef.current;
          if (!el) return;
          el.classList.add("is-dragging");
          el.scrollLeft = state.left - dx;
          el.scrollTop = state.top - dy;
          setHint(false);
        }}
        onPointerUp={(event) => {
          if (drag.current.id !== event.pointerId) return;
          if (drag.current.moved) suppressClick.current = true;
          drag.current.id = -1;
          scrollerRef.current?.classList.remove("is-dragging");
        }}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }}
        onScroll={() => setHint(false)}
      >
        <div className="farm-world">
          <FarmScene data={farm} placed={placed} showGrid={showGrid} />
          <div className="farm-ui">
            {placed
              .filter((entry) => entry.item.interactive)
              .map((entry) => {
                const plate = plateFor(entry, farm);
                const price = priceFor(entry.item, farm);
                return (
                  <div
                    key={entry.plot.id}
                    className={`hotspot-wrap${entry.item.featured ? " label-always" : ""}${
                      entry.item.sku || entry.plot.row >= 5 ? " label-bottom" : ""
                    }`}
                    style={{ ...hotspotStyle(entry, farm.world), zIndex: entry.plot.row + 2 }}
                  >
                    <button
                      type="button"
                      className="hotspot"
                      aria-label={`${entry.item.label}${entry.item.place ? `, ${entry.item.place}` : ""}`}
                      onClick={() => setActiveId(entry.plot.id)}
                    />
                    <span className="label">
                      {entry.item.label}
                      {price ? ` · ${price}` : ""}
                    </span>
                    {plate?.name && (
                      <span className="nameplate">
                        {plate.href ? (
                          <a href={plate.href} rel="sponsored nofollow noopener noreferrer" target="_blank">
                            {plate.name}
                          </a>
                        ) : (
                          plate.name
                        )}
                      </span>
                    )}
                    {plate?.message && <span className="message-sign">{plate.message}</span>}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {hint && phase === "color" && <p className="hint">Drag, scroll, or use arrow keys. Tap a building.</p>}
      <nav id="farm-links" className="sr-only" aria-label="Places on the farm">
        <ul>
          {placed
            .filter((entry) => entry.item.interactive)
            .map((entry) => (
              <li key={entry.plot.id}>
                <a href={`/spot/${entry.plot.id}`}>
                  {entry.item.name}
                  {entry.item.pitch ? ` — ${entry.item.pitch}` : ""}
                </a>
              </li>
            ))}
          <li>
            <a href="/list">List view</a>
          </li>
          <li>
            <a href="/open">Dream Home Fund</a>
          </li>
          <li>
            <a href="/blog">Journal</a>
          </li>
        </ul>
      </nav>
      <SpotCard entry={active} data={farm} onClose={() => setActiveId(null)} />
      <ShopDialog open={shopOpen} data={farm} onClose={() => setShopOpen(false)} />
    </div>
  );
}
