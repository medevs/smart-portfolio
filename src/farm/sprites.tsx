import type { CSSProperties, ReactNode, SVGProps } from "react";

export type SpriteProps = {
  footW: number;
  footH: number;
  name?: string | null;
};

type Ink = { fill: string; stroke?: string; sw?: number };

function ink({ fill, stroke = "#4a3428", sw = 2.15 }: Ink): CSSProperties {
  return { ["--fill" as string]: fill, ["--stroke" as string]: stroke, ["--sw" as string]: String(sw) };
}

function R({ fill, stroke, sw, ...rest }: SVGProps<SVGRectElement> & Ink) {
  return <rect pathLength={1} className="ink" style={ink({ fill, stroke, sw })} {...rest} />;
}
function E({ fill, stroke, sw, ...rest }: SVGProps<SVGEllipseElement> & Ink) {
  return <ellipse pathLength={1} className="ink" style={ink({ fill, stroke, sw })} {...rest} />;
}
function C({ fill, stroke, sw, ...rest }: SVGProps<SVGCircleElement> & Ink) {
  return <circle pathLength={1} className="ink" style={ink({ fill, stroke, sw })} {...rest} />;
}
function P({ fill, stroke, sw, ...rest }: SVGProps<SVGPathElement> & Ink) {
  return <path pathLength={1} className="ink" style={ink({ fill, stroke, sw })} {...rest} />;
}
function Ln({ stroke = "#4a3428", sw = 2.15, ...rest }: SVGProps<SVGPathElement> & { stroke?: string; sw?: number }) {
  return (
    <path
      pathLength={1}
      className="line"
      style={ink({ fill: "none", stroke, sw })}
      {...rest}
    />
  );
}

function Shade({ children }: { children: ReactNode }) {
  return <g className="shade">{children}</g>;
}

export function Barn() {
  return (
    <g>
      <Shade>
        <ellipse cx="8" cy="8" rx="150" ry="14" fill="#000" opacity="0.16" />
      </Shade>
      <P d="M-158,-8 L158,-8 L168,0 L-168,0 Z" fill="#c9b59a" />
      <R x={-150} y={-168} width={300} height={160} fill="#e1534a" />
      <R x={-150} y={-28} width={300} height={14} fill="#f6ead2" />
      <R x={-150} y={-168} width={300} height={12} fill="#f3d7a2" />
      <P d="M-168,-156 L-96,-246 L0,-278 L96,-246 L168,-156 Z" fill="#7e2c2a" />
      <P d="M-96,-246 L0,-278 L96,-246 L62,-228 L0,-252 L-62,-228 Z" fill="#a13b34" />
      <R x={-78} y={-112} width={70} height={112} fill="#f7f1e4" stroke="#7e2c2a" />
      <R x={8} y={-112} width={70} height={112} fill="#f3e6d0" stroke="#7e2c2a" />
      <Ln d="M-70,-102 L-16,-12 M-16,-102 L-70,-12" stroke="#e1534a" sw={3} />
      <Ln d="M16,-102 L62,-12 M62,-102 L16,-12" stroke="#e1534a" sw={3} />
      <C cx={-8} cy={-58} r={4} fill="#4a3428" sw={1} />
      <C cx={8} cy={-58} r={4} fill="#4a3428" sw={1} />
      <R x={-34} y={-214} width={68} height={44} rx={4} fill="#f6ead2" />
      <Ln d="M0,-214 V-170 M-34,-192 H34" stroke="#4a3428" sw={2} />
      <R x={-16} y={-320} width={32} height={42} fill="#f6ead2" />
      <P d="M-24,-320 L0,-348 L24,-320 Z" fill="#7e2c2a" />
      <C cx={0} cy={-300} r={5} fill="#9fd4e0" />
      <R x={-118} y={-120} width={28} height={34} fill="#f6ead2" />
      <R x={90} y={-120} width={28} height={34} fill="#f6ead2" />
      <Ln d="M-104,-120 V-86 M-118,-103 H-90" />
      <Ln d="M104,-120 V-86 M90,-103 H118" />
    </g>
  );
}

export function Farmhouse() {
  return (
    <g>
      <Shade>
        <ellipse cx="0" cy="8" rx="120" ry="12" fill="#000" opacity="0.15" />
      </Shade>
      <R x={-108} y={-150} width={216} height={150} fill="#f4e2c4" />
      <R x={-108} y={-78} width={216} height={8} fill="#e7c99a" />
      <P d="M-124,-146 L0,-236 L124,-146 Z" fill="#8d552e" />
      <P d="M-70,-196 L0,-236 L70,-196 L40,-184 L0,-210 L-40,-184 Z" fill="#a86a38" />
      <R x={62} y={-250} width={22} height={48} fill="#c47a52" />
      <R x={58} y={-258} width={30} height={10} fill="#6e4632" />
      <g className="smoke">
        <ellipse cx="73" cy="-270" rx="7" ry="5" fill="#f7f4ef" />
      </g>
      <g className="smoke" style={{ animationDelay: "1s" }}>
        <ellipse cx="80" cy="-278" rx="8" ry="6" fill="#f7f4ef" />
      </g>
      <g className="smoke" style={{ animationDelay: "1.8s" }}>
        <ellipse cx="70" cy="-286" rx="6" ry="5" fill="#fff" />
      </g>
      <R x={-86} y={-128} width={32} height={36} fill="#b7e0ea" />
      <R x={54} y={-128} width={32} height={36} fill="#b7e0ea" />
      <R x={-86} y={-64} width={32} height={36} fill="#b7e0ea" />
      <Ln d="M-70,-128 V-92 M-86,-110 H-54" />
      <Ln d="M70,-128 V-92 M54,-110 H86" />
      <Ln d="M-70,-64 V-28 M-86,-46 H-54" />
      <R x={-16} y={-72} width={36} height={72} rx={2} fill="#8d552e" />
      <C cx={12} cy={-36} r={3} fill="#f6ead2" sw={1} />
      <R x={-118} y={-36} width={236} height={8} fill="#c4844a" />
      <R x={-100} y={-28} width={8} height={28} fill="#8d552e" />
      <R x={92} y={-28} width={8} height={28} fill="#8d552e" />
      <P d="M-28,0 L-28,-8 L-8,-8 L-8,0" fill="#d8c4a4" sw={1.4} />
      <R x={-130} y={-96} width={22} height={16} fill="#e56b93" />
      <C cx={-124} cy={-100} r={5} fill="#f4a0be" sw={1.2} />
      <C cx={-114} cy={-98} r={4} fill="#fff" sw={1} />
    </g>
  );
}

export function Silo() {
  return (
    <g>
      <Shade>
        <ellipse cx="0" cy="6" rx="52" ry="10" fill="#000" opacity="0.15" />
      </Shade>
      <E cx={0} cy={0} rx={48} ry={12} fill="#d9d0c0" />
      <R x={-48} y={-210} width={96} height={210} fill="#f3ecdf" />
      <R x={16} y={-210} width={32} height={210} fill="#e4d9c8" />
      <E cx={0} cy={-210} rx={48} ry={14} fill="#f7f1e6" />
      <P d="M-40,-214 Q0,-268 40,-214 Z" fill="#d4534a" />
      <E cx={0} cy={-214} rx={40} ry={10} fill="#e36a60" />
      <R x={-48} y={-150} width={96} height={10} fill="#c45a4a" />
      <R x={-48} y={-70} width={96} height={8} fill="#c9b59a" />
      <R x={-16} y={-52} width={32} height={52} rx={2} fill="#8d552e" />
      <Ln d="M36,-20 V-180" stroke="#8d552e" sw={2} />
      <Ln d="M32,-40 H44 M32,-80 H44 M32,-120 H44 M32,-160 H44" stroke="#8d552e" sw={1.6} />
      <C cx={0} cy={-90} r={7} fill="#b7e0ea" />
    </g>
  );
}

export function Shed() {
  return (
    <g>
      <Shade>
        <ellipse cx="0" cy="6" rx="80" ry="10" fill="#000" opacity="0.14" />
      </Shade>
      <R x={-78} y={-96} width={156} height={96} fill="#e7c99a" />
      <P d="M-92,-92 L0,-150 L92,-92 Z" fill="#6e4632" />
      <R x={-28} y={-64} width={40} height={64} fill="#8d552e" />
      <R x={-62} y={-78} width={36} height={32} fill="#f6ead2" />
      <R x={-58} y={-74} width={8} height={24} fill="#d4534a" sw={1} />
      <R x={-48} y={-74} width={8} height={24} fill="#1f9a8e" sw={1} />
      <R x={-38} y={-74} width={8} height={24} fill="#e2b14a" sw={1} />
      <C cx={-8} cy={-34} r={3} fill="#f6ead2" sw={1} />
      <R x={48} y={-70} width={14} height={22} fill="#f6ead2" />
      <C cx={62} cy={-108} r={6} fill="#f6c453" />
    </g>
  );
}

export function Windmill() {
  return (
    <g>
      <Shade>
        <ellipse cx="0" cy="6" rx="36" ry="8" fill="#000" opacity="0.14" />
      </Shade>
      <P d="M-34,0 L-22,-168 L22,-168 L34,0 Z" fill="#f0e2c8" />
      <P d="M-22,-168 L0,-196 L22,-168 Z" fill="#8d552e" />
      <R x={-12} y={-48} width={24} height={40} fill="#8d552e" />
      <C cx={0} cy={-120} r={6} fill="#b7e0ea" />
      <g transform="translate(0,-168)">
        <g className="blades">
          <R x={-8} y={-86} width={16} height={78} rx={5} fill="#e07a55" />
          <R x={-8} y={-86} width={16} height={78} rx={5} fill="#f2b56b" transform="rotate(90)" />
          <R x={-8} y={-86} width={16} height={78} rx={5} fill="#e07a55" transform="rotate(180)" />
          <R x={-8} y={-86} width={16} height={78} rx={5} fill="#f2b56b" transform="rotate(270)" />
          <C cx={0} cy={0} r={9} fill="#f6ead2" />
        </g>
      </g>
    </g>
  );
}

export function WaterTower() {
  return (
    <g>
      <Shade>
        <ellipse cx="0" cy="6" rx="40" ry="8" fill="#000" opacity="0.14" />
      </Shade>
      <Ln d="M-28,0 L-16,-150 M28,0 L16,-150 M-28,0 L28,0 M-8,-40 H8 M-12,-90 H12" sw={3} />
      <R x={-36} y={-196} width={72} height={48} rx={8} fill="#d7e4ea" />
      <E cx={0} cy={-196} rx={36} ry={12} fill="#eef6f8" />
      <P d="M-30,-196 L0,-228 L30,-196 Z" fill="#8d552e" />
      <R x={-10} y={-168} width={20} height={16} fill="#4a3428" sw={1.4} />
    </g>
  );
}

export function Coop() {
  return (
    <g>
      <Shade>
        <ellipse cx="0" cy="6" rx="60" ry="8" fill="#000" opacity="0.12" />
      </Shade>
      <R x={-58} y={-70} width={116} height={62} fill="#f0d7a4" />
      <P d="M-70,-66 L0,-112 L70,-66 Z" fill="#c45a4a" />
      <R x={-18} y={-40} width={28} height={40} fill="#8d552e" />
      <C cx={28} cy={-46} r={10} fill="#b7e0ea" />
      <P d="M-58,-8 L-88,0 L-58,0 Z" fill="#c9a06a" />
      <R x={40} y={-28} width={22} height={16} fill="#e7c99a" />
    </g>
  );
}

export function Pond({ footW, footH }: SpriteProps) {
  return (
    <g>
      <E cx={0} cy={-footH * 0.35} rx={footW * 0.42} ry={footH * 0.32} fill="#1d7ea0" />
      <E cx={-8} cy={-footH * 0.4} rx={footW * 0.28} ry={footH * 0.16} fill="#3aa7c9" />
      <E cx={18} cy={-footH * 0.28} rx={16} ry={8} fill="#7ed0a0" sw={1.4} />
      <C cx={22} cy={-footH * 0.34} r={4} fill="#f4a0be" sw={1.2} />
      <Ln d={`M${-footW * 0.36},${-footH * 0.2} q6,-22 0,-36`} stroke="#2f7d3e" sw={2} />
      <Ln d={`M${footW * 0.34},${-footH * 0.15} q-4,-20 6,-34`} stroke="#1f8f5a" sw={2} />
    </g>
  );
}

export function Tree() {
  return (
    <g>
      <P d="M-8,0 L-4,-52 L4,-52 L8,0 Z" fill="#8d552e" />
      <C cx={0} cy={-78} r={28} fill="#1f9a8e" />
      <C cx={-22} cy={-64} r={20} fill="#12756c" />
      <C cx={20} cy={-60} r={18} fill="#2fbfb0" />
      <C cx={-6} cy={-96} r={16} fill="#178f84" />
    </g>
  );
}

export function Blossom() {
  return (
    <g>
      <P d="M-7,0 L-3,-48 L3,-48 L7,0 Z" fill="#8d552e" />
      <C cx={0} cy={-74} r={26} fill="#f4a0be" />
      <C cx={-18} cy={-60} r={16} fill="#e56b93" />
      <C cx={18} cy={-58} r={15} fill="#ffd0e0" />
      <C cx={2} cy={-92} r={12} fill="#f7b6c8" />
    </g>
  );
}

export function Wheat({ footW, footH }: SpriteProps) {
  const stalks = Math.max(6, Math.round(footW / 14));
  return (
    <g>
      <R x={-footW / 2} y={-footH} width={footW} height={footH} rx={10} fill="#e2b14a" />
      {Array.from({ length: stalks }, (_, i) => {
        const x = -footW / 2 + 8 + i * ((footW - 16) / stalks);
        return <Ln key={i} d={`M${x},${-6} Q${x + 2},${-footH * 0.7} ${x - 2},${-footH + 4}`} stroke="#c48a2e" sw={1.4} />;
      })}
    </g>
  );
}

export function Crops({ footW, footH }: SpriteProps) {
  return (
    <g>
      <R x={-footW / 2} y={-footH} width={footW} height={footH} rx={8} fill="#6b442c" />
      {Array.from({ length: 4 }, (_, i) => (
        <E
          key={i}
          cx={-footW / 2 + footW * (0.18 + i * 0.22)}
          cy={-footH * 0.55}
          rx={footW * 0.08}
          ry={footH * 0.28}
          fill="#2f9a4a"
        />
      ))}
    </g>
  );
}

export function Scarecrow() {
  return (
    <g>
      <Ln d="M0,0 V-150" sw={3} />
      <Ln d="M-42,-108 H42" sw={3} />
      <R x={-28} y={-118} width={56} height={40} fill="#d4534a" />
      <C cx={0} cy={-132} r={14} fill="#f0d2a4" />
      <P d="M-16,-142 L0,-168 L16,-142 Z" fill="#3a2c24" />
      <C cx={-4} cy={-134} r={1.6} fill="#2a211c" sw={1} />
      <C cx={4} cy={-134} r={1.6} fill="#2a211c" sw={1} />
      <R x={18} y={-96} width={36} height={22} rx={3} fill="#f6ead2" />
      <P d="M28,-90 L36,-86 L28,-82 Z" fill="#d4534a" sw={1} />
    </g>
  );
}

function BirdBody({ body, comb }: { body: string; comb: string }) {
  return (
    <g>
      <E cx={0} cy={-16} rx={16} ry={11} fill={body} />
      <g className="anim-peck">
        <C cx={14} cy={-22} r={7} fill={body} />
        <P d="M20,-24 L28,-22 L20,-19 Z" fill="#e2b14a" sw={1} />
        <C cx={16} cy={-24} r={1.3} fill="#2a211c" sw={1} />
        <P d={`M12,-28 L14,-33 L17,-28 Z`} fill={comb} sw={1} />
      </g>
      <Ln d="M-6,0 L-8,8 M4,0 L8,8" sw={1.6} />
    </g>
  );
}

export function Chicken() {
  return <BirdBody body="#f7f1e2" comb="#e1534a" />;
}
export function Hen() {
  return <BirdBody body="#e7b15a" comb="#c4534a" />;
}

export function Cow() {
  return (
    <g>
      <Shade>
        <ellipse cx="0" cy="4" rx="48" ry="7" fill="#000" opacity="0.12" />
      </Shade>
      <E cx={-4} cy={-28} rx={36} ry={20} fill="#f7f1e4" />
      <E cx={-20} cy={-34} rx={10} ry={7} fill="#5c4638" />
      <E cx={6} cy={-24} rx={8} ry={6} fill="#5c4638" />
      <R x={-28} y={-18} width={6} height={18} fill="#f7f1e4" />
      <R x={-10} y={-16} width={6} height={16} fill="#f7f1e4" />
      <R x={8} y={-16} width={6} height={16} fill="#f7f1e4" />
      <R x={22} y={-18} width={6} height={18} fill="#f7f1e4" />
      <g className="anim-tail">
        <P d="M30,-30 Q46,-20 40,-8" fill="none" stroke="#5c4638" sw={2} />
      </g>
      <C cx={-34} cy={-36} r={12} fill="#f7f1e4" />
      <E cx={-44} cy={-34} rx={6} ry={4} fill="#f3b7c4" />
      <C cx={-38} cy={-38} r={1.4} fill="#2a211c" sw={1} />
      <P d="M-42,-46 L-38,-54 L-34,-46" fill="#f6ead2" sw={1} />
      <E cx={-8} cy={-16} rx={6} ry={4} fill="#f3b7c4" />
    </g>
  );
}

export function Cat() {
  return (
    <g>
      <E cx={0} cy={-12} rx={16} ry={10} fill="#e8a05a" />
      <C cx={8} cy={-24} r={9} fill="#e8a05a" />
      <P d="M2,-30 L4,-40 L10,-30 Z" fill="#e8a05a" sw={1.2} />
      <P d="M10,-30 L16,-40 L18,-28 Z" fill="#e8a05a" sw={1.2} />
      <C cx={6} cy={-25} r={1.2} fill="#2a211c" sw={1} />
      <C cx={12} cy={-25} r={1.2} fill="#2a211c" sw={1} />
      <g className="anim-tail">
        <P d="M-14,-14 Q-28,-28 -20,-36" fill="none" stroke="#c4844a" sw={2.4} />
      </g>
    </g>
  );
}

export function Dog({ name }: SpriteProps) {
  return (
    <g>
      <E cx={-2} cy={-16} rx={20} ry={12} fill="#c47a3a" />
      <C cx={16} cy={-28} r={10} fill="#d08a48" />
      <P d="M8,-34 L6,-46 L16,-34 Z" fill="#a86830" sw={1.2} />
      <P d="M16,-36 L22,-46 L24,-32 Z" fill="#a86830" sw={1.2} />
      <C cx={14} cy={-29} r={1.3} fill="#2a211c" sw={1} />
      <E cx={22} cy={-26} rx={5} ry={3} fill="#f3b7c4" />
      <g className="anim-tail">
        <P d="M-20,-18 Q-34,-8 -28,0" fill="none" stroke="#a86830" sw={2.6} />
      </g>
      <R x={-8} y={-22} width={16} height={6} rx={2} fill="#d4534a" sw={1} />
      {name ? (
        <text x="0" y="14" textAnchor="middle" className="ink-text" style={{ fontSize: 9, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
          {name}
        </text>
      ) : null}
    </g>
  );
}

export function Tractor() {
  return (
    <g>
      <C cx={-28} cy={-16} r={18} fill="#3a2c24" />
      <C cx={-28} cy={-16} r={8} fill="#c9b59a" />
      <C cx={28} cy={-12} r={10} fill="#3a2c24" />
      <C cx={28} cy={-12} r={4} fill="#c9b59a" />
      <R x={-20} y={-48} width={46} height={26} rx={4} fill="#d4534a" />
      <R x={8} y={-64} width={22} height={18} fill="#b7e0ea" />
      <R x={-36} y={-40} width={20} height={12} fill="#e07a55" />
      <Ln d="M-8,-48 V-62" sw={2} />
    </g>
  );
}

export function Mailbox() {
  return (
    <g>
      <R x={-4} y={-46} width={8} height={46} fill="#8d552e" />
      <R x={-22} y={-62} width={40} height={22} rx={6} fill="#d4534a" />
      <R x={-18} y={-58} width={16} height={14} rx={2} fill="#f6ead2" sw={1.2} />
      <g className="anim-flag">
        <R x={16} y={-78} width={4} height={22} fill="#f6ead2" sw={1} />
        <R x={16} y={-78} width={16} height={10} fill="#e1534a" />
      </g>
    </g>
  );
}

export function Stall() {
  return (
    <g>
      <R x={-50} y={-28} width={100} height={28} fill="#c4844a" />
      <R x={-46} y={-24} width={18} height={12} fill="#e2b14a" sw={1} />
      <R x={-20} y={-22} width={16} height={14} fill="#d4534a" sw={1} />
      <P d="M-64,-28 L-54,-70 L54,-70 L64,-28 Z" fill="#f4a0be" />
      <P d="M-32,-28 L-26,-70 L0,-70 L-6,-28 Z" fill="#fff" sw={1} />
      <P d="M8,-28 L14,-70 L40,-70 L34,-28 Z" fill="#fff" sw={1} />
    </g>
  );
}

export function Sign() {
  return (
    <g>
      <R x={-4} y={-70} width={8} height={70} fill="#8d552e" />
      <R x={-32} y={-104} width={64} height={36} rx={4} fill="#f6ead2" />
      <Ln d="M-20,-90 H20 M-16,-80 H12" stroke="#c9a06a" sw={1.6} />
    </g>
  );
}

export function Fence({ footW }: SpriteProps) {
  const posts = Math.max(2, Math.round(footW / 36));
  return (
    <g>
      {Array.from({ length: posts }, (_, i) => {
        const x = -footW / 2 + (i * footW) / (posts - 1);
        return <R key={i} x={x - 3} y={-28} width={6} height={28} fill="#f0e2c8" />;
      })}
      <R x={-footW / 2} y={-22} width={footW} height={4} fill="#e7c99a" />
      <R x={-footW / 2} y={-12} width={footW} height={4} fill="#e7c99a" />
    </g>
  );
}

export function Hay() {
  return (
    <g>
      <E cx={0} cy={-12} rx={26} ry={14} fill="#e2b14a" />
      <E cx={4} cy={-24} rx={18} ry={10} fill="#f0c65a" />
      <Ln d="M-16,-12 H18" stroke="#c48a2e" sw={1.4} />
    </g>
  );
}

export function Greenhouse() {
  return (
    <g>
      <R x={-48} y={-16} width={96} height={16} fill="#c4844a" />
      <P d="M-44,-16 A44,44 0 0 1 44,-16 Z" fill="#d7f4f6" />
      <Ln d="M0,-16 V-60 M-22,-16 Q-10,-50 0,-58 M22,-16 Q10,-50 0,-58" stroke="#8d552e" sw={1.5} />
      <E cx={-8} cy={-24} rx={8} ry={6} fill="#1f9a8e" sw={1} />
    </g>
  );
}

export function FencePeg() {
  return (
    <g>
      <R x={-5} y={-54} width={10} height={54} fill="#f0e2c8" />
      <C cx={0} cy={-60} r={8} fill="#e2b14a" />
    </g>
  );
}

export function FlowerSign() {
  return (
    <g>
      <Ln d="M0,0 V-48" sw={2} />
      <C cx={0} cy={-62} r={10} fill="#f4a0be" />
      <C cx={0} cy={-62} r={4} fill="#e2b14a" sw={1} />
      <C cx={-12} cy={-52} r={7} fill="#fff" />
    </g>
  );
}

export function AnimalSign() {
  return (
    <g>
      <R x={-4} y={-50} width={8} height={50} fill="#8d552e" />
      <R x={-28} y={-86} width={56} height={32} rx={6} fill="#f6ead2" />
      <E cx={-6} cy={-70} rx={8} ry={5} fill="#f7f1e4" sw={1.2} />
      <C cx={8} cy={-74} r={5} fill="#e8a05a" sw={1} />
    </g>
  );
}

export function PlotStake() {
  return (
    <g>
      <R x={-4} y={-58} width={8} height={58} fill="#8d552e" />
      <P d="M-4,-58 L18,-48 L-4,-38 Z" fill="#f6ead2" />
    </g>
  );
}

export const sprites: Record<string, (props: SpriteProps) => ReactNode> = {
  barn: Barn,
  farmhouse: Farmhouse,
  silo: Silo,
  shed: Shed,
  windmill: Windmill,
  waterTower: WaterTower,
  coop: Coop,
  pond: Pond,
  tree: Tree,
  blossom: Blossom,
  wheat: Wheat,
  crops: Crops,
  scarecrow: Scarecrow,
  chicken: Chicken,
  hen: Hen,
  cow: Cow,
  cat: Cat,
  dog: Dog,
  tractor: Tractor,
  mailbox: Mailbox,
  stall: Stall,
  sign: Sign,
  fence: Fence,
  hay: Hay,
  greenhouse: Greenhouse,
  fencePeg: FencePeg,
  flowerSign: FlowerSign,
  animalSign: AnimalSign,
  plotStake: PlotStake,
};
