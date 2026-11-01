"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { formatMoney } from "@/config/shop";
import { findSpot, fundRaised, placePlots } from "@/farm/loadFarm";
import type { FarmData } from "@/farm/types";
import { FarmPanorama } from "./FarmPanorama";
import { ShopDialog, SpotCard } from "./SpotCard";
import type { LightMode } from "./scene/FarmCanvas";
import { resetWalkInput, walk } from "./scene/walk-state";
import { useFarmGame } from "./game/useFarmGame";
import { TOUR_STOPS } from "@/farm/game/tour";
import { GameOverlay } from "./game/GameOverlay";
import "./farm.css";

const FarmCanvas = dynamic(() => import("./scene/FarmCanvas"), { ssr: false });

const BOOT = `(function(){try{var p=new URLSearchParams(location.search);var phase=p.get("phase");var time=p.get("time");var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.dataset.farmPhase=phase==="sketch"&&!reduce?"sketch":"color";document.documentElement.dataset.farmReduce=reduce?"1":"0";var light=time==="night"||time==="sunset"?time:"day";document.documentElement.dataset.farmLight=light;document.documentElement.dataset.farmNight=light==="night"?"1":"0";}catch(e){}})();`;

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
  const [phase, setPhase] = useState<"intro" | "sketch" | "color">("color");
  const [light, setLight] = useState<LightMode>("day");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [quality, setQuality] = useState<"low" | "high">("high");
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    visibility(); document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  const [plain, setPlain] = useState(false);
  const [hint, setHint] = useState(true);
  const [explore, setExplore] = useState(false);
  const [walkFailed, setWalkFailed] = useState(false);
  const [sceneRequested, setSceneRequested] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [sceneFailed, setSceneFailed] = useState(false);

  const failScene = useCallback(() => {
    setSceneFailed(true);
    setSceneRequested(false);
    setReady(false);
    setExplore(false);
  }, []);

  function openScene() {
    setReady(false);
    setSceneFailed(false);
    setAttempt(value => value + 1);
    setSceneRequested(true);
    setPhase("color");
  }

  useEffect(() => {
    if (!sceneRequested || ready || sceneFailed) return;
    const timeout = window.setTimeout(failScene, 25000);
    return () => window.clearTimeout(timeout);
  }, [sceneRequested, ready, sceneFailed, failScene]);

  const active = activeId ? findSpot(placed, activeId) : null;
  const raised = fundRaised(farm.fund);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const featured =
    farm.sponsors.featuredGate &&
    !Number.isNaN(Date.parse(farm.sponsors.featuredGate.until)) &&
    Date.parse(farm.sponsors.featuredGate.until) > now
      ? farm.sponsors.featuredGate
      : null;

  useEffect(() => {
    const mode = document.documentElement.dataset.farmPhase;
    const nextPhase = mode === "sketch" ? "sketch" : mode === "intro" ? "intro" : "color";
    // Hydrate the server-inserted browser bootstrap and query state after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const game = useFarmGame({ ready: ready && !sceneFailed, exploring: explore, externalPaused: hidden || shopOpen || Boolean(active), onExplore: () => { setWalkFailed(false); setExplore(true); }, onProduct: setActiveId });
  const effectiveReduced = reducedMotion || game.profile.preferences.reducedMotion;
  const effectiveQuality = game.profile.preferences.quality === "auto" ? quality : game.profile.preferences.quality;
  const controlsPaused = !explore || game.paused;
  const updateLight = useCallback((next: LightMode) => {
    setLight(next);
    document.documentElement.dataset.farmLight = next;
    document.documentElement.dataset.farmNight = next === "night" ? "1" : "0";
  }, []);
  useEffect(() => {
    walk.paused = controlsPaused;
    resetWalkInput();
    return () => {
      walk.paused = true;
      resetWalkInput();
    };
  }, [controlsPaused]);

  return (
    <div className={`farm-root is-${phase}${sceneFailed ? " is-panorama" : " is-world"}${explore ? " is-walking" : ""}`}>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <a className="skip-link" href="/list">
        Skip to the list of places
      </a>
      <header className="hud">
        <div>
          <h1 className="wordmark">medevsmaker</h1>
          <p className="tagline">Middle Atlas · Morocco{featured ? ` · gate: ${featured.name}` : ""}</p>
        </div>
      </header>
      {sceneRequested && phase === "intro" && <div className="intro-bar" aria-hidden="true" />}
      <div className="farm-stage" onPointerDown={() => setHint(false)}>
        {sceneFailed && <FarmPanorama onSelect={setActiveId} onTour={() => game.tourStep(0)} onExplore={openScene} loading={sceneRequested && !sceneFailed} unavailable={sceneFailed} />}
        {sceneRequested && !sceneFailed && <div className={`farm-canvas-wrap${ready ? " is-ready" : ""}`}>
        <FarmBoundary key={attempt} onError={failScene}>
        <FarmCanvas
          placed={placed}
          farm={farm}
          light={light}
          phase={phase}
          reducedMotion={effectiveReduced}
          quality={effectiveQuality}
          adaptive={game.profile.preferences.quality === "auto"}
          paused={game.paused}
          progress={game.profile.progress}
          waypoint={game.waypoint}
          cycle={game.profile.preferences.daylight}
          weather={game.profile.preferences.weather}
          tour={game.panel === "tour" ? TOUR_STOPS[game.tourIndex] : null}
          onLight={updateLight}
          activeId={activeId}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          onSelect={(id) => {
            setActiveId(id);
            setHint(false);
          }}
          onReady={() => { setReady(true); setPhase("color"); }}
          onFailure={failScene}
          onWalkFailure={() => { setExplore(false); setWalkFailed(true); }}
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
          </>
        )}
        {sceneRequested && !ready && !sceneFailed && <div className="scene-loading" role="status"><span className="scene-loading-dot" /> Opening the 3D farm… <button onClick={failScene}>Use the accessible view</button></div>}
      </div>
      <GameOverlay game={game} ready={ready && !sceneFailed} exploring={explore} onExplore={() => setExplore(true)} light={light} onLight={updateLight} onToggleExplore={() => { setWalkFailed(false); setExplore(value => !value); }} onProduct={setActiveId} onHelp={() => setShopOpen(true)} raised={formatMoney(raised)} />
      {walkFailed && <p className="hint" role="status">Walking couldn’t start. You can still orbit and open projects; choose Walk in the Menu to retry.</p>}
      {hint && !walkFailed && ready && !sceneFailed && !explore && phase === "color" && <p className="hint">Drag to look around. Click a building.</p>}
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
