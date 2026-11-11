"use client";
import { useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { JourneyProgress } from "./journey-state";
import { AppleBasket, WateringCan } from "./FarmObjects";
import { MakerHead } from "./MakerAvatar";
import { walk, WALK_SPEED } from "./walk-state";
import { gameClock } from "@/farm/game/clock";

/** Walking maker avatar, using the owner-authorized portfolio portrait. */
export function Visitor() {
  const progress = useContext(JourneyProgress);
  const carrying = progress.apples > 0 && progress.basket !== "trailer";
  const carryingWater = progress.water > 0 && !progress.completed.includes("garden");
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null),
    rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null),
    rightLeg = useRef<THREE.Group>(null);
  const leftKnee = useRef<THREE.Group>(null),
    rightKnee = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3());
  useFrame(({ camera }, dt) => {
    if (root.current) {
      root.current.visible =
        !walk.driving &&
        camera.position.distanceToSquared(cameraTarget.current.set(walk.px, 1.1, walk.pz)) > 0.56;
      root.current.rotation.y = walk.yaw;
    }
    const stride =
      gameClock.paused || gameClock.reduced
        ? 0
        : Math.sin(gameClock.seconds * (walk.sprinting ? 14 : 10)) *
          Math.min(walk.moving / WALK_SPEED, 1.4) *
          0.55;
    const blend = 1 - Math.exp(-12 * Math.min(dt, 0.05));
    for (const [part, target] of [
      [leftLeg, stride],
      [rightLeg, -stride],
      [leftArm, carrying ? -1.05 : carryingWater ? -0.2 : -stride * 0.7],
      [rightArm, carrying ? -1.05 : stride * 0.7],
    ] as const) {
      if (part.current)
        part.current.rotation.x = THREE.MathUtils.lerp(part.current.rotation.x, target, blend);
    }
    if (leftKnee.current) leftKnee.current.rotation.x = Math.max(0, -stride) * 0.8;
    if (rightKnee.current) rightKnee.current.rotation.x = Math.max(0, stride) * 0.8;
  });
  const limb = (
    ref: React.RefObject<THREE.Group | null>,
    x: number,
    y: number,
    length: number,
    color: string,
    knee?: React.RefObject<THREE.Group | null>,
    heldCan = false,
  ) => (
    <group ref={ref} position={[x, y, 0]}>
      <mesh position={[0, -length * 0.25, 0]} castShadow>
        <capsuleGeometry args={[0.058, length * 0.5 - 0.116, 4, 9]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <group ref={knee} position={[0, -length * 0.5, 0]}>
        <mesh position={[0, -length * 0.25, 0]} castShadow>
          <capsuleGeometry args={[0.052, length * 0.5 - 0.104, 4, 9]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
        {knee ? (
          <mesh position={[0, -length * 0.5 - 0.025, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.11, 0.25]} />
            <meshStandardMaterial color="#514c3d" roughness={1} />
          </mesh>
        ) : (
          <mesh position={[0, -length * 0.5 - 0.025, 0]} scale={[1, 1.2, 0.75]}>
            <sphereGeometry args={[0.055, 9, 7]} />
            <meshStandardMaterial color="#aa8970" roughness={1} />
          </mesh>
        )}
        {heldCan && (
          <group name="carried-watering-can" position={[0, -length * 0.5 - 0.22, 0.02]}>
            <WateringCan />
          </group>
        )}
      </group>
    </group>
  );
  return (
    <group name="maker-visitor" ref={root} position={[0, -0.7, 0]}>
      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.32, 4, 9]} />
        <meshStandardMaterial color="#998886" roughness={0.94} />
      </mesh>
      <MakerHead />
      {carrying && (
        <group name="carried-apple-basket" position={[0, 0.8, 0.43]} scale={0.7}>
          <AppleBasket count={progress.apples} />
        </group>
      )}
      {limb(leftArm, -0.24, 1.13, 0.45, "#998886", undefined, carryingWater)}
      {limb(rightArm, 0.24, 1.13, 0.45, "#998886")}
      {limb(leftLeg, -0.1, 0.7, 0.62, "#414847", leftKnee)}
      {limb(rightLeg, 0.1, 0.7, 0.62, "#414847", rightKnee)}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[0.32, 0.035, 0.24]} />
        <meshStandardMaterial color="#685f4a" roughness={1} />
      </mesh>
      <mesh position={[0.1, 1.06, 0.18]}>
        <boxGeometry args={[0.08, 0.09, 0.015]} />
        <meshStandardMaterial color="#a18e88" roughness={1} />
      </mesh>
      {[0.94, 1.02, 1.1].map((y) => (
        <mesh key={y} position={[0, y, 0.183]}>
          <sphereGeometry args={[0.008, 6, 4]} />
          <meshStandardMaterial color="#4e5549" roughness={1} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.065, 1.18, 0.155]} rotation={[0, 0, side * 0.42]}>
          <boxGeometry args={[0.105, 0.13, 0.025]} />
          <meshStandardMaterial color="#b2a09b" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.99, -0.21]} castShadow>
        <boxGeometry args={[0.26, 0.33, 0.11]} />
        <meshStandardMaterial color="#977b55" roughness={1} />
      </mesh>
    </group>
  );
}
