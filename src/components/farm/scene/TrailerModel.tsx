"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Progress } from "@/farm/game/progress";
import { gameClock } from "@/farm/game/clock";
import { walk } from "./walk-state";
import { AppleBasket } from "./FarmObjects";
import { Metal, Timber, Rod, Rivets } from "./ObjectParts";

/** Visuals sample the jointed Rapier trailer; they never move the physics bodies. */
export function TrailerModel({ progress }: { progress: Progress }) {
  const root = useRef<THREE.Group>(null),
    wheels = useRef<(THREE.Group | null)[]>([]);
  const previous = useRef<{ x: number; z: number; angle: number } | null>(null);
  useFrame(() => {
    if (!root.current) return;
    root.current.position.set(walk.trailerX, walk.trailerY, walk.trailerZ);
    root.current.rotation.y = walk.trailerYaw;
    const old = previous.current;
    const distance = old
      ? (walk.trailerX - old.x) * Math.sin(walk.trailerYaw) +
        (walk.trailerZ - old.z) * Math.cos(walk.trailerYaw)
      : 0;
    const angle =
      old && !gameClock.paused && Math.abs(distance) < 2
        ? old.angle + distance / 0.22
        : (old?.angle ?? 0);
    for (const wheel of wheels.current) if (wheel) wheel.rotation.x = angle;
    previous.current = { x: walk.trailerX, z: walk.trailerZ, angle };
  });
  return (
    <group
      name="harvest-trailer"
      ref={root}
      position={[walk.trailerX, walk.trailerY, walk.trailerZ]}
      rotation={[0, walk.trailerYaw, 0]}
    >
      <Metal position={[0, 0.18, 0]} size={[1.12, 0.1, 1.55]} color="#626d5b" />
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x) => (
        <Timber key={x} position={[x, 0.26, 0]} size={[0.18, 0.07, 1.48]} />
      ))}
      {[-1, 1].map((side, i) => (
        <group key={side}>
          {[0.4, 0.59].map((y) => (
            <Timber
              key={y}
              position={[side * 0.56, y, 0]}
              size={[0.055, 0.14, 1.6]}
              color="#8f8567"
            />
          ))}
          {[-0.7, 0.7].map((z) => (
            <Metal key={z} position={[side * 0.56, 0.43, z]} size={[0.04, 0.5, 0.055]} />
          ))}
          <group
            name={`trailer-wheel-${i}`}
            ref={(node) => {
              wheels.current[i] = node;
            }}
            position={[side * 0.62, 0, -0.2]}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.15, 20]} />
              <meshStandardMaterial color="#353c32" roughness={1} />
            </mesh>
            <mesh position={[side * 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.015, 16]} />
              <meshStandardMaterial color="#8c8c72" roughness={0.65} metalness={0.4} />
            </mesh>
            <Rivets
              points={Array.from({ length: 6 }, (_, j) => [
                side * 0.095,
                Math.cos((j * Math.PI) / 3) * 0.08,
                Math.sin((j * Math.PI) / 3) * 0.08,
              ])}
              r={0.012}
            />
          </group>
          <Rod a={[side * 0.48, 0.18, 0.7]} b={[0, 0, 1.25]} r={0.03} metal />
        </group>
      ))}
      {[-1, 1].map((side) =>
        [0.4, 0.59].map((y) => (
          <Timber
            key={`${side}:${y}`}
            position={[0, y, side * 0.78]}
            size={[1.08, 0.14, 0.055]}
            color="#8f8567"
          />
        )),
      )}
      <Rod a={[-0.65, 0, -0.2]} b={[0.65, 0, -0.2]} r={0.035} metal />
      <mesh position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.018, 6, 16]} />
        <meshStandardMaterial color="#697061" metalness={0.6} roughness={0.65} />
      </mesh>
      {progress.basket === "trailer" && progress.apples > 0 && (
        <group name="trailer-apple-basket" position={[0, 0.3, -0.1]}>
          <AppleBasket count={progress.apples} />
        </group>
      )}
    </group>
  );
}
