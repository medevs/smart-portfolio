"use client";
import { practiceStep } from "@/farm/game/tutorial";
import { TutorialBook } from "./TutorialBook";
import { deliveryContext } from "../scene/delivery-state";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { TOUR_STOPS } from "@/farm/game/tour";
import { TourStory } from "./TourStory";
import { FIELD_NOTES, fieldNote } from "@/farm/game/discoveries";
import { waypointBearing } from "@/farm/game/world";
import { canTransferBasket, nearbyApple } from "@/farm/game/journey";
import { nextActivity } from "@/farm/game/progress";
import { destination, distance, nearestPlace, type DestinationId } from "@/farm/game/world";
import { TRACTOR, walk, cancelWalkRoute } from "../scene/walk-state";
import type { LightMode } from "../scene/scene-types";
import type { FarmGame, Panel } from "./useFarmGame";
import { useAmbience } from "./useAmbience";
import { MapPanel } from "./MapPanel";
import { JournalPanel } from "./JournalPanel";
import { SettingsPanel } from "./SettingsPanel";
import { useVisitorSnapshot } from "./useVisitorSnapshot";
import "./game.css";

const TITLES: Record<Exclude<Panel, null>, string> = {
  welcome: "A visit to the Atlas farm",
  map: "Find your way",
  journal: "Your farm journal",
  settings: "Make yourself comfortable",
  pause: "Farm menu",
  controls: "How to explore",
  notes: "The field notebook",
  tour: "A walk through the idea",
  tutorial: "How to play",
  reset: "Begin a new visit?",
};
export function GameOverlay({
  game,
  ready,
  exploring,
  onExplore,
  light,
  onLight,
  onToggleExplore,
  onProduct,
  onHelp,
  raised,
}: {
  onToggleExplore: () => void;
  onProduct: (id: string) => void;
  onHelp: () => void;
  raised: string;
  game: FarmGame;
  ready: boolean;
  exploring: boolean;
  onExplore: () => void;
  light: LightMode;
  onLight: (mode: LightMode) => void;
}) {
  const point = useVisitorSnapshot();
  const nearest = nearestPlace(point),
    next = nextActivity(game.profile.progress);
  const [selected, setSelected] = useState<DestinationId>("studio");
  const opener = useRef<HTMLElement | null>(null),
    fallback = useRef<HTMLButtonElement>(null);
  const leavingMenu = useRef(false);
  function leaveMenu(action: () => void) {
    leavingMenu.current = true;
    game.close();
    action();
  }
  const audio = useAmbience(game.paused, game.profile.preferences.volume);
  function open(panel: Panel) {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    game.setPanel(panel);
  }
  const progress = game.profile.progress;
  const pick = nearbyApple(progress, point);
  const transfer = canTransferBasket(progress, point, deliveryContext());
  const journeyLabel =
    pick >= 0
      ? `Pick apple · ${progress.apples}/3 in basket`
      : transfer
        ? progress.basket === "trailer"
          ? "Unload apple basket"
          : "Load basket into trailer"
        : null;
  const objective =
    next?.id === "orchard"
      ? `Pick apples · ${progress.apples}/3`
      : next?.id === "table" && progress.basket === "trailer"
        ? "Drive to the shared table, then unload"
        : (next?.task ?? "Stay and explore");
  const canAct =
    ready &&
    exploring &&
    !game.paused &&
    !walk.driving &&
    (!!journeyLabel || distance(point, nearest) <= 3.2) &&
    (!!journeyLabel ||
      (next?.id === nearest.id && next.id !== "orchard") ||
      "product" in nearest ||
      !!fieldNote(nearest.id));
  const nearTractor = distance(point, { x: TRACTOR.x + walk.tx, z: TRACTOR.z + walk.tz }) < 2.4;
  const guide = game.practicing ? practiceStep(game.practice, progress, deliveryContext()) : null;
  const routeFeedback =
    point.routeStatus === "walking"
      ? `Walking to ${walk.routeLabel}. Move the controls to take over.`
      : point.routeStatus === "arrived"
        ? `Arrived at ${walk.routeLabel}. Use E or the nearby action button.`
        : point.routeStatus === "blocked"
          ? "No clear walking path. Step into open ground or use Map & travel."
          : "";
  const routing = point.routeStatus === "walking" || Boolean(point.routeRequest);
  const target = game.waypoint ? destination(game.waypoint) : null;
  return (
    <>
      <nav className="game-toolbar" aria-label="Farm menu">
        <button
          className="game-learn"
          onClick={() => open("tutorial")}
          aria-label="How to play · navigation and farm tutorials"
        >
          ?
        </button>
        <button ref={fallback} onClick={() => open("pause")} aria-haspopup="dialog">
          Menu
        </button>
      </nav>
      {!game.panel && ready && (
        <>
          <div className="game-objective-row">
            <button
              className="game-objective"
              onClick={() => open("journal")}
              aria-label={`Open journal: ${game.profile.progress.completed.length} of 5 activities completed. ${next?.task ?? "Visit complete"}`}
            >
              <span>{game.profile.progress.completed.length}/5</span>
              <span>
                <span className="objective-task">{objective}</span>
                {target && (
                  <small>
                    ◇ {target.name} · {Math.round(distance(point, target))} m ·{" "}
                    {waypointBearing(point, target)}
                  </small>
                )}
              </span>
            </button>
            {exploring && !walk.driving && (next || routing) && (
              <button
                className="game-walk-shortcut"
                onClick={() => (routing ? game.stopWalking() : next && game.walkTo(next.id))}
                aria-label={routing ? "Stop guided walking" : `Walk to next task: ${next?.title}`}
                title={routing ? "Stop walking" : "Follow a walking route to your next task"}
              >
                {routing ? "Stop" : "Walk"}
              </button>
            )}
            <button
              className="game-map-shortcut"
              onClick={() => open("map")}
              aria-haspopup="dialog"
            >
              Map & travel
            </button>
          </div>
          {exploring && !game.paused && (
            <>
              <div className="game-context">
                {canAct && (
                  <button onClick={game.act}>
                    E ·{" "}
                    {journeyLabel ??
                      fieldNote(nearest.id)?.action ??
                      (next?.id === nearest.id ? next.task : nearest.name)}
                  </button>
                )}
                {(nearTractor || walk.driving) && (
                  <button
                    onClick={() => {
                      cancelWalkRoute();
                      walk.toggleDrive = true;
                    }}
                  >
                    F · {walk.driving ? "Exit tractor" : "Drive tractor"}
                  </button>
                )}
              </div>
              {!walk.driving && (
                <button
                  className="game-touch-action"
                  aria-pressed={walk.sprinting}
                  onClick={() => {
                    walk.sprinting = !walk.sprinting;
                  }}
                >
                  Sprint
                </button>
              )}
            </>
          )}
        </>
      )}
      {guide && exploring && !game.panel && !game.paused && ready && (
        <aside className="practice-guide" aria-label="Guided farm visit">
          <div className="practice-heading">
            <span className="field-kicker">Guided visit · {guide.count}/7</span>
            <button onClick={game.stopPractice} aria-label="Stop guided visit">
              ×
            </button>
          </div>
          <strong>{guide.title}</strong>
          <p>{guide.instruction}</p>
          <p className="practice-controls">{guide.controls}</p>
          {guide.target && (
            <small>
              {Math.round(distance(point, guide.target))} m · {waypointBearing(point, guide.target)}{" "}
              · follow the ground marker
            </small>
          )}
          <div className="practice-actions">
            <button onClick={() => open("tutorial")}>Open illustrated lesson</button>
            {guide.id === "load" && (
              <button onClick={game.carryOnFoot}>Carry it on foot instead</button>
            )}
            {guide.id === "done" && <button onClick={game.stopPractice}>Keep exploring</button>}
          </div>
        </aside>
      )}
      <div className="game-feedback" role="status" aria-live="polite">
        {game.message || routeFeedback}
      </div>
      {!game.storageAvailable && (
        <p className="game-save-note" role="status">
          Saving is unavailable in this browser. You can still play this visit.
        </p>
      )}
      <Dialog.Root
        open={game.panel !== null}
        onOpenChange={(value) => {
          if (!value) game.close();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            className={`game-overlay${game.panel === "tour" ? " tour-overlay" : ""}`}
          />
          <Dialog.Content
            className={`game-dialog${game.panel === "tour" ? " tour-dialog" : ""}`}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (leavingMenu.current) {
                leavingMenu.current = false;
                return;
              }
              (opener.current?.isConnected ? opener.current : fallback.current)?.focus();
            }}
          >
            <Dialog.Title>{game.panel ? TITLES[game.panel] : "Farm"}</Dialog.Title>
            <Dialog.Description>
              {game.panel === "welcome"
                ? "A small playable world inspired by Morocco’s Middle Atlas. Walk, make and bring something to the shared table."
                : game.panel === "tutorial"
                  ? "Learn the controls, follow a harvest, and bring apples to the shared table. Choose keyboard or touch instructions."
                  : "Your digital farm visit. Guest spaces and gatherings are a future vision, with no bookings or scheduled events."}
            </Dialog.Description>
            <Dialog.Close className="game-close" aria-label="Close game panel">
              ×
            </Dialog.Close>
            {game.panel === "tutorial" && (
              <TutorialBook ready={ready} onPractice={game.startPractice} />
            )}
            {game.panel === "tour" && (
              <TourStory
                index={game.tourIndex}
                onStep={game.tourStep}
                ready={ready}
                onWaypoint={() => {
                  game.setWaypoint(TOUR_STOPS[game.tourIndex].id);
                }}
                onWalk={() => game.travel(TOUR_STOPS[game.tourIndex].id)}
                onHelp={() => leaveMenu(onHelp)}
              />
            )}
            {game.panel === "welcome" && (
              <>
                <p>
                  Begin at the maker’s studio. Collect water, care for the garden, then pick three
                  ripe apples from low branches. Carry your basket to the shared table or deliver it
                  with the tractor trailer. Your journal saves on this browser.
                </p>
                <div className="game-buttons">
                  <button
                    onClick={() => {
                      game.close();
                      if (ready) onExplore();
                    }}
                  >
                    {ready ? "Start walking" : "Explore the map while 3D loads"}
                  </button>
                  <button onClick={() => game.setPanel("tutorial")}>
                    Learn to play · step by step
                  </button>
                  <button onClick={() => game.tourStep(0)}>Take the guided tour</button>
                  <button onClick={() => game.setPanel("controls")}>Learn the controls</button>
                </div>
                <p className="game-muted">
                  3D is the main experience. If your browser cannot start it, the map, projects and
                  accessible view remain available.
                </p>
              </>
            )}
            {game.panel === "map" && (
              <MapPanel
                game={game}
                point={point}
                ready={ready}
                selected={selected}
                onSelect={setSelected}
              />
            )}
            {game.panel === "journal" && <JournalPanel game={game} ready={ready} />}
            {game.panel === "notes" && (
              <>
                <p>
                  {game.profile.discoveries.length}/{FIELD_NOTES.length} places discovered. Walk
                  close and press E to add a note. Map travel alone does not unlock one.
                </p>
                <p role="status">
                  {game.waypoint
                    ? `Waypoint set: ${destination(game.waypoint)?.name}`
                    : "Choose a place to set a waypoint."}
                </p>
                <div className="game-field-notes">
                  {FIELD_NOTES.map((note) => (
                    <article key={note.id}>
                      <h3>
                        {game.profile.discoveries.includes(note.id) ? "✓ " : "◇ "}
                        {note.title}
                      </h3>
                      <p>{game.profile.discoveries.includes(note.id) ? note.text : note.hint}</p>
                      <button onClick={() => game.setWaypoint(note.id)}>Set waypoint</button>
                    </article>
                  ))}
                </div>
                <button onClick={game.close}>Keep exploring</button>
              </>
            )}
            {game.panel === "settings" && (
              <SettingsPanel game={game} light={light} onLight={onLight} audio={audio} />
            )}
            {game.panel === "pause" && (
              <>
                <div className="game-buttons">
                  <button onClick={game.close}>Resume visit</button>
                  <button onClick={() => game.tourStep(0)}>Guided tour · 5 chapters</button>
                  <button
                    disabled={!ready}
                    onClick={() => {
                      onToggleExplore();
                      game.close();
                    }}
                  >
                    {exploring ? "Orbit view" : "Walk the farm"}
                  </button>
                  <button onClick={() => game.setPanel("map")}>Map</button>
                  <button onClick={() => game.setPanel("journal")}>
                    Journal · {game.profile.progress.completed.length}/5
                  </button>
                  <button onClick={() => game.setPanel("notes")}>
                    Field notebook · {game.profile.discoveries.length}/{FIELD_NOTES.length}
                  </button>
                  <button onClick={() => game.setPanel("tutorial")}>How to play · tutorials</button>
                  <button onClick={() => game.setPanel("controls")}>Quick controls</button>
                  <button onClick={() => game.setPanel("settings")}>Settings</button>
                </div>
                <h3>Made here</h3>
                <div className="game-buttons">
                  {[
                    ["about", "Maker’s studio"],
                    ["reelstyles", "ReelStyles"],
                    ["mentorclone", "MentorClone"],
                    ["talkthedoc", "TalkTheDoc"],
                  ].map(([id, label]) => (
                    <button key={id} onClick={() => leaveMenu(() => onProduct(id))}>
                      {label}
                    </button>
                  ))}
                </div>
                <nav className="game-menu-links" aria-label="More from the farm">
                  <a href="/open">Dream Home Fund · {raised}</a>
                  <button onClick={() => leaveMenu(onHelp)}>Help build</button>
                  <a href="/gather">Future gatherings & visits ↗</a>
                  <a href="/references">The place · regional references</a>
                  <a href="/list">All places & projects</a>
                </nav>
              </>
            )}
            {game.panel === "controls" && (
              <>
                <dl className="game-controls">
                  <dt>W A S D / arrow keys / movement pad</dt>
                  <dd>
                    Walk relative to the view. Shift or Sprint moves faster. Drag the pad gently for
                    a slow walk. Go around fences, trunks and solid objects; the pond is not
                    swimmable. The open gate leads through the central fence.
                  </dd>
                  <dt>E / action button</dt>
                  <dd>Interact with a nearby place. Follow the journal in order.</dd>
                  <dt>F / tractor button</dt>
                  <dd>
                    Enter the tractor when nearby, or exit safely. E loads/unloads your basket at
                    the back of a stopped trailer. W/S accelerate forward/reverse; A/D steer while
                    moving. Release to brake. Opposite input brakes before changing direction.
                  </dd>
                  <dt>H / ? / How to play</dt>
                  <dd>Open the illustrated tutorials or start a guided visit.</dd>
                  <dt>Walk / Map → Walk me there</dt>
                  <dd>
                    Follow a walking route to your next task or a selected place. Movement controls,
                    Stop or a menu interrupt the route. E or the nearby action is still needed when
                    you arrive. Exit the tractor first.
                  </dd>
                  <dt>M / J / Escape</dt>
                  <dd>Map, journal, pause. Close a panel with Escape.</dd>
                  <dt>Wheel / pinch / + and −</dt>
                  <dd>
                    Zoom closer or farther. Drag the scene to turn the camera around your character.
                    Forward follows the direction you are looking. Map & travel skips long walks.
                  </dd>
                  <dt>Orbit / Walk</dt>
                  <dd>
                    Switch between a view of the whole farm and following your visitor. Drag in
                    orbit to look around.
                  </dd>
                </dl>
                <p>
                  Settings can reduce detail and ambient motion. Your journal, preferences and last
                  safe walking position save locally. Tractor parking resets when you reload; loaded
                  apples return to your hands.
                </p>
                <button onClick={game.close}>Ready to explore</button>
              </>
            )}
            {game.panel === "reset" && (
              <>
                <p>
                  This clears the five activities, field notes and inventory in this browser. Your
                  graphics and sound-volume preferences stay.
                </p>
                <div className="game-buttons">
                  <button onClick={game.reset}>Reset my farm journal</button>
                  <button onClick={() => game.setPanel("journal")}>Keep my progress</button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
