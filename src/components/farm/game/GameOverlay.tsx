"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { CAMERA_MIN, CAMERA_MAX, cameraView, setCameraDistance, resetCameraView } from "../scene/camera-view";
import { TOUR_STOPS } from "@/farm/game/tour";
import { TourStory } from "./TourStory";
import { FIELD_NOTES, fieldNote } from "@/farm/game/discoveries";
import { WEATHER } from "@/farm/game/weather";
import { waypointBearing } from "@/farm/game/world";
import { ACTIVITIES, nextActivity } from "@/farm/game/progress";
import { DESTINATIONS, destination, distance, nearestPlace, type DestinationId, type Point } from "@/farm/game/world";
import { TRACTOR, walk } from "../scene/walk-state";
import type { LightMode } from "../scene/FarmCanvas";
import type { FarmGame, Panel } from "./useFarmGame";
import { useAmbience } from "./useAmbience";
import "./game.css";

function usePosition() {
  const [point, setPoint] = useState<Point>({ x: 0, z: 8 });
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const next = walk.driving ? { x: TRACTOR.x + walk.tx, z: TRACTOR.z + walk.tz } : { x: walk.px, z: walk.pz };
      setPoint(previous => previous.x === next.x && previous.z === next.z ? previous : next);
    }, 200);
    return () => clearInterval(timer);
  }, []);
  return point;
}
function FarmMap({ point, waypoint, compact = false }: { point: Point; waypoint: DestinationId | null; compact?: boolean }) {
  return <svg className={`game-map${compact ? " compact" : ""}`} viewBox="-46 -46 92 92" role="img" aria-label="Farm map: north is up. Numbered markers match the destination selector. The white dot is your visitor.">
    <rect x="-44" y="-44" width="88" height="88" rx="3" fill="#d4d4ac" stroke="#817e5c" />
    <path d="M-5 44V8Q-5 3 0 3H32M-40 6H-5M-5 3V-13H28" fill="none" stroke="#c2aa7c" strokeWidth="4" />
    <path d="M-38-40Q-36-10-35 8T-37 40" fill="none" stroke="#70a2a0" strokeWidth="1.2" />
    <rect x="-34" y="7" width="22" height="25" fill="#90a36b" rx="2" /><rect x="7" y="12" width="25" height="20" fill="#a2b27b" rx="2" />
    {DESTINATIONS.map((place, index) => <g key={place.id}>
      {waypoint === place.id && <circle cx={place.x} cy={place.z} r="3" fill="none" stroke="#b77732" strokeWidth=".7" />}
      <circle cx={place.x} cy={place.z} r={compact ? 1.4 : 2} fill={waypoint === place.id ? "#a15c26" : "#596749"} />
      {!compact && <text x={place.x} y={place.z + .75} textAnchor="middle" fontSize="2.2" fill="#fff9e8">{index + 1}</text>}
    </g>)}
    <circle cx={point.x} cy={point.z} r="2" fill="#faf9ec" stroke="#283e53" strokeWidth=".9" /><text x="38" y="-37" fontSize="4" fill="#344b37">N ↑</text>
  </svg>;
}
const TITLES: Record<Exclude<Panel, null>, string> = { welcome: "A visit to the Atlas farm", map: "Find your way", journal: "Your farm journal", settings: "Make yourself comfortable", pause: "Farm menu", controls: "How to explore", notes: "The field notebook", tour: "A walk through the idea", reset: "Begin a new visit?" };
export function GameOverlay({ game, ready, exploring, onExplore, light, onLight, onToggleExplore, onProduct, onHelp, raised }: {
  onToggleExplore: () => void; onProduct: (id: string) => void; onHelp: () => void; raised: string;
  game: FarmGame; ready: boolean; exploring: boolean; onExplore: () => void; light: LightMode; onLight: (mode: LightMode) => void;
}) {
  const point = usePosition();
  const nearest = nearestPlace(point), next = nextActivity(game.profile.progress);
  const [selected, setSelected] = useState<DestinationId>("studio");
  const selectedPlace = destination(selected)!;
  const opener = useRef<HTMLElement | null>(null), fallback = useRef<HTMLButtonElement>(null);
  const leavingMenu = useRef(false);
  function leaveMenu(action: () => void) { leavingMenu.current = true; game.close(); action(); }
  const audio = useAmbience(game.paused, game.profile.preferences.volume);
  function open(panel: Panel) { opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; game.setPanel(panel); }
  const prefs = game.profile.preferences;
  const canAct = ready && exploring && !game.paused && !walk.driving && distance(point, nearest) <= 3.2 && (next?.id === nearest.id || "product" in nearest || !!fieldNote(nearest.id));
  const nearTractor = distance(point, { x: TRACTOR.x + walk.tx, z: TRACTOR.z + walk.tz }) < 2.4;
  const target = game.waypoint ? destination(game.waypoint) : null;
  return <>
    <nav className="game-toolbar" aria-label="Farm menu">
      <button ref={fallback} onClick={() => open("pause")} aria-haspopup="dialog">Menu</button>
    </nav>
    {!game.panel && ready && <>
      <button className="game-objective" onClick={() => open("journal")} aria-label={`Open journal: ${game.profile.progress.completed.length} of 5 activities completed. ${next?.task ?? "Visit complete"}`}>
        <span>{game.profile.progress.completed.length}/5</span><span>{next?.task ?? "Stay and explore"}{target && <small>◇ {target.name} · {Math.round(distance(point, target))} m · {waypointBearing(point, target)}</small>}</span>
      </button>
      {exploring && !game.paused && <>
        <div className="game-context">
          {canAct && <button onClick={game.act}>E · {fieldNote(nearest.id)?.action ?? (next?.id === nearest.id ? next.task : nearest.name)}</button>}
          {(nearTractor || walk.driving) && <button onClick={() => { walk.toggleDrive = true; }}>F · {walk.driving ? "Exit tractor" : "Drive tractor"}</button>}
        </div>
        {!walk.driving && <button className="game-touch-action" aria-pressed={walk.sprinting} onClick={() => { walk.sprinting = !walk.sprinting; }}>Sprint</button>}
      </>}
    </>}
    <div className="game-feedback" role="status" aria-live="polite">{game.message}</div>
    {!game.storageAvailable && <p className="game-save-note" role="status">Saving is unavailable in this browser. You can still play this visit.</p>}
    <Dialog.Root open={game.panel !== null} onOpenChange={value => { if (!value) game.close(); }}>
      <Dialog.Portal><Dialog.Overlay className={`game-overlay${game.panel === "tour" ? " tour-overlay" : ""}`} /><Dialog.Content className={`game-dialog${game.panel === "tour" ? " tour-dialog" : ""}`} onCloseAutoFocus={event => { event.preventDefault(); if (leavingMenu.current) { leavingMenu.current = false; return; } (opener.current?.isConnected ? opener.current : fallback.current)?.focus(); }}>
        <Dialog.Title>{game.panel ? TITLES[game.panel] : "Farm"}</Dialog.Title>
        <Dialog.Description>{game.panel === "welcome" ? "A small playable world inspired by Morocco’s Middle Atlas. Walk, make and bring something to the shared table." : "Your digital farm visit. Guest spaces and gatherings are a future vision, with no bookings or scheduled events."}</Dialog.Description>
        <Dialog.Close className="game-close" aria-label="Close game panel">×</Dialog.Close>
        {game.panel === "tour" && <TourStory index={game.tourIndex} onStep={game.tourStep} ready={ready}
          onWaypoint={() => { game.setWaypoint(TOUR_STOPS[game.tourIndex].id); }}
          onWalk={() => game.travel(TOUR_STOPS[game.tourIndex].id)} onHelp={() => leaveMenu(onHelp)} />}
        {game.panel === "welcome" && <><p>Begin at the maker’s studio. Collect water, care for the garden and pick apples to share. Your journal saves on this browser.</p><div className="game-buttons"><button onClick={() => { game.close(); if (ready) onExplore(); }}>{ready ? "Start walking" : "Explore the map while 3D loads"}</button><button onClick={() => game.tourStep(0)}>Take the guided tour</button><button onClick={() => game.setPanel("controls")}>Learn the controls</button></div><p className="game-muted">3D is the main experience. If your browser cannot start it, the map, projects and accessible view remain available.</p></>}
        {game.panel === "map" && <div className="game-map-layout"><FarmMap point={point} waypoint={game.waypoint} /><div><label htmlFor="game-destination">Destination</label><select id="game-destination" value={selected} onChange={e => setSelected(e.target.value as DestinationId)}>{DESTINATIONS.map((place, index) => <option key={place.id} value={place.id}>{index + 1}. {place.name}</option>)}</select><p>{selectedPlace.note}</p><p className="game-waypoint" role="status">{game.waypoint ? `Waypoint set: ${destination(game.waypoint)?.name}` : "Choose a place, then set a waypoint."}</p><div className="game-buttons"><button onClick={() => game.setWaypoint(selected)}>Set waypoint</button><button disabled={!ready} onClick={() => game.travel(selected)}>Travel here</button></div>{!ready && <p className="game-muted">Travel needs the running 3D world. Setting a waypoint is available now.</p>}<p className="game-muted">Travel moves your visitor; activities still need an interaction at the destination.</p></div></div>}
        {game.panel === "journal" && <><p>Water {game.profile.progress.water}/3 · Apples {game.profile.progress.apples}/3 · {game.storageAvailable ? "Saved on this browser" : "This visit only — saving unavailable"}</p><p role="status">{game.waypoint && <>Waypoint set: {destination(game.waypoint)?.name} <button onClick={() => game.setWaypoint(null)}>Clear waypoint</button></>}</p><ol className="game-tasks">{ACTIVITIES.map(activity => <li key={activity.id}><span aria-label={game.profile.progress.completed.includes(activity.id) ? "Completed" : "Not completed"}>{game.profile.progress.completed.includes(activity.id) ? "✓" : "○"}</span><div><strong>{activity.title}</strong><p>{activity.detail}</p></div><button onClick={() => game.setWaypoint(activity.id)}>Waypoint</button></li>)}</ol><div className="game-buttons"><button onClick={() => game.setPanel("notes")}>Field notebook · {game.profile.discoveries.length}/{FIELD_NOTES.length}</button><button onClick={() => game.setPanel("reset")}>Start a new journal…</button></div></>}
        {game.panel === "notes" && <><p>{game.profile.discoveries.length}/{FIELD_NOTES.length} places discovered. Walk close and press E to add a note. Map travel alone does not unlock one.</p><p role="status">{game.waypoint ? `Waypoint set: ${destination(game.waypoint)?.name}` : "Choose a place to set a waypoint."}</p><div className="game-field-notes">{FIELD_NOTES.map(note => <article key={note.id}><h3>{game.profile.discoveries.includes(note.id) ? "✓ " : "◇ "}{note.title}</h3><p>{game.profile.discoveries.includes(note.id) ? note.text : note.hint}</p><button onClick={() => game.setWaypoint(note.id)}>Set waypoint</button></article>)}</div><button onClick={game.close}>Keep exploring</button></>}
        {game.panel === "settings" && <div className="game-settings">
          <label>Camera distance · close to wide<input type="range" min={CAMERA_MIN} max={CAMERA_MAX} step=".2" defaultValue={cameraView.distance} onChange={e => setCameraDistance(Number(e.target.value))} /></label>
          <button onClick={() => { resetCameraView(); game.close(); }}>Reset camera & resume</button>
          <p className="game-muted">Wheel or pinch to zoom. Drag the scene to look around your character. Keyboard: + closer, − wider. Camera controls apply when the world resumes.</p>
          <label>Weather<select value={prefs.weather} onChange={e => game.preferences({ weather: e.target.value as typeof prefs.weather })}>{Object.entries(WEATHER).map(([value, option]) => <option key={value} value={value}>{option.label}</option>)}</select></label>
          <p className="game-muted">Choose the atmosphere of this digital visit. Rain softens the sky and shelters the bees; breeze stirs the grass. This is not a live forecast. Ambient motion stops with Reduce ambient motion.</p>
          <label>Graphics<select value={prefs.quality} onChange={e => game.preferences({ quality: e.target.value as typeof prefs.quality })}><option value="auto">Automatic</option><option value="low">Low · no postprocessing</option><option value="high">High · more detail</option></select></label>
          <label><input type="checkbox" checked={prefs.reducedMotion} onChange={e => game.preferences({ reducedMotion: e.target.checked })} /> Reduce ambient motion</label>
          <label><input type="checkbox" checked={prefs.daylight} onChange={e => game.preferences({ daylight: e.target.checked })} /> Automatic daylight cycle</label>
          <label>Time of day<select value={light} onChange={e => { game.preferences({ daylight: false }); onLight(e.target.value as LightMode); }}><option value="day">Day</option><option value="sunset">Sunset</option><option value="night">Night</option></select></label>
          <div><button onClick={() => void audio.toggle()}>{audio.enabled ? "Mute ambience" : "Enable quiet wind ambience"}</button><p className="game-muted">Synthesized wind, off at the start of every visit.</p>{audio.error && <p role="status">{audio.error}</p>}</div>
          <label>Sound volume<input type="range" min="0" max="1" step="0.05" value={prefs.volume} onChange={e => game.preferences({ volume: Number(e.target.value) })} /></label>
        </div>}
        {game.panel === "pause" && <>
          <div className="game-buttons"><button onClick={game.close}>Resume visit</button><button onClick={() => game.tourStep(0)}>Guided tour · 5 chapters</button><button disabled={!ready} onClick={() => { onToggleExplore(); game.close(); }}>{exploring ? "Orbit view" : "Walk the farm"}</button><button onClick={() => game.setPanel("map")}>Map</button><button onClick={() => game.setPanel("journal")}>Journal · {game.profile.progress.completed.length}/5</button><button onClick={() => game.setPanel("notes")}>Field notebook · {game.profile.discoveries.length}/{FIELD_NOTES.length}</button><button onClick={() => game.setPanel("controls")}>Controls</button><button onClick={() => game.setPanel("settings")}>Settings</button></div>
          <h3>Made here</h3><div className="game-buttons">{[["about", "Maker’s studio"], ["reelstyles", "ReelStyles"], ["mentorclone", "MentorClone"], ["talkthedoc", "TalkTheDoc"]].map(([id, label]) => <button key={id} onClick={() => leaveMenu(() => onProduct(id))}>{label}</button>)}</div>
          <nav className="game-menu-links" aria-label="More from the farm"><a href="/open">Dream Home Fund · {raised}</a><button onClick={() => leaveMenu(onHelp)}>Help build</button><a href="/gather">Future gatherings & visits ↗</a><a href="/references">The place · regional references</a><a href="/list">All places & projects</a></nav>
        </>}
        {game.panel === "controls" && <><dl className="game-controls"><dt>W A S D / movement pad</dt><dd>Walk. Shift or Sprint moves faster.</dd><dt>E / action button</dt><dd>Interact with a nearby place. Follow the journal in order.</dd><dt>F / tractor button</dt><dd>Enter the tractor when nearby, or exit safely. W/S drive; A/D steer.</dd><dt>M / J / Escape</dt><dd>Map, journal, pause. Close a panel with Escape.</dd><dt>Wheel / pinch / + and −</dt><dd>Zoom closer or farther. Drag the scene to turn the camera around your character. WASD keeps its compass direction.</dd><dt>Orbit / Walk</dt><dd>Switch between a view of the whole farm and following your visitor. Drag in orbit to look around.</dd></dl><p>Settings can reduce detail and ambient motion. Your journal, preferences and last safe walking position save locally. Tractor parking resets when you reload.</p><button onClick={game.close}>Ready to explore</button></>}
        {game.panel === "reset" && <><p>This clears the five activities, field notes and inventory in this browser. Your graphics and sound-volume preferences stay.</p><div className="game-buttons"><button onClick={game.reset}>Reset my farm journal</button><button onClick={() => game.setPanel("journal")}>Keep my progress</button></div></>}
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
  </>;
}
