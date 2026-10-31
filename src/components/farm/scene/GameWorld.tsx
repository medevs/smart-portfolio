"use client";
import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { advanceWorld, cycleLighting, gameClock } from "@/farm/game/clock";
import { nextActivity, type Progress } from "@/farm/game/progress";
import { destination, type DestinationId } from "@/farm/game/world";
import type { LightMode } from "./FarmCanvas";

export function WorldClock({ paused, reduced, cycle, onLight }: { paused: boolean; reduced: boolean; cycle: boolean; onLight: (mode: LightMode) => void }) {
  const last = useRef<LightMode | null>(null);
  useLayoutEffect(() => { gameClock.paused = paused; gameClock.reduced = reduced; return () => { gameClock.paused = true; }; }, [paused, reduced]);
  useFrame((_, dt) => {
    const seconds = advanceWorld(dt, document.hidden);
    if (cycle && !paused) {
      const phase = cycleLighting(seconds);
      if (last.current !== phase) { last.current = phase; onLight(phase); }
    } else last.current = null;
  }, -100);
  return null;
}
export function GameWorld({ progress, waypoint }: { progress: Progress; waypoint: DestinationId | null }) {
  const marker = useRef<THREE.Group>(null);
  const next = nextActivity(progress);
  const target = destination(waypoint ?? next?.id ?? "gate");
  useFrame(() => { if (marker.current) marker.current.position.y = .12 + Math.sin(gameClock.seconds * 2) * .04; });
  const watered = progress.completed.includes("garden"), delivered = progress.completed.includes("table");
  return <group name="farm-game-feedback">
    {target && <group ref={marker} position={[target.x, .12, target.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.65, .76, 32]} /><meshBasicMaterial color="#f6d286" transparent opacity={.85} depthWrite={false} /></mesh>
      <mesh position={[0, .35, 0]}><octahedronGeometry args={[.14]} /><meshStandardMaterial color="#d9b46a" emissive="#9c722b" emissiveIntensity={.5} /></mesh>
    </group>}
    {watered && <group name="watered-garden" position={[13, .035, 22]}><mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.9, 24]} /><meshStandardMaterial color="#665b3c" roughness={1} /></mesh>{[-.8,0,.8].map(x => <mesh key={x} position={[x,.2,0]}><sphereGeometry args={[.2,8,6]} /><meshStandardMaterial color="#5a7b3a" roughness={1}/></mesh>)}</group>}
    {progress.completed.includes("well") && <group name="watering-can" position={[-11.2, .3, 4.2]}><mesh><cylinderGeometry args={[.16,.16,.35,12]}/><meshStandardMaterial color="#688b8e" roughness={.8}/></mesh><mesh position={[.2,.06,0]} rotation={[0,0,-.8]}><cylinderGeometry args={[.045,.06,.3,8]}/><meshStandardMaterial color="#688b8e"/></mesh></group>}
    {delivered && <group name="shared-apples" position={[-3, 1.06, 19]}><mesh><cylinderGeometry args={[.35,.25,.1,16]}/><meshStandardMaterial color="#b88d56" roughness={1}/></mesh>{[-.16,0,.16].map((x,i) => <mesh key={x} position={[x,.14,i===1?.1:0]}><sphereGeometry args={[.1,10,8]}/><meshStandardMaterial color="#aa5034" roughness={.8}/></mesh>)}</group>}
  </group>;
}
