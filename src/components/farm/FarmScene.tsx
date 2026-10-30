import { hotspotBox } from "@/farm/grid";
import { sprites, type SpriteProps } from "@/farm/sprites";
import type { Placed } from "@/farm/loadFarm";
import type { FarmData, SponsorPlate } from "@/farm/types";

const STARS: Array<[number, number, number]> = [
  [80, 36, 1.2], [140, 70, 1.6], [210, 28, 1], [280, 90, 1.4], [360, 40, 1.1],
  [430, 78, 1.8], [520, 30, 1.2], [600, 64, 1], [690, 24, 1.5], [760, 88, 1.2],
  [840, 36, 1.7], [920, 58, 1], [1010, 26, 1.4], [1080, 80, 1.2], [1160, 34, 1.6],
  [1240, 70, 1.1], [1320, 28, 1.5], [180, 120, 1], [640, 110, 1.3], [980, 100, 1],
  [300, 210, 1.2], [520, 240, 1], [760, 200, 1.4], [1040, 230, 1.1], [1240, 210, 1.3],
  [160, 260, 1], [880, 250, 1.2], [420, 180, 1.1],
];

function plateFor(entry: Placed, data: FarmData): SponsorPlate | null {
  if (entry.plot.sponsor) return entry.plot.sponsor;
  if (entry.item.landmark) return data.sponsors.landmarks[entry.item.landmark]?.sponsor ?? null;
  if (entry.item.id === "youtube") return data.sponsors.scarecrowWeek.sponsor;
  if (entry.item.id === "dog") return data.sponsors.dog.sponsor;
  return null;
}

export function FarmScene({
  data,
  placed,
  showGrid,
}: {
  data: FarmData;
  placed: Placed[];
  showGrid: boolean;
}) {
  const { world, grid } = data;

  return (
    <svg
      className="farm-scene"
      viewBox={`0 0 ${world.width} ${world.height}`}
      role="img"
      aria-label="Illustrated farm with a barn, farmhouse, fields, and animals"
    >
      <defs>
        <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3c3494" />
          <stop offset="32%" stopColor="#a85cb8" />
          <stop offset="62%" stopColor="#f08a78" />
          <stop offset="100%" stopColor="#ffc56e" />
        </linearGradient>
        <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#07091f" />
          <stop offset="46%" stopColor="#1a1c4e" />
          <stop offset="100%" stopColor="#3a2a58" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe1a3" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffe1a3" stopOpacity="0" />
        </radialGradient>
        <mask id="moonMask">
          <circle cx="1180" cy="110" r="22" fill="white" />
          <circle cx="1192" cy="102" r="18" fill="black" />
        </mask>
      </defs>

      <g className="sky-day">
        <rect x="0" y="0" width={world.width} height={520} fill="url(#skyDay)" />
      </g>
      <g className="sky-night">
        <rect x="0" y="0" width={world.width} height={540} fill="url(#skyNight)" />
      </g>

      <g className="sun">
        <circle cx="250" cy="128" r="48" fill="#ffe08a" opacity="0.35" className="shade" />
        <circle cx="250" cy="128" r="26" pathLength={1} className="ink" style={{ ["--fill" as string]: "#ffe08a", ["--stroke" as string]: "#e0a050" }} />
      </g>
      <g className="moon">
        <circle cx="1180" cy="110" r="22" fill="#f6f1dc" mask="url(#moonMask)" />
      </g>
      <g className="stars">
        {STARS.map(([x, y, r], i) => (
          <circle key={i} className="star" cx={x} cy={y} r={r} fill="#fff8e8" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
        ))}
      </g>

      <g className="drift clouds">
        <ellipse cx="180" cy="150" rx="46" ry="16" pathLength={1} className="ink" style={{ ["--fill" as string]: "#ffd0e0" }} />
        <ellipse cx="214" cy="146" rx="28" ry="14" pathLength={1} className="ink" style={{ ["--fill" as string]: "#fff" }} />
      </g>
      <g className="drift clouds" style={{ animationDuration: "62s", animationDelay: "-20s" }}>
        <ellipse cx="640" cy="110" rx="54" ry="18" pathLength={1} className="ink" style={{ ["--fill" as string]: "#f7b6c8" }} />
        <ellipse cx="688" cy="104" rx="30" ry="14" pathLength={1} className="ink" style={{ ["--fill" as string]: "#ffe3d2" }} />
      </g>
      <g className="drift clouds" style={{ animationDuration: "74s", animationDelay: "-8s" }}>
        <ellipse cx="1040" cy="150" rx="40" ry="14" pathLength={1} className="ink" style={{ ["--fill" as string]: "#fff" }} />
        <ellipse cx="1076" cy="146" rx="24" ry="12" pathLength={1} className="ink" style={{ ["--fill" as string]: "#ffd0e0" }} />
      </g>

      <g className="bird" style={{ ["--draw-delay" as string]: "1.2s" }}>
        <path d="M40,180 q10,-8 20,0 q10,-8 20,0" className="line" pathLength={1} />
      </g>
      <g className="bird" style={{ animationDelay: "-6s", ["--draw-delay" as string]: "1.5s" }}>
        <path d="M520,150 q8,-7 16,0 q8,-7 16,0" className="line" pathLength={1} />
      </g>
      <g className="bird" style={{ animationDelay: "-11s" }}>
        <path d="M900,190 q9,-8 18,0 q9,-8 18,0" className="line" pathLength={1} />
      </g>

      <path
        className="ink"
        pathLength={1}
        style={{ ["--fill" as string]: "#6d5aa8", ["--draw-delay" as string]: "0s" }}
        d="M0,470 C180,400 320,450 480,390 C660,320 820,430 1000,370 C1160,320 1300,390 1440,340 L1440,520 L0,520 Z"
      />
      <path
        className="ink"
        pathLength={1}
        style={{ ["--fill" as string]: "#3f9a4c", ["--draw-delay" as string]: "0.15s" }}
        d="M0,500 C160,470 300,540 520,500 C760,456 980,540 1200,490 C1320,470 1380,500 1440,488 L1440,900 L0,900 Z"
      />
      <path
        className="ink"
        pathLength={1}
        style={{ ["--fill" as string]: "#2f7d3e", ["--draw-delay" as string]: "0.25s" }}
        d="M0,640 C200,600 340,700 560,650 C820,590 1040,710 1440,640 L1440,900 L0,900 Z"
      />
      <path
        className="line"
        pathLength={1}
        style={{ ["--stroke" as string]: "#e6c99a", ["--sw" as string]: "16", ["--draw-delay" as string]: "0.4s" }}
        d="M430,900 C460,820 500,760 560,720 C620,680 700,690 760,660"
      />

      {showGrid && (
        <g className="grid-debug">
          {Array.from({ length: grid.cols * grid.rows }, (_, i) => {
            const col = i % grid.cols;
            const row = Math.floor(i / grid.cols);
            return (
              <rect
                key={i}
                x={grid.originX + col * grid.cellW}
                y={grid.originY + row * grid.cellH}
                width={grid.cellW}
                height={grid.cellH}
                fill="none"
                stroke="rgba(80,40,20,0.35)"
              />
            );
          })}
        </g>
      )}

      {placed.map((entry, index) => {
        const Sprite = sprites[entry.item.sprite];
        const delay = `${Math.min(index * 0.08, 1.8)}s`;
        const flip = entry.plot.flip ? -1 : 1;
        const plate = plateFor(entry, data);
        const dogName = entry.item.id === "dog" ? data.sponsors.dog.name : plate?.name;
        const props: SpriteProps = {
          footW: entry.anchor.footW,
          footH: entry.anchor.footH,
          name: dogName,
        };
        return (
          <g
            key={entry.plot.id}
            data-plot-id={entry.plot.id}
            data-item-id={entry.item.id}
            data-sponsorable={entry.plot.sponsorable ? "true" : undefined}
            className={plate?.golden ? "is-golden" : undefined}
            transform={`translate(${entry.anchor.x} ${entry.anchor.y}) scale(${flip} 1)`}
            style={{ ["--draw-delay" as string]: delay, ["--anim-delay" as string]: `${entry.plot.animDelay ?? 0}s` }}
          >
            {Sprite ? Sprite(props) : null}
          </g>
        );
      })}

      <rect className="night-veil" x="0" y="430" width={world.width} height={world.height - 430} />

      {placed.flatMap((entry) => {
        const lights = entry.item.lights;
        if (!lights?.length) return [];
        const sx = entry.plot.flip ? -1 : 1;
        return lights.map((light, i) => (
          <circle
            key={`${entry.plot.id}-light-${i}`}
            className="win-glow"
            cx={entry.anchor.x + light.x * sx}
            cy={entry.anchor.y + light.y}
            r={(light.r ?? 10) * 1.7}
            fill="url(#glow)"
          />
        ));
      })}

      <g className="fireflies">
        {[
          [180, 640],
          [260, 700],
          [820, 680],
          [980, 640],
          [1100, 720],
          [400, 760],
        ].map(([x, y], i) => (
          <circle key={i} className="firefly" cx={x} cy={y} r="2.2" fill="#ffe08a" style={{ animationDelay: `${i * 0.6}s` }} />
        ))}
      </g>
    </svg>
  );
}

export function hotspotStyle(entry: Placed, world: FarmData["world"]) {
  return hotspotBox(entry.anchor, entry.item.visual, world);
}

export { plateFor };
