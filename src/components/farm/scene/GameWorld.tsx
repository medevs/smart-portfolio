"use client";
import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { advanceWorld, cycleLighting, gameClock } from "@/farm/game/clock";
import { nextActivity, type Progress } from "@/farm/game/progress";
import { destination, type DestinationId } from "@/farm/game/world";
import { guideMarker } from "./guide-state";
import { HarvestScene, TeaSteam, SharedTableSetting } from "./HarvestScene";
import { WalkingTrail } from "./WalkingTrail";
import { TrailerModel } from "./TrailerModel";
import { Crops, WateringCan, AppleBasket } from "./FarmObjects";
import type { LightMode } from "./scene-types";

export function WorldClock({
  paused,
  reduced,
  cycle,
  onLight,
}: {
  paused: boolean;
  reduced: boolean;
  cycle: boolean;
  onLight: (mode: LightMode) => void;
}) {
  const last = useRef<LightMode | null>(null);
  useLayoutEffect(() => {
    gameClock.paused = paused;
    gameClock.reduced = reduced;
    return () => {
      gameClock.paused = true;
    };
  }, [paused, reduced]);
  useFrame((_, dt) => {
    const seconds = advanceWorld(dt, document.hidden);
    if (cycle && !paused) {
      const phase = cycleLighting(seconds);
      if (last.current !== phase) {
        last.current = phase;
        onLight(phase);
      }
    } else last.current = null;
  }, -100);
  return null;
}
export function GameWorld({
  progress,
  waypoint,
}: {
  progress: Progress;
  waypoint: DestinationId | null;
}) {
  const marker = useRef<THREE.Group>(null);
  const next = nextActivity(progress);
  const target = destination(waypoint ?? next?.id ?? "gate");
  useFrame(() => {
    if (marker.current) {
      const point = guideMarker.point ?? target;
      if (point)
        marker.current.position.set(
          point.x,
          0.12 + Math.sin(gameClock.seconds * 2) * 0.04,
          point.z,
        );
    }
  });
  const watered = progress.completed.includes("garden"),
    delivered = progress.completed.includes("table");
  return (
    <group name="farm-game-feedback">
      <WalkingTrail />
      <HarvestScene progress={progress} />
      <TrailerModel progress={progress} />
      {delivered && (
        <>
          <TeaSteam />
          <SharedTableSetting />
        </>
      )}
      {target && (
        <group ref={marker} position={[target.x, 0.12, target.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.65, 0.76, 32]} />
            <meshBasicMaterial color="#f6d286" transparent opacity={0.85} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <octahedronGeometry args={[0.14]} />
            <meshStandardMaterial color="#d9b46a" emissive="#9c722b" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}
      {watered && (
        <group name="watered-garden" position={[13, 0.02, 22]}>
          <Crops night={false} cols={1} rows={1} watered />
        </group>
      )}
      {progress.completed.includes("well") && (
        <group name="watering-can" position={[-11.2, 0.2, 4.2]}>
          <WateringCan />
        </group>
      )}
      {delivered && (
        <group name="shared-apples" position={[-3, 0.98, 19]}>
          <AppleBasket count={3} />
        </group>
      )}
    </group>
  );
}
