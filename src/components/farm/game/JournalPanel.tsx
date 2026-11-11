"use client";
import { ACTIVITIES, nextActivity } from "@/farm/game/progress";
import { FIELD_NOTES } from "@/farm/game/discoveries";
import { destination } from "@/farm/game/world";
import { pickedApples } from "@/farm/game/journey";
import type { FarmGame } from "./useFarmGame";
import { walk } from "../scene/walk-state";

export function JournalPanel({ game, ready }: { game: FarmGame; ready: boolean }) {
  const progress = game.profile.progress;
  const next = nextActivity(progress);
  return (
    <>
      {next && (
        <section className="journal-next" aria-label="Next farm activity">
          <span className="field-kicker">Your next activity</span>
          <h3>{next.title}</h3>
          <p>{next.detail} Follow the ground marker, then use E or the action button.</p>
          <div className="game-buttons">
            <button disabled={!ready || walk.driving} onClick={() => game.walkTo(next.id)}>
              Walk to this activity
            </button>
            <button disabled={!ready} onClick={() => game.travel(next.id)}>
              Travel to this activity
            </button>
            <button onClick={() => game.setPanel("tutorial")}>Show me how to play</button>
          </div>
          {!ready && (
            <p className="game-muted">Walking and activities need the running 3D world.</p>
          )}
          {ready && walk.driving && (
            <p className="game-muted">Park and exit the tractor to follow a walking route.</p>
          )}
        </section>
      )}
      <div className="game-journey">
        <h3>Orchard to tea table</h3>
        <p>
          {progress.completed.includes("table")
            ? `The table is ready. ${progress.delivery === "tractor" ? "You brought the harvest by tractor." : "You brought something to share."}`
            : `${pickedApples(progress).length}/3 apples picked · ${progress.apples > 0 ? (progress.basket === "trailer" ? "Basket in the trailer" : "Basket in your hands") : "An empty basket awaits your harvest"}`}
        </p>
        <p>
          Pick ripe apples from three low branches marked on the orchard ground. Carry them to the
          table, or stop the tractor, load at the trailer’s rear, drive over and unload. The map
          marks the trailer with T.
        </p>
        <p className="game-muted">
          Your harvest saves here. On reload, cargo returns to your hands and the tractor parks at
          the gate.
        </p>
      </div>
      <p>
        Water {game.profile.progress.water}/3 · Apples {game.profile.progress.apples}/3 ·{" "}
        {game.storageAvailable ? "Saved on this browser" : "This visit only — saving unavailable"}
      </p>
      <p role="status">
        {game.waypoint && (
          <>
            Waypoint set: {destination(game.waypoint)?.name}{" "}
            <button onClick={() => game.setWaypoint(null)}>Clear waypoint</button>
          </>
        )}
      </p>
      <ol className="game-tasks">
        {ACTIVITIES.map((activity) => (
          <li key={activity.id} data-current={next?.id === activity.id || undefined}>
            <span
              aria-label={
                game.profile.progress.completed.includes(activity.id)
                  ? "Completed"
                  : "Not completed"
              }
            >
              {game.profile.progress.completed.includes(activity.id) ? "✓" : "○"}
            </span>
            <div>
              <strong>{activity.title}</strong>
              <small>
                {progress.completed.includes(activity.id)
                  ? "Completed"
                  : next?.id === activity.id
                    ? "Do this next"
                    : `After: ${next?.title ?? "your visit"}`}
              </small>
              <p>{activity.detail}</p>
            </div>
            <button onClick={() => game.setWaypoint(activity.id)}>Waypoint</button>
          </li>
        ))}
      </ol>
      <div className="game-buttons">
        <button onClick={() => game.setPanel("notes")}>
          Field notebook · {game.profile.discoveries.length}/{FIELD_NOTES.length}
        </button>
        <button onClick={() => game.setPanel("reset")}>Start a new journal…</button>
      </div>
    </>
  );
}
