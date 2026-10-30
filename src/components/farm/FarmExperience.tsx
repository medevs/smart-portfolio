"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { formatMoney } from "@/config/shop";
import { findSpot, fundRaised, placePlots } from "@/farm/loadFarm";
import type { FarmData } from "@/farm/types";
import { FarmPanorama } from "./FarmPanorama";
import { ShopDialog, SpotCard } from "./SpotCard";
import type { LightMode } from "./scene/FarmCanvas";
import { resetWalkInput, walk } from "./scene/walk-state";
import "./farm.css";

const FarmCanvas = dynamic(() => import("./scene/FarmCanvas"), { ssr: false });

const BOOT = `(function(){try{var p=new URLSearchParams(location.search);var phase=p.get("phase");var time=p.get("time");var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;var spot=p.get("spot")||p.get("open");var onSpot=location.pathname.indexOf("/spot/")===0;var mode=phase==="sketch"&&!reduce?"sketch":(phase==="color"||reduce||spot||onSpot?"color":"intro");document.documentElement.dataset.farmPhase=mode;document.documentElement.dataset.farmReduce=reduce?"1":"0";var h=new Date().getHours();var light=time==="night"||time==="sunset"||time==="day"?time:(h<6||h>=20?"night":(h>=17?"sunset":"day"));document.documentElement.dataset.farmLight=light;document.documentElement.dataset.farmNight=light==="night"?"1":"0";}catch(e){}})();`;

class FarmBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() {
    if (this.state.failed) return <div className="farm-fallback"><p>The farm couldn’t load on this device.</p><a href="/list">Explore all places in list view →</a></div>;
    return this.props.children;
  }
}

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
  const [sceneRequested, setSceneRequested] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  function openScene() {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    if (!gl) {
      setSceneFailed(true);
      return;
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    setSceneFailed(false);
    setSceneRequested(true);
    setPhase("color");
  }

  useEffect(() => {
    if (!sceneRequested || ready || sceneFailed) return;
    const timeout = window.setTimeout(() => { setSceneFailed(true); setSceneRequested(false); }, 25000);
    return () => window.clearTimeout(timeout);
  }, [sceneRequested, ready, sceneFailed]);

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

  const controlsPaused = !explore || shopOpen || Boolean(active);
  useEffect(() => {
    walk.paused = controlsPaused;
    resetWalkInput();
    return () => {
      walk.paused = true;
      resetWalkInput();
    };
  }, [controlsPaused]);

  function cycleLight() {
    const next: LightMode = light === "day" ? "sunset" : light === "sunset" ? "night" : "day";
    setLight(next);
    document.documentElement.dataset.farmLight = next;
    document.documentElement.dataset.farmNight = next === "night" ? "1" : "0";
  }

  return (
    <div className={`farm-root is-${phase}${!ready || sceneFailed ? " is-panorama" : ""}`}>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <a className="skip-link" href="/list">
        Skip to the list of places
      </a>
      <header className="hud">
        <div>
          <h1 className="wordmark">medevsmaker</h1>
          <p className="tagline">Middle Atlas · Morocco{featured ? ` · gate: ${featured.name}` : ""}</p>
        </div>
        <div className="hud-actions">
          {sceneRequested && !sceneFailed && phase !== "color" && (
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
          {ready && !sceneFailed && <button type="button" className="hud-btn" onClick={() => setExplore((value) => !value)} aria-pressed={explore}>
            {explore ? "Orbit" : "Walk"}
          </button>}
          {ready && !sceneFailed && <button type="button" className="hud-btn" onClick={cycleLight} aria-pressed={light !== "day"}>
            {light === "night" ? "Night" : light === "sunset" ? "Sunset" : "Day"}
          </button>}
          <Link className="hud-btn" href="/gather">Gather</Link>
          <Link className="hud-btn" href="/references">The place</Link>
          <a className="hud-btn" href="/list">
            List
          </a>
        </div>
      </header>
      {sceneRequested && phase === "intro" && <div className="intro-bar" aria-hidden="true" />}
      <div className="farm-stage" onPointerDown={() => setHint(false)}>
        {(!ready || sceneFailed) && <FarmPanorama onSelect={setActiveId} onExplore={openScene} loading={sceneRequested && !sceneFailed} unavailable={sceneFailed} />}
        {sceneRequested && !sceneFailed && <div className={`farm-canvas-wrap${ready ? " is-ready" : ""}`}>
        <FarmBoundary onError={() => { setSceneFailed(true); setSceneRequested(false); setReady(false); }}>
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
          onReady={() => { setReady(true); setPhase("color"); }}
          onProgress={setProgress}
          onSketchDone={() => setPhase("color")}
          showGrid={showGrid}
          plain={plain}
          detail={ready}
          explore={explore && ready}
        />
        </FarmBoundary>
        </div>}
        {explore && ready && !sceneFailed && !controlsPaused && (
          <>
            <div
              className="joystick"
              role="group"
              aria-label="Movement pad: drag up, down, left or right; keyboard users can use WASD"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                const rect = event.currentTarget.getBoundingClientRect();
                walk.stickX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
                walk.stickY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
              }}
              onPointerMove={(event) => {
                if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                const rect = event.currentTarget.getBoundingClientRect();
                walk.stickX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
                walk.stickY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
              }}
              onPointerUp={resetWalkInput}
              onPointerCancel={resetWalkInput}
              onLostPointerCapture={resetWalkInput}
            />
            <button type="button" className="hud-btn tractor-action" onClick={() => { walk.toggleDrive = true; }}>
              Enter / exit tractor
            </button>
          </>
        )}
        {sceneRequested && !ready && !sceneFailed && <div className="scene-loading" role="status"><span className="scene-loading-dot" /> Opening the 3D world · {Math.round(progress)}% <button onClick={() => { setSceneRequested(false); setSceneFailed(false); }}>Cancel</button></div>}
      </div>
      {explore && phase === "color" && (
        <p className="hint">WASD or the pad to move. Use F or the tractor button beside the tractor to enter or exit.</p>
      )}
      {hint && ready && !sceneFailed && !explore && phase === "color" && <p className="hint">Drag to look around. Click a building.</p>}
      <nav id="farm-links" hidden aria-label="Places on the farm">
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
            <Link href="/blog">Journal</Link>
          </li>
        </ul>
      </nav>
      <SpotCard entry={active} data={farm} onClose={() => setActiveId(null)} />
      <ShopDialog open={shopOpen} data={farm} onClose={() => setShopOpen(false)} />
    </div>
  );
}
