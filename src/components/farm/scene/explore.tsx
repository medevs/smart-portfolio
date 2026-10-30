"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { walk } from "./walk-state";

const BLOCKS = [
  { x: 1.1, z: -2.2, r: 3.1 },
  { x: -11, z: -2.2, r: 2.7 },
  { x: 8.6, z: -3.3, r: 1.4 },
  { x: 6.6, z: -2.2, r: 1.8 },
  { x: 19, z: -6, r: 1.6 },
];

function blocked(x: number, z: number) {
  if (x < -24 || x > 24 || z < -14 || z > 26) return true;
  return BLOCKS.some((box) => (x - box.x) ** 2 + (z - box.z) ** 2 < box.r * box.r);
}

export function Walker({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const { camera } = useThree();
  const look = useMemoVector();

  useEffect(() => {
    if (!active) {
      walk.driving = false;
      return;
    }
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "a" || key === "s" || key === "d") keys.current[key] = true;
      if (key === "f") walk.driving = !walk.driving;
    };
    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "a" || key === "s" || key === "d") keys.current[key] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [active]);

  useFrame((_, dt) => {
    const rig = ref.current;
    if (!active || !rig) return;
    const forward = (keys.current.w || walk.stickY < -0.25 ? 1 : 0) - (keys.current.s || walk.stickY > 0.25 ? 1 : 0);
    const strafe = (keys.current.d || walk.stickX > 0.25 ? 1 : 0) - (keys.current.a || walk.stickX < -0.25 ? 1 : 0);
    const yaw = Math.atan2(camera.position.x - rig.position.x, camera.position.z - rig.position.z);
    const speed = (walk.driving ? 6.5 : 3.4) * dt;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    const dx = (sin * forward + cos * strafe) * speed;
    const dz = (cos * forward - sin * strafe) * speed;
    const nextX = rig.position.x + dx;
    const nextZ = rig.position.z + dz;
    if (!blocked(nextX, nextZ)) {
      rig.position.x = nextX;
      rig.position.z = nextZ;
      if (Math.hypot(dx, dz) > 0.0001) rig.rotation.y = Math.atan2(dx, dz);
    }
    if (walk.driving) {
      walk.tx += dx;
      walk.tz += dz;
      walk.yaw = rig.rotation.y;
    }
    if (body.current) body.current.visible = !walk.driving;
    look.set(rig.position.x - sin * 6.5, 3.4, rig.position.z - cos * 6.5);
    camera.position.lerp(look, 1 - Math.pow(0.001, dt));
    camera.lookAt(rig.position.x, 1.2, rig.position.z);
  });

  if (!active) return null;
  return (
    <group ref={ref} position={[0, 0, 7]}>
      <mesh ref={body} position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.75, 4, 8]} />
        <meshStandardMaterial color="#3c4a5c" roughness={0.7} />
      </mesh>
    </group>
  );
}

function useMemoVector() {
  const ref = useRef<THREE.Vector3>(null);
  if (!ref.current) ref.current = new THREE.Vector3();
  return ref.current;
}
