"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { walk } from "./walk-state";
import { gameClock } from "@/farm/game/clock";

/** A generic visitor silhouette, not a likeness of the site owner. */
export function Visitor() {
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null), rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null), rightLeg = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (root.current) {
      root.current.visible = !walk.driving;
      root.current.rotation.y = walk.yaw;
    }
    const stride = gameClock.paused || gameClock.reduced ? 0 : Math.sin(gameClock.seconds * (walk.sprinting ? 12 : 8)) * Math.min(walk.moving / 3.6, 1.4) * .55;
    const blend = 1 - Math.exp(-12 * Math.min(dt, .05));
    for (const [part, target] of [[leftLeg, stride], [rightLeg, -stride], [leftArm, -stride * .7], [rightArm, stride * .7]] as const) {
      if (part.current) part.current.rotation.x = THREE.MathUtils.lerp(part.current.rotation.x, target, blend);
    }
  });
  const limb = (ref: React.RefObject<THREE.Group | null>, x: number, y: number, length: number, color: string) => <group ref={ref} position={[x, y, 0]}>
    <mesh position={[0, -length / 2, 0]} castShadow><capsuleGeometry args={[.065, length - .13, 3, 7]} /><meshStandardMaterial color={color} roughness={.95} /></mesh>
  </group>;
  return <group ref={root} position={[0, -.66, 0]}>
    <mesh position={[0, .95, 0]} castShadow><capsuleGeometry args={[.18, .32, 4, 9]} /><meshStandardMaterial color="#667a58" roughness={.94} /></mesh>
    <mesh position={[0, 1.42, 0]} castShadow><sphereGeometry args={[.14, 10, 8]} /><meshStandardMaterial color="#bca487" roughness={1} /></mesh>
    <mesh position={[0, 1.54, 0]} castShadow><cylinderGeometry args={[.22, .22, .035, 12]} /><meshStandardMaterial color="#b09a6a" roughness={1} /></mesh>
    <mesh position={[0, 1.57, 0]} castShadow><cylinderGeometry args={[.12, .15, .12, 12]} /><meshStandardMaterial color="#b09a6a" roughness={1} /></mesh>
    {limb(leftArm, -.24, 1.13, .45, "#8b9872")}{limb(rightArm, .24, 1.13, .45, "#8b9872")}
    {limb(leftLeg, -.1, .7, .62, "#535a54")}{limb(rightLeg, .1, .7, .62, "#535a54")}
    <mesh position={[0, .99, -.21]} castShadow><boxGeometry args={[.26, .33, .11]} /><meshStandardMaterial color="#977b55" roughness={1} /></mesh>
  </group>;
}
