"use client";
import { FarmMap } from "./FarmMap";
import { walk } from "../scene/walk-state";
import { nextActivity } from "@/farm/game/progress";
import { DESTINATIONS, destination, type DestinationId, type Point } from "@/farm/game/world";
import type { FarmGame } from "./useFarmGame";

export function MapPanel({
  game,
  point,
  ready,
  selected,
  onSelect,
}: {
  game: FarmGame;
  point: Point;
  ready: boolean;
  selected: DestinationId;
  onSelect: (id: DestinationId) => void;
}) {
  const selectedPlace = destination(selected)!;
  const next = nextActivity(game.profile.progress);
  const setSelected = onSelect;
  return (
    <div className="game-map-layout">
      <FarmMap point={point} waypoint={game.waypoint} onSelect={setSelected} selected={selected} />
      <div>
        <label htmlFor="game-destination">Destination</label>
        <select
          id="game-destination"
          value={selected}
          onChange={(e) => setSelected(e.target.value as DestinationId)}
        >
          {DESTINATIONS.map((place, index) => (
            <option key={place.id} value={place.id}>
              {index + 1}. {place.name}
            </option>
          ))}
        </select>
        <p>{selectedPlace.note}</p>
        <p className="game-waypoint" role="status">
          {game.waypoint
            ? `Waypoint set: ${destination(game.waypoint)?.name}`
            : "Choose a place, then set a waypoint."}
        </p>
        <div className="game-buttons">
          {next && (
            <button disabled={!ready} onClick={() => game.travel(next.id)}>
              Travel to next task
            </button>
          )}
          <button onClick={() => game.setWaypoint(selected)}>Set waypoint</button>
          <button disabled={!ready || walk.driving} onClick={() => game.walkTo(selected)}>
            Walk me there
          </button>
          <button disabled={!ready} onClick={() => game.travel(selected)}>
            Travel here
          </button>
        </div>
        {ready && walk.driving && (
          <p className="game-muted">Park and exit the tractor to use a walking route.</p>
        )}
        {!ready && (
          <p className="game-muted">
            Travel needs the running 3D world. Setting a waypoint is available now.
          </p>
        )}
        <p className="game-muted">
          Select a numbered place on the map. Walk me there follows a path around buildings and
          orchard trunks. Move the controls or open a menu to stop. Fast travel skips the walk.
          Activities still need an interaction when you arrive.
        </p>
      </div>
    </div>
  );
}
