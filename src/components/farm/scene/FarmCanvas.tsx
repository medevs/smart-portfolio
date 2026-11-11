"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Html, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import * as THREE from "three";
import type { FarmData } from "@/farm/types";
import type { Placed } from "@/farm/loadFarm";
import { plateFor } from "@/farm/plates";
import { CELL, plotPosition } from "@/farm/world";
import { safeSpawn } from "@/farm/game/collision";
import { animalPose, companionPose } from "./object-motion";
import { JourneyProgress } from "./journey-state";
import { MODELS, type ModelProps } from "./models";
import { Textures } from "./materials";
import { Horizon, MillWorks, Scenery } from "./scenery";
import { AtlasLandscape, NaturalDetail } from "./MiddleAtlas";
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
import { SceneRoot } from "./SceneRoot";
import { OptionalAsset } from "./OptionalAsset";

import type { Quality, LightMode } from "./scene-types";
import { Lights, Sky, SunShafts } from "./SceneLighting";
import { Effects } from "./SceneEffects";
import { Ground, HayBales, Lane, Rocks, Wildflowers, Grass, Clouds, Birds } from "./Terrain";

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
    <SceneRoot
      low={effectiveQuality === "low"}
      conserve={props.adaptive && degraded}
      onFailure={props.onFailure}
      onShaderFailure={() => setEffectsFailed(true)}
    >
      <Suspense fallback={null}>
        <Scene
          {...props}
          quality={effectiveQuality}
          plain={props.plain || effectsFailed}
          onDecline={() => {
            if (props.adaptive) setDegraded(true);
          }}
        />
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
  const focused = activeId
    ? placed.find((entry) => entry.plot.id === activeId || entry.item.id === activeId)
    : null;
  const focusPosition = focused ? plotPosition(focused.plot, farm.grid) : null;

  const overcast = WEATHER[props.weather].overcast;
  const fog = night ? "#12162a" : sunset ? "#e8b48a" : "#b9d4ee";
  const hdri = night
    ? "/farm/hdri/night.hdr"
    : sunset
      ? "/farm/hdri/sunset.hdr"
      : "/farm/hdri/day.hdr";

  return (
    <JourneyProgress.Provider value={props.progress}>
      <WorldClock
        paused={props.paused}
        reduced={reducedMotion}
        cycle={props.cycle}
        onLight={props.onLight}
      />
      <GameWorld progress={props.progress} waypoint={props.waypoint} />
      <PerformanceMonitor onDecline={props.onDecline} />
      {quality === "high" && <SoftShadows size={18} samples={12} focus={0.35} />}
      <color attach="background" args={[night ? "#07091c" : sunset ? "#e8885a" : "#8ec8ef"]} />
      <fog
        attach="fog"
        args={[
          fog,
          night ? 40 : sunset ? 55 : 70,
          night ? 110 : props.weather === "rain" ? 100 : 160,
        ]}
      />
      <Sky night={night} sunset={sunset} overcast={overcast} />
      <Lights night={night} sunset={sunset} quality={quality} overcast={overcast} />
      {sunset && props.weather !== "rain" && quality === "high" && <SunShafts />}
      <OptionalAsset>
        <Environment
          files={hdri}
          background={false}
          environmentIntensity={night ? 0.32 : sunset ? 0.75 : 0.55}
        />
      </OptionalAsset>
      <Textures>
        <NaturalDetail.Provider value={quality === "low"}>
          <Horizon />
          <AtlasLandscape night={night} />
          <FarmLife rain={props.weather === "rain"} />
          {props.weather === "rain" && <Rain low={quality === "low"} />}
          <Ground />
          <Lane />
          <HayBales />
          <Rocks />
          <Wildflowers count={quality === "low" ? 40 : 110} />
          <Grass
            wind={WEATHER[props.weather].wind}
            placed={placed}
            grid={farm.grid}
            count={quality === "low" ? 400 : 1600}
          />
          <Clouds night={night} />
          <Birds />
          {placed.map((entry) => (
            <PlacedModel
              key={entry.plot.id}
              entry={entry}
              farm={farm}
              night={night}
              watered={props.progress.completed.includes("garden")}
              raining={props.weather === "rain"}
              wind={WEATHER[props.weather].wind}
              hot={props.hoveredId === entry.plot.id}
              onHover={props.onHover}
              onSelect={props.onSelect}
            />
          ))}
          {props.showGrid && <GridHelper grid={farm.grid} />}
          <MillWorks waterCollected={props.progress.completed.includes("well")} />
          <OptionalAsset>
            <Scenery detail={props.detail && props.quality === "high"} />
          </OptionalAsset>
        </NaturalDetail.Provider>
      </Textures>
      {props.explore && (
        <OptionalAsset
          onFailure={props.onWalkFailure}
          fallback={
            <Html center>
              <span className="world-place-label" role="status">
                Starting walking controls…
              </span>
            </Html>
          }
        >
          <PhysicsYard paused={props.paused} />
        </OptionalAsset>
      )}
      <CameraRig
        tour={props.tour}
        walking={props.explore && !props.tour}
        paused={props.paused}
        reducedMotion={reducedMotion}
        focus={focusPosition ? [focusPosition[0], focusPosition[2]] : null}
      />
      {props.plain || (quality === "low" && props.phase === "color") ? null : (
        <OptionalAsset>
          <Effects
            night={night}
            phase={props.phase}
            reduced={reducedMotion}
            quality={quality}
            onSketchDone={props.onSketchDone}
            focused={!!activeId}
          />
        </OptionalAsset>
      )}
    </JourneyProgress.Provider>
  );
}

function PlacedModel({
  entry,
  farm,
  night,
  hot,
  watered,
  raining,
  wind,
  onHover,
  onSelect,
}: {
  entry: Placed;
  farm: FarmData;
  night: boolean;
  hot: boolean;
  watered: boolean;
  raining: boolean;
  wind: number;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const Model = MODELS[entry.item.sprite];
  const group = useRef<THREE.Group>(null);
  const [x, , z] = plotPosition(entry.plot, farm.grid);
  const motion = useRef(animalPose(gameClock.seconds));
  const dogTime = useRef(gameClock.seconds);
  const roam = ["cow", "sheep", "donkey", "chicken", "hen", "dog", "cat"].includes(
    entry.item.sprite,
  );
  useFrame(() => {
    const node = group.current;
    if (!node) return;
    if (entry.item.sprite === "tractor") {
      node.position.set(x + walk.tx, 0, z + walk.tz);
      node.rotation.y = walk.vehicleYaw - Math.PI / 2;
      return;
    }
    if (!roam) return;
    let pose = animalPose(gameClock.seconds, entry.plot.animDelay ?? 0, raining);
    if (entry.item.sprite === "dog") {
      const dt = Math.max(0, Math.min(0.05, gameClock.seconds - dogTime.current));
      dogTime.current = gameClock.seconds;
      const candidate = companionPose(
        motion.current,
        gameClock.seconds,
        dt,
        { x: walk.driving ? 100 : walk.px - x, z: walk.pz - z },
        raining,
      );
      pose = safeSpawn({ x: x + candidate.x, z: z + candidate.z })
        ? candidate
        : { ...candidate, x: motion.current.x, z: motion.current.z, gait: 0 };
    }
    motion.current = pose;
    node.position.set(x + pose.x, 0, z + pose.z);
    node.rotation.y = pose.heading + (entry.plot.flip ? Math.PI : 0);
  }, -0.5);
  const plate = plateFor(entry, farm);
  const golden = Boolean(plate?.golden);
  const interactive = Boolean(entry.item.interactive);
  const s = 1;
  const labelY =
    entry.item.sprite === "barn"
      ? 6.2
      : entry.item.sprite === "windmill" || entry.item.sprite === "silo"
        ? 5.2
        : 2.4;
  const props: ModelProps = {
    night,
    golden,
    motion,
    phase: entry.plot.animDelay ?? 0,
    watered,
    raining,
    wind,
    cols: entry.plot.cols,
    rows: entry.plot.rows,
    opening: entry.plot.id === "fence-1" ? 1.8 : 0,
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
          <Html
            position={[0, labelY, 0]}
            center
            distanceFactor={14}
            zIndexRange={[3, 0]}
            style={{ pointerEvents: "none" }}
          >
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
        <Html
          position={[0.8, 1.4, 0]}
          center
          distanceFactor={12}
          zIndexRange={[3, 0]}
          style={{ pointerEvents: "none" }}
        >
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
