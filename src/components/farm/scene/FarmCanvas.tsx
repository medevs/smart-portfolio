"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Environment,
  Html,
  PerformanceMonitor,
  SoftShadows,
} from "@react-three/drei";
import { Bloom, BrightnessContrast, DepthOfField, EffectComposer, HueSaturation, N8AO, SMAA, Vignette, wrapEffect } from "@react-three/postprocessing";
import * as THREE from "three";
import type { FarmData } from "@/farm/types";
import type { Placed } from "@/farm/loadFarm";
import { plateFor } from "@/farm/plates";
import { CELL, plotPosition } from "@/farm/world";
import { MODELS, type ModelProps } from "./models";
import { Surface, Textures } from "./materials";
import { Horizon, MillWorks, Scenery } from "./scenery";
import { AtlasLandscape } from "./MiddleAtlas";
import { CameraRig } from "./CameraRig";
import { PhysicsYard } from "./explore";
import type { TourView } from "@/farm/game/tour";
import { WEATHER, type Weather } from "@/farm/game/weather";
import { Rain } from "./Weather";
import { FarmLife } from "./FarmLife";
import { GameWorld, WorldClock } from "./GameWorld";
import { gameClock } from "@/farm/game/clock";
import type { Progress } from "@/farm/game/progress";
import type { DestinationId } from "@/farm/game/world";
import { walk } from "./walk-state";
import { GROUND_HALF } from "./yard-boundaries";
import { SceneRoot } from "./SceneRoot";
import { OptionalAsset } from "./OptionalAsset";
import { SketchEffect, sketchState } from "./SketchEffect";

const SketchPass = wrapEffect(SketchEffect);

type Quality = "low" | "high";

export type LightMode = "day" | "sunset" | "night";

export type FarmCanvasProps = {
  placed: Placed[];
  farm: FarmData;
  light: LightMode;
  phase: "intro" | "sketch" | "color";
  reducedMotion: boolean;
  quality: Quality;
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onReady: () => void;
  onFailure: () => void;
  onWalkFailure: () => void;
  onSketchDone: () => void;
  showGrid: boolean;
  plain: boolean;
  detail: boolean;
  explore: boolean;
  adaptive: boolean;
  paused: boolean;
  progress: Progress;
  waypoint: DestinationId | null;
  cycle: boolean;
  weather: Weather;
  tour: TourView | null;
  onLight: (mode: LightMode) => void;
};

export default function FarmCanvas(props: FarmCanvasProps) {
  const [degraded, setDegraded] = useState(false);
  const [effectsFailed, setEffectsFailed] = useState(false);
  const effectiveQuality = degraded && props.adaptive ? "low" : props.quality;
  return (
    <SceneRoot low={effectiveQuality === "low"} onFailure={props.onFailure} onShaderFailure={() => setEffectsFailed(true)}>
      <Suspense fallback={null}>
      <AdaptiveDpr pixelated={false} />
      <Scene {...props} quality={effectiveQuality} plain={props.plain || effectsFailed} onDecline={() => { if (props.adaptive) setDegraded(true); }} />
      <FirstFrame onReady={props.onReady} />
      </Suspense>
    </SceneRoot>
  );
}

/** Two completed frames of the core world establish readiness; decorative downloads do not gate it. */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current++ === 2) onReady();
  });
  return null;
}

function Scene(props: FarmCanvasProps & { onDecline: () => void }) {
  const { placed, farm, light, quality, activeId, reducedMotion } = props;
  const night = light === "night";
  const sunset = light === "sunset";
  const focused = activeId ? placed.find(entry => entry.plot.id === activeId || entry.item.id === activeId) : null;
  const focusPosition = focused ? plotPosition(focused.plot, farm.grid) : null;

  const overcast = WEATHER[props.weather].overcast;
  const fog = night ? "#12162a" : sunset ? "#e8b48a" : "#b9d4ee";
  const hdri = night ? "/farm/hdri/night.hdr" : sunset ? "/farm/hdri/sunset.hdr" : "/farm/hdri/day.hdr";

  return (
    <>
      <WorldClock paused={props.paused} reduced={reducedMotion} cycle={props.cycle} onLight={props.onLight} />
      <GameWorld progress={props.progress} waypoint={props.waypoint} />
      <PerformanceMonitor onDecline={props.onDecline} />
      {quality === "high" && <SoftShadows size={18} samples={12} focus={0.35} />}
      <color attach="background" args={[night ? "#07091c" : sunset ? "#e8885a" : "#8ec8ef"]} />
      <fog attach="fog" args={[fog, night ? 40 : sunset ? 55 : 70, night ? 110 : props.weather === "rain" ? 100 : 160]} />
      <Sky night={night} sunset={sunset} overcast={overcast} />
      <Lights night={night} sunset={sunset} quality={quality} overcast={overcast} />
      {sunset && props.weather !== "rain" && quality === "high" && <SunShafts />}
      <OptionalAsset><Environment files={hdri} background={false} environmentIntensity={night ? 0.32 : sunset ? 0.75 : 0.55} /></OptionalAsset>
      <Textures>
      <Horizon />
      <AtlasLandscape night={night} />
      <FarmLife rain={props.weather === "rain"} />
      {props.weather === "rain" && <Rain low={quality === "low"} />}
      <Ground />
      <Lane />
      <HayBales />
      <Rocks />
      <Wildflowers count={quality === "low" ? 40 : 110} />
      <Grass wind={WEATHER[props.weather].wind} placed={placed} grid={farm.grid} count={quality === "low" ? 400 : 1600} />
      <Clouds night={night} />
      <Birds />
      {placed.map((entry) => (
        <PlacedModel
          key={entry.plot.id}
          entry={entry}
          farm={farm}
          night={night}
          hot={props.hoveredId === entry.plot.id}
          onHover={props.onHover}
          onSelect={props.onSelect}
        />
      ))}
      {props.showGrid && <GridHelper grid={farm.grid} />}
      <MillWorks />
      <OptionalAsset><Scenery detail={props.detail && props.quality === "high"} /></OptionalAsset>
      </Textures>
      {props.explore && <OptionalAsset onFailure={props.onWalkFailure} fallback={<Html center><span className="world-place-label" role="status">Starting walking controls…</span></Html>}><PhysicsYard paused={props.paused} /></OptionalAsset>}
      <CameraRig tour={props.tour} walking={props.explore && !props.tour} paused={props.paused} reducedMotion={reducedMotion}
        focus={focusPosition ? [focusPosition[0], focusPosition[2]] : null} />
      {props.plain || (quality === "low" && props.phase === "color") ? null : (
        <OptionalAsset><Effects night={night} phase={props.phase} reduced={reducedMotion} quality={quality} onSketchDone={props.onSketchDone} focused={!!activeId} /></OptionalAsset>
      )}
    </>
  );
}

function Lights({ night, sunset, quality, overcast }: { night: boolean; sunset: boolean; quality: Quality; overcast: number }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const blend = useRef(night ? 1 : 0);
  const setBlend = useRef(sunset ? 1 : 0);
  const dayColor = useMemo(() => new THREE.Color("#fff4e4"), []);
  const setColor = useMemo(() => new THREE.Color("#ff7a3c"), []);
  const cool = useMemo(() => new THREE.Color("#9eb6ff"), []);
  const ambDay = useMemo(() => new THREE.Color("#e7eef8"), []);
  const ambNight = useMemo(() => new THREE.Color("#1c2348"), []);

  useFrame((_, dt) => {
    blend.current = THREE.MathUtils.damp(blend.current, night ? 1 : 0, 2.2, dt);
    setBlend.current = THREE.MathUtils.damp(setBlend.current, sunset ? 1 : 0, 2.2, dt);
    const k = blend.current;
    const s = setBlend.current * (1 - k);
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(3.6, 0.34, k) * (1 - s * 0.15) * (1 - overcast * .75);
      sun.current.color.copy(dayColor).lerp(setColor, s).lerp(cool, k);
      sun.current.position.set(
        THREE.MathUtils.lerp(14, 24, s) * (1 - k) + -10 * k,
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(18, 5.2, s), 16, k),
        THREE.MathUtils.lerp(6, -2, k)
      );
    }
    if (amb.current) {
      amb.current.intensity = THREE.MathUtils.lerp(0.28, 0.12, k);
      amb.current.color.copy(ambDay).lerp(ambNight, k);
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(0.42, 0.14, k);
    }
  });

  const map = quality === "low" ? 1024 : 2048;
  return (
    <>
      <ambientLight ref={amb} intensity={0.38} color="#ffe0c4" />
      <hemisphereLight ref={hemi} args={["#ffd2a8", "#3c7a42", 0.55]} />
      <directionalLight
        ref={sun}
        castShadow
        position={[18, 11, 8]}
        intensity={2.55}
        color="#ffb06a"
        shadow-mapSize={[map, map]}
        shadow-bias={-0.00025}
        shadow-camera-near={1}
        shadow-camera-far={48}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
    </>
  );
}

function Sky({ night, sunset, overcast }: { night: boolean; sunset: boolean; overcast: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const blend = useRef(night ? 1 : 0);
  const setBlend = useRef(sunset ? 1 : 0);
  useFrame((_, dt) => {
    blend.current = THREE.MathUtils.damp(blend.current, night ? 1 : 0, 2.2, dt);
    setBlend.current = THREE.MathUtils.damp(setBlend.current, sunset ? 1 : 0, 2.2, dt);
    if (mat.current) {
      mat.current.uniforms.uOvercast.value = overcast;
      mat.current.uniforms.uNight.value = blend.current;
      mat.current.uniforms.uSunset.value = setBlend.current * (1 - blend.current);
    }
  });
  return (
    <mesh scale={90}>
      <sphereGeometry args={[1, 32, 20]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{ uOvercast: { value: overcast }, uNight: { value: night ? 1 : 0 }, uSunset: { value: sunset ? 1 : 0 } }}
        vertexShader={`
          varying vec3 vDir;
          void main() {
            vDir = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vDir;
          uniform float uOvercast;
          uniform float uNight;
          uniform float uSunset;
          void main() {
            vec3 dir = normalize(vDir);
            float h = dir.y;
            vec3 dayTop = vec3(0.16, 0.45, 0.92);
            vec3 dayHor = vec3(0.62, 0.82, 0.96);
            vec3 setTop = vec3(0.28, 0.18, 0.48);
            vec3 setHor = vec3(1.0, 0.46, 0.22);
            vec3 nightTop = vec3(0.02, 0.03, 0.1);
            vec3 nightHor = vec3(0.16, 0.12, 0.28);
            vec3 top = mix(mix(dayTop, setTop, uSunset), nightTop, uNight);
            vec3 hor = mix(mix(dayHor, setHor, uSunset), nightHor, uNight);
            vec3 col = mix(hor, top, smoothstep(0.0, 0.55, h));
            vec3 sunDir = normalize(mix(vec3(0.45, 0.72, 0.2), vec3(0.85, 0.12, 0.15), uSunset));
            float sun = pow(max(dot(dir, sunDir), 0.0), mix(420.0, 80.0, uSunset));
            col += sun * mix(vec3(1.0, 0.95, 0.85), vec3(1.0, 0.55, 0.2), uSunset) * (1.0 - uNight);
            float haze = pow(1.0 - max(h, 0.0), 3.0) * uSunset;
            col += haze * vec3(1.0, 0.55, 0.25) * 0.35;
            float stars = fract(sin(dot(floor(dir.xy * 180.0), vec2(12.9, 78.2))) * 43758.5);
            float star = step(0.992, stars) * step(0.15, h) * uNight;
            col += star * (1.0 - uOvercast);
            col = mix(col, mix(vec3(0.42, 0.49, 0.54), vec3(0.045, 0.055, 0.08), uNight), uOvercast);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Ground() {
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(GROUND_HALF * 2, GROUND_HALF * 2, 70, 70);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const roll = Math.sin(x * 0.12) * 0.35 + Math.cos(z * 0.09) * 0.22;
      const dist = Math.hypot(x, z);
      const flat = THREE.MathUtils.smoothstep(dist, 38, 60);
      pos.setY(i, roll * flat - 0.02);
    }
    g.computeVertexNormals();
    g.setAttribute("uv2", g.getAttribute("uv"));
    return g;
  }, []);
  return (
    <mesh geometry={geom} receiveShadow>
      <Surface name="grass" color="#a9a477" repeat={[18, 18]} roughness={0.88} metalness={0} />
    </mesh>
  );
}

function SunShafts() {
  return (
    <group position={[16, 7, -4]} rotation={[0.55, 0.4, -0.2]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[(i - 1.5) * 1.1, -3, 0]}>
          <planeGeometry args={[0.7, 16]} />
          <meshBasicMaterial color="#ffc48a" transparent opacity={0.045} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function HayBales() {
  const spots: [number, number][] = [
    [3.4, 1.1],
    [4.3, 1.7],
    [2.6, 2.2],
  ];
  return (
    <group>
      {spots.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.28, z]} rotation={[0, i, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.34, 0.55, 10]} />
          <meshStandardMaterial color="#c6a15a" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Lane() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0.08]} position={[0.4, 0.025, 2.6]} receiveShadow>
        <planeGeometry args={[2.6, 18]} />
        <Surface name="dirt" repeat={[1.4, 8]} roughness={0.92} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0.08]} position={[0.4 + x, 0.03, 2.6]} receiveShadow>
          <planeGeometry args={[0.28, 16]} />
          <meshStandardMaterial color="#5c4632" roughness={1} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function Rocks() {
  const spots: [number, number, number, number][] = [
    [-9.2, 0.12, -4.5, 0.7],
    [-6.4, 0.08, 3.2, 0.35],
    [8.8, 0.1, 5.4, 0.55],
    [11.2, 0.14, -2.2, 0.8],
    [3.4, 0.06, -7.5, 0.4],
    [-3.2, 0.08, 7.2, 0.28],
  ];
  return (
    <group>
      {spots.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0.2, i, 0.4]} scale={s} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <Surface name="rock" repeat={[1, 1]} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Wildflowers({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const color = useMemo(() => new THREE.Color(), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 14;
      dummy.position.set(Math.cos(angle) * radius, 0.08, Math.sin(angle) * radius);
      dummy.scale.setScalar(0.35 + Math.random() * 0.5);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setHSL(Math.random() > 0.5 ? 0.95 : 0.12, 0.55, 0.62);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [color, count]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 6, 5]} />
      <meshStandardMaterial roughness={0.7} />
    </instancedMesh>
  );
}

function Grass({ placed, grid, count, wind }: { placed: Placed[]; grid: FarmData["grid"]; count: number; wind: number }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array([-0.08, 0, 0, 0.08, 0, 0, 0.02, 0.42, 0.02, -0.02, 0.42, -0.02]);
    const normals = new Float32Array([0, 0.3, 1, 0, 0.3, 1, 0, 0.4, 1, 0, 0.4, 1]);
    const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    return g;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  const material = useMemo(() => {
    const mat = new THREE.MeshLambertMaterial({ color: "#7e8c4c", side: THREE.DoubleSide });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uWind = { value: 1 };
      shader.vertexShader =
        "attribute float aPhase;\nuniform float uTime;\nuniform float uWind;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float tip = uv.y;
           transformed.x += sin(uTime * 1.5 + aPhase) * tip * 0.12 * uWind;
           transformed.z += cos(uTime * 1.2 + aPhase * 0.7) * tip * 0.08 * uWind;`
        );
      mat.userData.shader = shader;
    };
    return mat;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const phases = new Float32Array(count);
    let n = 0;
    let guard = 0;
    while (n < count && guard < count * 12) {
      guard++;
      const x = (Math.random() - 0.5) * 48;
      const z = (Math.random() - 0.5) * 48;
      if (Math.hypot(x, z) > 23) continue;
      let blocked = false;
      for (const entry of placed) {
        const [px, , pz] = plotPosition(entry.plot, grid);
        const r = 0.7 + (entry.plot.cols ?? 1) * 0.55;
        if ((x - px) ** 2 + (z - pz) ** 2 < r * r) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
      dummy.position.set(x, 0, z);
      dummy.rotation.y = Math.random() * Math.PI;
      const s = 0.55 + Math.random() * 0.7;
      dummy.scale.set(s, 0.28 + Math.random() * 0.38, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(n, dummy.matrix);
      phases[n] = Math.random() * Math.PI * 2;
      const tint = new THREE.Color().setHSL(0.20 + Math.random() * 0.06, 0.32, 0.32 + Math.random() * 0.13);
      mesh.setColorAt(n, tint);
      n++;
    }
    mesh.count = n;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
  }, [count, grid, placed]);

  useFrame(() => {
    const shader = (ref.current?.material as THREE.Material | undefined)?.userData.shader as { uniforms: { uTime: { value: number }; uWind: { value: number } } } | undefined;
    // Three owns this GPU uniform; useFrame updates it without React rerenders.
    // eslint-disable-next-line react-hooks/immutability
    if (shader) { shader.uniforms.uTime.value = gameClock.seconds; shader.uniforms.uWind.value = wind; }
  });

  return <instancedMesh ref={ref} args={[geom, material, count]} frustumCulled={false} />;
}

function Clouds({ night }: { night: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grd = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    grd.addColorStop(0, "rgba(255,255,255,0.95)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useFrame(() => {
    if (ref.current) ref.current.position.x = Math.sin(gameClock.seconds * 0.05) * 1.5;
  });
  if (!tex) return null;
  const puffs = [
    [-6, 9, -8],
    [4, 10, -10],
    [10, 8.5, -4],
  ];
  return (
    <group ref={ref}>
      {puffs.map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          {[0, 1, 2].map((k) => (
            <sprite key={k} position={[(k - 1) * 1.4, k === 1 ? 0.4 : 0, 0]} scale={[3.2, 2.2, 1]}>
              <spriteMaterial map={tex} transparent depthWrite={false} color={night ? "#9aa4c8" : i === 1 ? "#ffd0e0" : "#fff7f2"} opacity={night ? 0.35 : 0.9} />
            </sprite>
          ))}
        </group>
      ))}
    </group>
  );
}

function Birds() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = gameClock.seconds;
    if (!ref.current) return;
    ref.current.position.set(Math.sin(t * 0.25) * 8, 7.5 + Math.sin(t * 0.8) * 0.4, Math.cos(t * 0.2) * 6 - 2);
    ref.current.rotation.y = t * 0.25;
  });
  return (
    <group ref={ref}>
      {[0, 1.2, -1.1].map((x, i) => (
        <mesh key={i} position={[x, i * 0.2, i * 0.4]} rotation={[0, 0, Math.sin(i) * 0.4]}>
          <boxGeometry args={[0.45, 0.03, 0.08]} />
          <meshStandardMaterial color="#2a241c" />
        </mesh>
      ))}
    </group>
  );
}

function PlacedModel({
  entry,
  farm,
  night,
  hot,
  onHover,
  onSelect,
}: {
  entry: Placed;
  farm: FarmData;
  night: boolean;
  hot: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const Model = MODELS[entry.item.sprite];
  const group = useRef<THREE.Group>(null);
  const [x, , z] = plotPosition(entry.plot, farm.grid);
  const roam = ["cow", "sheep", "donkey", "chicken", "hen", "dog", "cat"].includes(entry.item.sprite);
  useFrame(() => {
    const node = group.current;
    if (!node) return;
    if (entry.item.sprite === "tractor") {
      node.position.set(x + walk.tx, 0, z + walk.tz);
      node.rotation.y = walk.vehicleYaw - Math.PI / 2;
      return;
    }
    if (!roam) return;
    const t = gameClock.seconds * 0.35 + (entry.plot.animDelay ?? 0);
    node.position.set(x + Math.sin(t) * 0.45, 0, z + Math.cos(t * 0.8) * 0.28);
  });
  const plate = plateFor(entry, farm);
  const golden = Boolean(plate?.golden);
  const interactive = Boolean(entry.item.interactive);
  const size: Record<string, number> = {
    chicken: 1.55,
    hen: 1.55,
    cat: 1.25,
    dog: 1.15,
    cow: 1,
    sheep: 1,
  };
  const s = size[entry.item.sprite] ?? 1;
  const labelY = entry.item.sprite === "barn" ? 6.2 : entry.item.sprite === "windmill" || entry.item.sprite === "silo" ? 5.2 : 2.4;
  const props: ModelProps = {
    night,
    golden,
    cols: entry.plot.cols,
    rows: entry.plot.rows,
  };
  return (
    <group
      ref={group}
      position={[x, 0, z]}
      scale={[entry.plot.flip ? -s : s, s, s]}
      onClick={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        onSelect(entry.plot.id);
      }}
      onPointerOver={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        onHover(entry.plot.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (!interactive) return;
        onHover(null);
        document.body.style.cursor = "";
      }}
    >
      {Model ? <Model {...props} /> : null}
      {hot && interactive && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[1.15, 1.32, 40]} />
            <meshBasicMaterial color="#ffd27a" transparent opacity={0.9} />
          </mesh>
          <Html position={[0, labelY, 0]} center distanceFactor={14} zIndexRange={[3, 0]} style={{ pointerEvents: "none" }}>
            <div className="float-label">{entry.item.label}</div>
          </Html>
        </>
      )}
      {plate?.name && (
        <Html position={[0, labelY - 0.4, 0]} center distanceFactor={12} zIndexRange={[3, 0]}>
          <a
            className="float-name"
            href={plate.href || undefined}
            target={plate.href ? "_blank" : undefined}
            rel={plate.href ? "sponsored nofollow noopener noreferrer" : undefined}
          >
            {plate.name}
          </a>
        </Html>
      )}
      {plate?.message && (
        <Html position={[0.8, 1.4, 0]} center distanceFactor={12} zIndexRange={[3, 0]} style={{ pointerEvents: "none" }}>
          <div className="float-note">{plate.message}</div>
        </Html>
      )}
    </group>
  );
}

function GridHelper({ grid }: { grid: FarmData["grid"] }) {
  const lines = useMemo(() => {
    const pts: number[] = [];
    for (let c = 0; c <= grid.cols; c++) {
      const x = (c - grid.cols / 2) * CELL;
      const z0 = (0 - grid.rows / 2) * CELL;
      const z1 = (grid.rows - grid.rows / 2) * CELL;
      pts.push(x, 0.08, z0, x, 0.08, z1);
    }
    for (let r = 0; r <= grid.rows; r++) {
      const z = (r - grid.rows / 2) * CELL;
      const x0 = (0 - grid.cols / 2) * CELL;
      const x1 = (grid.cols - grid.cols / 2) * CELL;
      pts.push(x0, 0.08, z, x1, 0.08, z);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geom;
  }, [grid]);
  return (
    <lineSegments geometry={lines}>
      <lineBasicMaterial color="#6b442c" transparent opacity={0.45} />
    </lineSegments>
  );
}

function Effects({
  night,
  phase,
  reduced,
  quality,
  onSketchDone,
  focused,
}: {
  night: boolean;
  phase: FarmCanvasProps["phase"];
  reduced: boolean;
  quality: Quality;
  onSketchDone: () => void;
  focused: boolean;
}) {
  const mix = useRef(phase === "color" || reduced ? 1 : 0);
  const held = useRef(0);
  const done = useRef(phase !== "intro");

  useFrame((_, dt) => {
    if (reduced || phase === "color") mix.current = Math.min(1, mix.current + dt * 1.6);
    else if (phase === "sketch") mix.current = 0;
    else {
      held.current += dt;
      if (held.current > 1.35) mix.current = Math.min(1, mix.current + dt * 0.48);
    }
    sketchState.mix = mix.current;
    if (!done.current && mix.current >= 0.98 && phase === "intro") {
      done.current = true;
      onSketchDone();
    }
  });

  const passes = [
    <HueSaturation key="sat" saturation={quality === "high" ? 0.16 : 0.06} />,
    <BrightnessContrast key="grade" brightness={0.01} contrast={quality === "high" ? 0.08 : 0.03} />,
    <Bloom
      key="bloom"
      intensity={night ? 0.7 : 0.08}
      luminanceThreshold={night ? 0.45 : 0.96}
      luminanceSmoothing={0.3}
      mipmapBlur
    />,
    <Vignette key="vignette" eskil={false} offset={0.16} darkness={night ? 0.65 : 0.35} />,
  ];
  if (phase !== "color" && !reduced) passes.unshift(<SketchPass key="sketch" />);
  if (quality === "high") {
    passes.splice(4, 0, <N8AO key="ao" halfRes aoRadius={0.5} intensity={0.85} distanceFalloff={1} />);
    if (focused) {
      passes.push(<DepthOfField key="dof" focusDistance={0.02} focalLength={0.04} bokehScale={1.2} />);
    }
    passes.push(<SMAA key="smaa" />);
  }

  return (
    <EffectComposer multisampling={0} enableNormalPass={quality === "high"}>
      {passes}
    </EffectComposer>
  );
}

