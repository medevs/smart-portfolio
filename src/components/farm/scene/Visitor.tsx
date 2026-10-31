"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MakerHead } from "./MakerAvatar";
import { walk } from "./walk-state";
import { gameClock } from "@/farm/game/clock";

/** Walking maker avatar, using the owner-authorized portfolio portrait. */
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
    <mesh position={[0, .95, 0]} castShadow><capsuleGeometry args={[.18, .32, 4, 9]} /><meshStandardMaterial color="#998886" roughness={.94} /></mesh>
    <MakerHead />
    {limb(leftArm, -.24, 1.13, .45, "#998886")}{limb(rightArm, .24, 1.13, .45, "#998886")}
    {limb(leftLeg, -.1, .7, .62, "#414847")}{limb(rightLeg, .1, .7, .62, "#414847")}
    {[-.1,.1].map(x => <mesh key={x} position={[x,.055,.04]} castShadow><boxGeometry args={[.15,.1,.25]}/><meshStandardMaterial color="#514738" roughness={1}/></mesh>)}
    {[-1,1].map(side => <mesh key={side} position={[side*.065,1.18,.155]} rotation={[0,0,side*.42]}><boxGeometry args={[.105,.13,.025]}/><meshStandardMaterial color="#b2a09b" roughness={1}/></mesh>)}
    <mesh position={[0, .99, -.21]} castShadow><boxGeometry args={[.26, .33, .11]} /><meshStandardMaterial color="#977b55" roughness={1} /></mesh>
  </group>;
}
