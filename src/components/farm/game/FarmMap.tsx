"use client";
import { DESTINATIONS, type DestinationId, type Point } from "@/farm/game/world";
import { walk } from "../scene/walk-state";

export function FarmMap({
  point,
  waypoint,
  compact = false,
  onSelect,
  selected,
}: {
  point: Point;
  waypoint: DestinationId | null;
  compact?: boolean;
  onSelect?: (id: DestinationId) => void;
  selected?: DestinationId;
}) {
  return (
    <svg
      className={`game-map${compact ? " compact" : ""}`}
      viewBox="-46 -46 92 92"
      role="group"
      aria-label="Farm map: north is up. Select a numbered place or use the destination selector. The white dot is your visitor."
    >
      <rect x="-44" y="-44" width="88" height="88" rx="3" fill="#d4d4ac" stroke="#817e5c" />
      <path
        d="M-5 44V8Q-5 3 0 3H32M-40 6H-5M-5 3V-13H28"
        fill="none"
        stroke="#c2aa7c"
        strokeWidth="4"
      />
      <path d="M-38-40Q-36-10-35 8T-37 40" fill="none" stroke="#70a2a0" strokeWidth="1.2" />
      <rect x="-34" y="7" width="22" height="25" fill="#90a36b" rx="2" />
      <rect x="7" y="12" width="25" height="20" fill="#a2b27b" rx="2" />
      {DESTINATIONS.map((place, index) => (
        <g
          key={place.id}
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          aria-label={onSelect ? `Select ${place.name}` : undefined}
          aria-pressed={onSelect ? selected === place.id : undefined}
          onClick={() => onSelect?.(place.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect?.(place.id);
            }
          }}
          className={onSelect ? "map-destination" : undefined}
        >
          <circle cx={place.x} cy={place.z} r="2.4" fill="transparent" />
          {waypoint === place.id && (
            <circle cx={place.x} cy={place.z} r="3" fill="none" stroke="#b77732" strokeWidth=".7" />
          )}
          <circle
            cx={place.x}
            cy={place.z}
            r={compact ? 1.4 : 2}
            stroke={selected === place.id ? "#283e53" : "none"}
            strokeWidth=".8"
            fill={waypoint === place.id ? "#a15c26" : "#596749"}
          />
          {!compact && (
            <text x={place.x} y={place.z + 0.75} textAnchor="middle" fontSize="2.2" fill="#fff9e8">
              {index + 1}
            </text>
          )}
        </g>
      ))}
      {walk.routeStatus === "walking" && (
        <polyline
          pointerEvents="none"
          points={[point, ...walk.route.slice(walk.routeIndex)]
            .map((p) => `${p.x},${p.z}`)
            .join(" ")}
          fill="none"
          stroke="#9b5e28"
          strokeWidth=".7"
          strokeDasharray="1.2 .7"
        />
      )}
      <g aria-label="Tractor trailer" pointerEvents="none">
        <rect
          x={walk.trailerX - 1.6}
          y={walk.trailerZ - 1.6}
          width="3.2"
          height="3.2"
          rx=".5"
          fill="#9a6947"
        />
        <text
          x={walk.trailerX}
          y={walk.trailerZ + 0.8}
          textAnchor="middle"
          fontSize="2.4"
          fill="#fff"
        >
          T
        </text>
      </g>
      <circle
        pointerEvents="none"
        cx={point.x}
        cy={point.z}
        r="2"
        fill="#faf9ec"
        stroke="#283e53"
        strokeWidth=".9"
      />
      <text x="38" y="-37" fontSize="4" fill="#344b37">
        N ↑
      </text>
    </svg>
  );
}
