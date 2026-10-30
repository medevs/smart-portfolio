"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/config/shop";
import { findSpot, fundRaised, placePlots } from "@/farm/loadFarm";
import type { FarmData } from "@/farm/types";
import { ShopDialog, SpotCard } from "./SpotCard";
import type { LightMode } from "./scene/FarmCanvas";
import { walk } from "./scene/walk-state";
import "./farm.css";

const FarmCanvas = dynamic(() => import("./scene/FarmCanvas"), { ssr: false });

const BOOT = `(function(){try{var p=new URLSearchParams(location.search);var phase=p.get("phase");var time=p.get("time");var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;var spot=p.get("spot")||p.get("open");var onSpot=location.pathname.indexOf("/spot/")===0;var mode=phase==="sketch"&&!reduce?"sketch":(phase==="color"||reduce||spot||onSpot?"color":"intro");document.documentElement.dataset.farmPhase=mode;document.documentElement.dataset.farmReduce=reduce?"1":"0";var h=new Date().getHours();var light=time==="night"||time==="sunset"||time==="day"?time:(h<6||h>=20?"night":(h>=17?"sunset":"day"));document.documentElement.dataset.farmLight=light;document.documentElement.dataset.farmNight=light==="night"?"1":"0";}catch(e){}})();`;

function readSpot() {
  const params = new URLSearchParams(window.location.search);
  const fromPath = window.location.pathname.match(/^\/spot\/([^/]+)/);
  return (fromPath && decodeURIComponent(fromPath[1])) || params.get("spot") || params.get("open") || "";
}

export function FarmExperience({ farm, initialSpot = null }: { farm: FarmData; initialSpot?: string | null }) {
  const placed = useMemo(() => placePlots(farm), [farm]);
  const [phase, setPhase] = useState<"intro" | "sketch" | "color">("intro");
  const [light, setLight] = useState<LightMode>("day");
  const [progress, setProgress] = useState(4);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [quality, setQuality] = useState<"low" | "high">("high");
  const [plain, setPlain] = useState(false);
  const [hint, setHint] = useState(true);
  const [explore, setExplore] = useState(false);

  const active = activeId ? findSpot(placed, activeId) : null;
  const raised = fundRaised(farm.fund);
  const featured =
    farm.sponsors.featuredGate &&
    !Number.isNaN(Date.parse(farm.sponsors.featuredGate.until)) &&
    Date.parse(farm.sponsors.featuredGate.until) > Date.now()
      ? farm.sponsors.featuredGate
      : null;

  useEffect(() => {
    const mode = document.documentElement.dataset.farmPhase;
    const nextPhase = mode === "sketch" ? "sketch" : mode === "color" ? "color" : "intro";
    setPhase(nextPhase);
    const stored = document.documentElement.dataset.farmLight;
    setLight(stored === "night" || stored === "sunset" || stored === "day" ? stored : "day");
    setReducedMotion(document.documentElement.dataset.farmReduce === "1");
    setShowGrid(new URLSearchParams(window.location.search).get("grid") === "1");
    setPlain(new URLSearchParams(window.location.search).get("raw") === "1");
    setQuality(window.matchMedia("(max-width: 800px), (pointer: coarse)").matches ? "low" : "high");
    const spot = initialSpot || readSpot();
    if (spot && nextPhase !== "sketch") setActiveId(spot);
    document.documentElement.dataset.farmReady = "1";
  }, [initialSpot]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && phase !== "color") setPhase("color");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  function cycleLight() {
    const next: LightMode = light === "day" ? "sunset" : light === "sunset" ? "night" : "day";
    setLight(next);
    document.documentElement.dataset.farmLight = next;
    document.documentElement.dataset.farmNight = next === "night" ? "1" : "0";
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
          <p className="tagline">the farm{featured ? ` · gate: ${featured.name}` : ""}</p>
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
          <button type="button" className="hud-btn" onClick={() => setExplore((value) => !value)} aria-pressed={explore}>
            {explore ? "Orbit" : "Walk"}
          </button>
          <button type="button" className="hud-btn" onClick={cycleLight} aria-pressed={light !== "day"}>
            {light === "night" ? "Night" : light === "sunset" ? "Sunset" : "Day"}
          </button>
          <a className="hud-btn" href="/list">
            List
          </a>
        </div>
      </header>
      {phase === "intro" && <div className="intro-bar" aria-hidden="true" />}
      <div className="farm-stage" onPointerDown={() => setHint(false)}>
        <FarmCanvas
          placed={placed}
          farm={farm}
          light={light}
          phase={phase}
          reducedMotion={reducedMotion}
          quality={quality}
          activeId={activeId}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          onSelect={(id) => {
            setActiveId(id);
            setHint(false);
          }}
          onReady={() => setReady(true)}
          onProgress={setProgress}
          onSketchDone={() => setPhase("color")}
          showGrid={showGrid}
          plain={plain}
          detail={ready}
          explore={explore}
        />
        {explore && (
          <div
            className="joystick"
            onPointerDown={(event) => {
              (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 0) return;
              const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
              walk.stickX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
              walk.stickY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
            }}
            onPointerUp={() => {
              walk.stickX = 0;
              walk.stickY = 0;
            }}
          />
        )}
        <div className={`farm-loader${ready ? " is-done" : ""}`} aria-hidden={ready}>
          <p className="loader-kicker">medevsmaker</p>
          <p className="loader-title">Raising the farm</p>
          <div className="loader-track">
            <div className="loader-bar" style={{ width: `${Math.max(8, Math.min(100, progress))}%`, animation: "none" }} />
          </div>
          <p className="loader-kicker">{Math.round(progress)}%</p>
        </div>
      </div>
      {hint && phase === "color" && <p className="hint">Drag to look around. Click a building.</p>}
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
