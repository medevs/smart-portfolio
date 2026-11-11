"use client";
import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gameClock } from "@/farm/game/clock";
import { walk, TRACTOR } from "./walk-state";
import { vehicleVisual, type VehicleVisual } from "./object-motion";
import { Metal, Timber, Rod, Rivets, type V3 } from "./ObjectParts";
import { MakerHead } from "./MakerAvatar";
function Wheel({
  radius,
  width,
  front = false,
}: {
  radius: number;
  width: number;
  front?: boolean;
}) {
  const tread = useRef<THREE.InstancedMesh>(null);
  const count = (front ? 18 : 26) * 2;
  useLayoutEffect(() => {
    if (!tread.current) return;
    const o = new THREE.Object3D(),
      radial = new THREE.Vector3(0, 0, 1),
      axial = new THREE.Vector3(0, 1, 0),
      slope = new THREE.Quaternion();
    for (let i = 0; i < count; i++) {
      const a = (Math.floor(i / 2) / (count / 2)) * Math.PI * 2,
        side = i % 2 ? 1 : -1;
      o.position.set(
        Math.cos(a) * (radius - 0.005),
        Math.sin(a) * (radius - 0.005),
        side * width * 0.24,
      );
      o.quaternion
        .setFromAxisAngle(radial, a - Math.PI / 2)
        .multiply(slope.setFromAxisAngle(axial, side * 0.55));
      o.updateMatrix();
      tread.current.setMatrixAt(i, o.matrix);
    }
    tread.current.instanceMatrix.needsUpdate = true;
    tread.current.computeBoundingSphere();
  }, [count, radius, width]);
  const profile = [
    new THREE.Vector2(radius * 0.46, -width * 0.5),
    new THREE.Vector2(radius * 0.82, -width * 0.54),
    new THREE.Vector2(radius * 0.96, -width * 0.32),
    new THREE.Vector2(radius * 0.96, width * 0.32),
    new THREE.Vector2(radius * 0.82, width * 0.54),
    new THREE.Vector2(radius * 0.46, width * 0.5),
  ];
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <latheGeometry args={[profile, 32]} />
        <meshStandardMaterial color="#34382f" roughness={0.96} />
      </mesh>
      <instancedMesh ref={tread} args={[undefined, undefined, count]} castShadow>
        <boxGeometry args={[0.045, 0.045, width * 0.64]} />
        <meshStandardMaterial color="#30372e" roughness={1} />
      </instancedMesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0, side * width * 0.53]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[radius * 0.52, radius * 0.52, 0.025, 20]} />
            <meshStandardMaterial color="#9a5948" metalness={0.35} roughness={0.7} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[radius * 0.19, radius * 0.19, 0.06, 12]} />
            <meshStandardMaterial color="#777b6b" metalness={0.5} roughness={0.64} />
          </mesh>
          <Rivets
            points={Array.from({ length: 6 }, (_, i) => [
              Math.cos((i * Math.PI) / 3) * radius * 0.31,
              Math.sin((i * Math.PI) / 3) * radius * 0.31,
              side * 0.025,
            ])}
          />
        </group>
      ))}
    </group>
  );
}
export function Tractor() {
  const rear = useRef<(THREE.Group | null)[]>([]),
    front = useRef<(THREE.Group | null)[]>([]),
    steering = useRef<(THREE.Group | null)[]>([]),
    driver = useRef<THREE.Group>(null);
  const previous = useRef<VehicleVisual>({
    x: TRACTOR.x + walk.tx,
    z: TRACTOR.z + walk.tz,
    yaw: walk.vehicleYaw,
    rear: 0,
    front: 0,
    steer: 0,
  });
  useFrame(() => {
    previous.current = vehicleVisual(
      previous.current,
      { x: TRACTOR.x + walk.tx, z: TRACTOR.z + walk.tz, yaw: walk.vehicleYaw },
      gameClock.paused,
    );
    for (const wheel of rear.current) if (wheel) wheel.rotation.z = previous.current.rear;
    for (const wheel of front.current) if (wheel) wheel.rotation.z = previous.current.front;
    for (const axle of steering.current) if (axle) axle.rotation.y = previous.current.steer;
    if (driver.current) driver.current.visible = walk.driving;
  });
  return (
    <group name="working-tractor">
      <Metal position={[0.02, 0.5, 0]} size={[1.48, 0.14, 0.48]} color="#59634f" />
      <Metal position={[0.33, 0.76, 0]} size={[0.82, 0.38, 0.48]} color="#9b5e48" />
      <Metal position={[0.76, 0.72, 0]} size={[0.035, 0.3, 0.43]} color="#424b40" />
      {Array.from({ length: 9 }, (_, i) => (
        <Metal
          key={i}
          position={[0.785, 0.59 + i * 0.028, 0]}
          size={[0.015, 0.01, 0.38]}
          color="#89907b"
        />
      ))}
      {[-1, 1].map((side, i) => (
        <group key={side}>
          <group
            name={`tractor-rear-wheel-${i}`}
            ref={(node) => {
              rear.current[i] = node;
            }}
            position={[-0.46, 0.4, side * 0.39]}
          >
            <Wheel radius={0.4} width={0.2} />
          </group>
          <group
            name={`tractor-steering-${i}`}
            ref={(node) => {
              steering.current[i] = node;
            }}
            position={[0.58, 0.245, side * 0.34]}
          >
            <group
              name={`tractor-front-wheel-${i}`}
              ref={(node) => {
                front.current[i] = node;
              }}
            >
              <Wheel radius={0.245} width={0.135} front />
            </group>
          </group>
          <Metal position={[-0.46, 0.77, side * 0.36]} size={[0.55, 0.035, 0.28]} color="#965b47" />
          <Metal position={[-0.25, 0.5, side * 0.38]} size={[0.36, 0.045, 0.2]} color="#6e725f" />
          <mesh position={[0.79, 0.86, side * 0.16]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.045, 12]} />
            <meshStandardMaterial
              color="#d1c6a0"
              emissive="#b6a16e"
              emissiveIntensity={0.12}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}
      <Rod a={[-0.46, 0.4, -0.4]} b={[-0.46, 0.4, 0.4]} r={0.045} metal />
      <Rod a={[0.58, 0.245, -0.33]} b={[0.58, 0.245, 0.33]} r={0.025} metal />
      <Metal position={[-0.33, 0.81, 0]} size={[0.3, 0.08, 0.34]} color="#454e40" />
      <Metal position={[-0.48, 0.97, 0]} size={[0.065, 0.32, 0.33]} color="#454e40" />
      <Rod a={[-0.11, 0.65, 0]} b={[0.02, 1.04, 0]} r={0.02} metal />
      <mesh position={[0.02, 1.04, 0]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[0.12, 0.012, 6, 20]} />
        <meshStandardMaterial color="#353f34" roughness={0.9} />
      </mesh>
      <Rod a={[0.45, 0.9, -0.13]} b={[0.45, 1.42, -0.13]} r={0.027} color="#555c4e" metal />
      <Metal position={[0.47, 1.43, -0.13]} size={[0.1, 0.025, 0.08]} color="#565e50" />
      {[-1, 1].map((side) => (
        <Rod
          key={side}
          a={[-0.59, 0.7, side * 0.27]}
          b={[-0.59, 1.57, side * 0.27]}
          r={0.03}
          metal
        />
      ))}
      <Metal position={[-0.2, 1.59, 0]} size={[0.9, 0.045, 0.85]} color="#a39c7c" />
      <Rivets
        points={[-0.15, 0.1, 0.35, 0.6].flatMap((x) =>
          [-1, 1].map((s) => [x, 0.94, s * 0.245] as V3),
        )}
      />
      <Rod a={[-0.77, 0.22, 0]} b={[-1, 0.22, 0]} r={0.035} metal />
      <Timber position={[-0.77, 0.35, 0]} size={[0.12, 0.09, 0.2]} color="#827963" />
      <group
        ref={driver}
        name="tractor-driver"
        position={[-0.38, 0.18, 0]}
        scale={0.8}
        rotation={[0, Math.PI / 2, 0]}
        visible={false}
      >
        {[-1, 1].map((side) => (
          <group key={side}>
            <Rod a={[side * 0.1, 0.78, 0]} b={[side * 0.1, 0.77, 0.28]} r={0.065} color="#414847" />
            <Rod
              a={[side * 0.1, 0.77, 0.28]}
              b={[side * 0.1, 0.46, 0.32]}
              r={0.052}
              color="#414847"
            />
            <Metal position={[side * 0.1, 0.43, 0.37]} size={[0.14, 0.1, 0.24]} color="#514c3d" />
            <Rod a={[side * 0.2, 1.16, 0]} b={[side * 0.2, 0.98, 0.18]} r={0.052} color="#998886" />
            <Rod
              a={[side * 0.2, 0.98, 0.18]}
              b={[side * 0.12, 1.05, 0.42]}
              r={0.045}
              color="#998886"
            />
            <mesh position={[side * 0.12, 1.05, 0.42]}>
              <sphereGeometry args={[0.05, 9, 7]} />
              <meshStandardMaterial color="#aa8970" roughness={1} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.02, 0]}>
          <capsuleGeometry args={[0.16, 0.3, 4, 10]} />
          <meshStandardMaterial color="#998886" roughness={1} />
        </mesh>
        <MakerHead />
      </group>
    </group>
  );
}
