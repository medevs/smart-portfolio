"use client";

import { useLayoutEffect, useMemo, useRef, type ReactElement } from "react";
import { gameClock, animationDelta } from "@/farm/game/clock";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CourtyardHouse, EarthGranary, StoneWorkshop, AtlasCedar, Donkey } from "./MiddleAtlas";
import { CELL } from "@/farm/world";
import { Surface, type SurfaceName } from "./materials";

export type ModelProps = {
  night: boolean;
  golden?: boolean;
  cols?: number;
  rows?: number;
};

function Mat({
  color,
  golden,
  roughness = 0.78,
  metalness = 0.04,
  surface,
  repeat = [1, 1],
}: {
  color: string;
  golden?: boolean;
  roughness?: number;
  metalness?: number;
  surface?: SurfaceName;
  repeat?: [number, number];
}) {
  return (
    <Surface
      name={surface}
      color={color}
      golden={golden}
      roughness={roughness}
      metalness={metalness}
      repeat={repeat}
    />
  );
}

function Glass({ night, w = 0.46, h = 0.62 }: { night: boolean; w?: number; h?: number }) {
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshPhysicalMaterial
        color={night ? "#ffd7a8" : "#d7f0f6"}
        emissive={night ? "#ffb15e" : "#000000"}
        emissiveIntensity={night ? 2.2 : 0}
        roughness={0.04}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.06}
        envMapIntensity={1.5}
        transparent
        opacity={night ? 1 : 0.82}
      />
    </mesh>
  );
}

export function Barn({ night, golden }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[6.1, 0.32, 4.15]} position={[0, 0.16, 0]} radius={0.04} smoothness={2} receiveShadow>
        <Mat surface="rock" color="#ffffff" repeat={[2.2, 1.2]} roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[5.7, 2.7, 3.75]} position={[0, 1.67, 0]} radius={0.05} smoothness={2} castShadow receiveShadow>
        <Mat surface="wood" color="#d45348" golden={golden} repeat={[2.6, 1.5]} roughness={0.78} />
      </RoundedBox>
      <mesh position={[0, 2.95, 0]} castShadow>
        <boxGeometry args={[5.95, 0.12, 4.05]} />
        <Mat surface="wood" color="#f4efe6" repeat={[3, 0.3]} roughness={0.55} />
      </mesh>
      <mesh position={[-0.72, 1.15, 1.9]} castShadow>
        <boxGeometry args={[1.22, 2.15, 0.08]} />
        <Mat surface="wood" color="#f7f1e6" repeat={[1, 1.6]} roughness={0.55} />
      </mesh>
      <mesh position={[0.72, 1.15, 1.9]} castShadow>
        <boxGeometry args={[1.22, 2.15, 0.08]} />
        <Mat surface="wood" color="#f3ebdd" repeat={[1, 1.6]} roughness={0.55} />
      </mesh>
      <mesh position={[-0.72, 1.2, 1.96]} rotation={[0, 0, 0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[-0.72, 1.2, 1.96]} rotation={[0, 0, -0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0.72, 1.2, 1.96]} rotation={[0, 0, 0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0.72, 1.2, 1.96]} rotation={[0, 0, -0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[-1.45, 3.7, 0]} rotation={[0, 0, 0.58]} castShadow>
        <boxGeometry args={[3.45, 0.16, 4.55]} />
        <Mat surface="roof" color="#ffffff" golden={golden} repeat={[2.4, 1.6]} roughness={0.85} />
      </mesh>
      <mesh position={[1.45, 3.7, 0]} rotation={[0, 0, -0.58]} castShadow>
        <boxGeometry args={[3.45, 0.16, 4.55]} />
        <Mat surface="roof" color="#f3f0ea" golden={golden} repeat={[2.4, 1.6]} roughness={0.85} />
      </mesh>
      <mesh position={[-0.72, 4.55, 0]} rotation={[0, 0, 0.28]} castShadow>
        <boxGeometry args={[2.25, 0.14, 4.65]} />
        <Mat surface="roof" color="#ffffff" repeat={[1.6, 1.5]} roughness={0.82} />
      </mesh>
      <mesh position={[0.72, 4.55, 0]} rotation={[0, 0, -0.28]} castShadow>
        <boxGeometry args={[2.25, 0.14, 4.65]} />
        <Mat surface="roof" color="#ffffff" repeat={[1.6, 1.5]} roughness={0.82} />
      </mesh>
      <mesh position={[0, 3.35, 1.9]}>
        <boxGeometry args={[0.85, 0.7, 0.06]} />
        <Mat color="#f4ead8" />
      </mesh>
      <group position={[0, 3.35, 1.95]}>
        <Glass night={night} w={0.7} h={0.55} />
      </group>
      <mesh position={[0, 5.15, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <Mat color="#f4ead8" />
      </mesh>
      <mesh position={[0, 5.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.62, 0.5, 4]} />
        <Mat surface="roof" color="#ffffff" repeat={[0.6, 0.4]} />
      </mesh>
      <Weathervane />
      <mesh position={[0, 3.05, 2.2]} castShadow>
        <boxGeometry args={[6.2, 0.07, 0.09]} />
        <meshStandardMaterial color="#9aa3ab" metalness={0.82} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.48, 1.9]}>
        <boxGeometry args={[5.72, 0.42, 0.06]} />
        <Mat surface="wood" color="#7a3a32" repeat={[3, 0.4]} roughness={0.9} />
      </mesh>
      <group position={[-2.15, 2.15, 1.9]}>
        <WindowFrame night={night} w={0.42} h={0.48} />
      </group>
      <group position={[2.15, 2.15, 1.9]}>
        <WindowFrame night={night} w={0.42} h={0.48} />
      </group>
    </group>
  );
}

export function Farmhouse({ night, golden }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[4.6, 2.5, 3.4]} position={[0, 1.45, 0]} radius={0.06} smoothness={2} castShadow receiveShadow>
        <Mat surface="brick" color="#ffffff" golden={golden} repeat={[2.4, 1.5]} roughness={0.86} />
      </RoundedBox>
      <mesh position={[-1.15, 3.15, 0]} rotation={[0, 0, 0.48]} castShadow>
        <boxGeometry args={[3.05, 0.16, 3.95]} />
        <Mat surface="roof" color="#ffffff" repeat={[1.8, 1.2]} roughness={0.8} />
      </mesh>
      <mesh position={[1.15, 3.15, 0]} rotation={[0, 0, -0.48]} castShadow>
        <boxGeometry args={[3.05, 0.16, 3.95]} />
        <Mat surface="roof" color="#f4f1ea" repeat={[1.8, 1.2]} roughness={0.8} />
      </mesh>
      <mesh position={[1.35, 3.7, -0.4]} castShadow>
        <boxGeometry args={[0.42, 0.9, 0.42]} />
        <Mat surface="brick" color="#e7e2dc" repeat={[0.4, 0.8]} />
      </mesh>
      <Smoke position={[1.35, 4.2, -0.4]} />
      <mesh position={[0, 0.55, 1.85]} castShadow>
        <boxGeometry args={[0.7, 1.15, 0.08]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[-1.35, 1.85, 1.72]}>
        <Glass night={night} />
      </group>
      <group position={[1.25, 1.85, 1.72]}>
        <Glass night={night} />
      </group>
      <group position={[-1.35, 0.85, 1.72]}>
        <Glass night={night} w={0.42} h={0.5} />
      </group>
      <mesh position={[0, 0.18, 2.15]} receiveShadow>
        <boxGeometry args={[4.8, 0.16, 1.2]} />
        <Mat surface="wood" color="#c4a06a" repeat={[2.4, 0.6]} roughness={0.8} />
      </mesh>
      <mesh position={[-2.05, 0.7, 2.15]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 1.25, 8]} />
        <Mat surface="wood" color="#6b4228" repeat={[0.3, 1]} />
      </mesh>
      <mesh position={[2.05, 0.7, 2.15]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 1.25, 8]} />
        <Mat surface="wood" color="#6b4228" repeat={[0.3, 1]} />
      </mesh>
      <mesh position={[0, 1.28, 2.15]}>
        <boxGeometry args={[4.3, 0.08, 0.08]} />
        <Mat surface="wood" color="#efe6d4" repeat={[2, 0.2]} />
      </mesh>
      <mesh position={[0, 1.22, 2.12]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color="#fff4d8"
          emissive="#ffb15e"
          emissiveIntensity={night ? 3.2 : 0.2}
          roughness={0.25}
        />
      </mesh>
      {night && <pointLight position={[0, 1.15, 2.2]} color="#ffb56a" intensity={1.4} distance={6} />}
    </group>
  );
}

function WindowFrame({ night, w, h }: { night: boolean; w: number; h: number }) {
  const t = 0.045;
  return (
    <group>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[w + t * 2, h + t * 2, 0.04]} />
        <Mat surface="wood" color="#f6f1e6" repeat={[0.6, 0.6]} />
      </mesh>
      <Glass night={night} w={w} h={h} />
    </group>
  );
}

function Weathervane() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, frameDelta) => {
    const dt = animationDelta(frameDelta);
    if (ref.current) ref.current.rotation.y += dt * 0.35;
  });
  return (
    <group ref={ref} position={[0, 6.05, 0]}>
      <mesh>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 6]} />
        <meshStandardMaterial color="#b7c0c8" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0.12, 0.18, 0]} castShadow>
        <boxGeometry args={[0.46, 0.025, 0.025]} />
        <meshStandardMaterial color="#d5dde4" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0.32, 0.18, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.045, 0.1, 4]} />
        <meshStandardMaterial color="#d5dde4" metalness={0.9} roughness={0.22} />
      </mesh>
    </group>
  );
}

function Smoke({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null);
  const seeds = useMemo(() => {
    const arr = new Float32Array(18 * 3);
    for (let i = 0; i < 18; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.2;
      arr[i * 3 + 1] = Math.random();
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return arr;
  }, []);
  useFrame(() => {
    const pts = ref.current;
    if (!pts) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const t = gameClock.seconds;
    for (let i = 0; i < 18; i++) {
      const life = (t * 0.25 + seeds[i * 3 + 1]) % 1;
      pos.setXYZ(i, seeds[i * 3] + Math.sin(t + i) * 0.08, life * 1.4, seeds[i * 3 + 2]);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeds, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4f1ec" size={0.18} transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

export function Silo({ night, golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 4.2, 20]} />
        <Mat color="#d5d8dc" golden={golden} roughness={0.28} metalness={golden ? 1 : 0.78} />
      </mesh>
      <mesh position={[0, 4.35, 0]} castShadow>
        <coneGeometry args={[1.12, 0.85, 20]} />
        <meshStandardMaterial color="#b7bcc2" metalness={0.86} roughness={0.28} />
      </mesh>
      {[1.1, 2.1, 3.1].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.02, 0.025, 8, 24]} />
          <meshStandardMaterial color="#8e949b" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[1.06, 1.06, 0.12, 20]} />
        <meshStandardMaterial color="#9aa1a8" metalness={0.84} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.55, 0.95]} castShadow>
        <boxGeometry args={[0.5, 0.9, 0.08]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[0, 1.8, 1.02]}>
        <Glass night={night} w={0.28} h={0.28} />
      </group>
    </group>
  );
}

export function Shed({ night, golden }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[2.6, 1.6, 2.1]} position={[0, 0.95, 0]} radius={0.05} smoothness={2} castShadow receiveShadow>
        <Mat surface="wood" color="#e7d3a4" golden={golden} repeat={[1.4, 1]} />
      </RoundedBox>
      <mesh position={[-0.7, 2.05, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[1.7, 0.1, 2.35]} />
        <Mat color="#5c3a2a" />
      </mesh>
      <mesh position={[0.7, 2.05, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[1.7, 0.1, 2.35]} />
        <Mat color="#5c3a2a" />
      </mesh>
      <mesh position={[0, 0.55, 1.08]}>
        <boxGeometry args={[0.55, 1.05, 0.06]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[-0.75, 1.15, 1.08]}>
        <Glass night={night} w={0.4} h={0.36} />
      </group>
    </group>
  );
}

function Gear({ teeth, radius }: { teeth: number; radius: number }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.78, radius * 0.78, 0.05, teeth]} />
        <meshStandardMaterial color="#aeb6be" metalness={0.84} roughness={0.3} />
      </mesh>
      {Array.from({ length: teeth }, (_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.07, 0.045, 0.05]} />
            <meshStandardMaterial color="#d5dde3" metalness={0.8} roughness={0.32} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Windmill({ night, golden }: ModelProps) {
  const blades = useRef<THREE.Group>(null);
  const big = useRef<THREE.Group>(null);
  const small = useRef<THREE.Group>(null);
  const rod = useRef<THREE.Mesh>(null);
  useFrame((_, frameDelta) => {
    const dt = animationDelta(frameDelta);
    const step = dt * 0.8;
    if (blades.current) blades.current.rotation.z -= step;
    if (big.current) big.current.rotation.z -= step * 0.5;
    if (small.current) small.current.rotation.z += step;
    if (rod.current && big.current) rod.current.position.y = 0.55 + Math.sin(-big.current.rotation.z) * 0.16;
  });
  return (
    <group>
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.95, 4.2, 8]} />
        <Mat color="#f0e2c8" golden={golden} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.35, 0]} castShadow>
        <coneGeometry args={[0.7, 0.7, 8]} />
        <Mat color="#7a4a2c" />
      </mesh>
      <group position={[0, 3.5, 0.62]} ref={blades}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[0.22, 1.7, 0.06]} />
              <Mat color={i % 2 ? "#e07a55" : "#d4534a"} roughness={0.55} />
            </mesh>
          </group>
        ))}
        <mesh>
          <sphereGeometry args={[0.16, 12, 12]} />
          <Mat color="#f6ead2" />
        </mesh>
      </group>
      <group position={[0, 1.4, 0.9]}>
        <Glass night={night} w={0.28} h={0.34} />
      </group>
      <group ref={big} position={[-0.22, 1.15, 0.95]}>
        <Gear teeth={12} radius={0.28} />
      </group>
      <group ref={small} position={[0.28, 1.15, 0.95]}>
        <Gear teeth={6} radius={0.14} />
      </group>
      <mesh ref={rod} position={[0.28, 0.55, 0.95]}>
        <boxGeometry args={[0.035, 0.7, 0.035]} />
        <meshStandardMaterial color="#6d5844" metalness={0.35} roughness={0.55} />
      </mesh>
    </group>
  );
}

export function WaterTower({ night, golden }: ModelProps) {
  return (
    <group>
      {[
        [-0.55, 0, -0.55],
        [0.55, 0, -0.55],
        [-0.55, 0, 0.55],
        [0.55, 0, 0.55],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 1.5, p[2]]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 3, 6]} />
          <Mat color="#8d8680" metalness={0.45} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.15, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.85, 16]} />
        <Mat color="#d5e4ea" golden={golden} metalness={golden ? 1 : 0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 3.65, 0]} castShadow>
        <coneGeometry args={[1.05, 0.45, 16]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[0, 3.15, 0.97]}>
        <Glass night={night} w={0.2} h={0.2} />
      </group>
    </group>
  );
}

export function Coop({ night }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[1.7, 1.05, 1.3]} position={[0, 0.7, 0]} radius={0.05} smoothness={2} castShadow receiveShadow>
        <Mat color="#f0d7a4" />
      </RoundedBox>
      <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.25, 0.55, 4]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0, 0.4, 0.68]}>
        <boxGeometry args={[0.4, 0.55, 0.05]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[0.45, 0.85, 0.68]}>
        <Glass night={night} w={0.22} h={0.22} />
      </group>
    </group>
  );
}

export function Pond() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[1.85, 2.45, 40]} />
        <Mat surface="dirt" color="#6a5340" repeat={[2, 0.4]} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
        <circleGeometry args={[2.05, 48]} />
        <meshStandardMaterial
          color="#1c6e86"
          metalness={0.82}
          roughness={0.08}
          transparent
          opacity={0.94}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

export function Tree({ golden }: ModelProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.z = Math.sin(gameClock.seconds * 0.8) * 0.015;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.4, 6]} />
        <Mat color="#6b4228" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.72, 16, 12]} />
        <Mat color="#1c8f84" golden={golden} roughness={0.85} />
      </mesh>
      <mesh position={[-0.4, 1.45, 0.15]} castShadow>
        <sphereGeometry args={[0.48, 12, 10]} />
        <Mat color="#146e66" roughness={0.88} />
      </mesh>
      <mesh position={[0.38, 1.5, -0.1]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <Mat color="#2fbfb0" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Blossom() {
  return (
    <group>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 1.3, 6]} />
        <Mat color="#6b4228" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.66, 14, 12]} />
        <Mat color="#f2a3c0" roughness={0.8} />
      </mesh>
      <mesh position={[-0.35, 1.4, 0.1]}>
        <sphereGeometry args={[0.4, 10, 8]} />
        <Mat color="#e56b93" roughness={0.82} />
      </mesh>
      <mesh position={[0.32, 1.45, -0.08]}>
        <sphereGeometry args={[0.36, 10, 8]} />
        <Mat color="#ffd0e0" roughness={0.75} />
      </mesh>
    </group>
  );
}

export function Wheat({ cols = 4, rows = 2 }: ModelProps) {
  return <Field color="#e2b14a" cols={cols} rows={rows} height={0.85} />;
}

export function Crops({ cols = 3, rows = 1 }: ModelProps) {
  return <Field color="#2f8f45" cols={cols} rows={rows} height={0.45} />;
}

function Field({ color, cols, rows, height }: { color: string; cols: number; rows: number; height: number }) {
  const w = Math.max(1.4, cols * CELL * 0.9);
  const d = Math.max(1.4, rows * CELL * 0.9);
  const rowCount = Math.max(3, Math.round(d / 0.42));
  const perRow = Math.max(8, Math.round(w / 0.16));
  const count = rowCount * perRow;
  const geom = useMemo(() => new THREE.BoxGeometry(0.08, height, 0.08), [height]);
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    let n = 0;
    for (let r = 0; r < rowCount; r++) {
      const z = -d / 2 + ((r + 0.5) * d) / rowCount;
      for (let c = 0; c < perRow; c++) {
        const x = -w / 2 + ((c + 0.5) * w) / perRow;
        dummy.position.set(x, height / 2, z);
        dummy.rotation.y = (c % 2) * 0.15;
        dummy.scale.set(1, 0.75 + ((c * 3 + r) % 5) * 0.08, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(n, dummy.matrix);
        n++;
      }
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, d, dummy, height, perRow, rowCount, w]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[w + 0.3, d + 0.3]} />
        <Mat surface="dirt" color="#8a6a45" repeat={[2, 1.2]} roughness={1} />
      </mesh>
      <instancedMesh ref={ref} args={[geom, undefined, count]} castShadow>
        <meshStandardMaterial color={color} roughness={0.78} />
      </instancedMesh>
    </group>
  );
}

export function Scarecrow() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.8, 6]} />
        <Mat color="#6b4228" />
      </mesh>
      <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 1.1, 6]} />
        <Mat color="#6b4228" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.2]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 10]} />
        <Mat color="#f0d2a4" />
      </mesh>
      <mesh position={[0, 1.82, 0]}>
        <coneGeometry args={[0.22, 0.28, 8]} />
        <Mat color="#2c241c" />
      </mesh>
    </group>
  );
}

function BirdBody({ color, comb }: { color: string; comb: string }) {
  const head = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!head.current) return;
    const t = gameClock.seconds;
    head.current.rotation.x = Math.sin(t * 3.2) > 0.65 ? 0.5 : 0;
  });
  return (
    <group>
      <mesh position={[0, 0.22, 0]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <group ref={head} position={[0.12, 0.3, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0.08, 0.06, 0]}>
          <coneGeometry args={[0.03, 0.06, 4]} />
          <meshStandardMaterial color={comb} />
        </mesh>
      </group>
    </group>
  );
}

export function Chicken() {
  return <BirdBody color="#f4efe4" comb="#e1534a" />;
}
export function Hen() {
  return <BirdBody color="#e0a84a" comb="#c4453c" />;
}

function Hoof({
  position,
  height = 0.5,
  radius = 0.065,
}: {
  position: [number, number, number];
  height?: number;
  radius?: number;
}) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} castShadow>
      <cylinderGeometry args={[radius * 0.8, radius, height, 7]} />
      <meshStandardMaterial color="#2c261f" roughness={0.84} />
    </mesh>
  );
}

export function Cow() {
  const tail = useRef<THREE.Group>(null);
  useFrame(() => {
    if (tail.current) tail.current.rotation.z = Math.sin(gameClock.seconds * 2.2) * 0.35;
  });
  return (
    <group>
      <Hoof position={[-0.28, 0.24, 0.16]} />
      <Hoof position={[-0.28, 0.24, -0.16]} />
      <Hoof position={[0.32, 0.24, 0.16]} />
      <Hoof position={[0.32, 0.24, -0.16]} />
      <mesh position={[0.02, 0.68, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.26, 0.78, 6, 12]} />
        <meshStandardMaterial color="#f3efe6" roughness={0.62} />
      </mesh>
      <mesh position={[-0.08, 0.78, 0.12]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#3a322c" roughness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.74, -0.1]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color="#3a322c" roughness={0.8} />
      </mesh>
      <mesh position={[-0.58, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 10]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.6} />
      </mesh>
      <mesh position={[-0.74, 0.68, 0]}>
        <boxGeometry args={[0.12, 0.1, 0.16]} />
        <meshStandardMaterial color="#e7c2b0" roughness={0.7} />
      </mesh>
      <mesh position={[-0.62, 0.96, 0.08]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.035, 0.12, 5]} />
        <meshStandardMaterial color="#d9d4cc" roughness={0.45} />
      </mesh>
      <mesh position={[-0.62, 0.96, -0.08]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.035, 0.12, 5]} />
        <meshStandardMaterial color="#d9d4cc" roughness={0.45} />
      </mesh>
      <group ref={tail} position={[0.5, 0.72, 0]}>
        <mesh position={[0.12, -0.08, 0]} rotation={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.018, 0.022, 0.32, 5]} />
          <meshStandardMaterial color="#3a322c" />
        </mesh>
      </group>
    </group>
  );
}

export function Sheep() {
  return (
    <group>
      <Hoof position={[-0.12, 0, 0.1]} height={0.28} radius={0.045} />
      <Hoof position={[-0.12, 0, -0.1]} height={0.28} radius={0.045} />
      <Hoof position={[0.14, 0, 0.1]} height={0.28} radius={0.045} />
      <Hoof position={[0.14, 0, -0.1]} height={0.28} radius={0.045} />
      <mesh position={[0.02, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.26, 14, 12]} />
        <meshStandardMaterial color="#f6f3ee" roughness={0.95} />
      </mesh>
      <mesh position={[-0.22, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color="#2e2924" roughness={0.7} />
      </mesh>
      <mesh position={[-0.32, 0.44, 0]}>
        <boxGeometry args={[0.06, 0.05, 0.08]} />
        <meshStandardMaterial color="#1c1916" />
      </mesh>
    </group>
  );
}

export function Cat() {
  const tail = useRef<THREE.Group>(null);
  useFrame(() => {
    if (tail.current) tail.current.rotation.z = Math.sin(gameClock.seconds * 2.4) * 0.5;
  });
  return (
    <group>
      <mesh position={[0, 0.16, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.18, 3, 6]} />
        <meshStandardMaterial color="#e39a4e" roughness={0.7} />
      </mesh>
      <mesh position={[0.16, 0.26, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#e39a4e" />
      </mesh>
      <group ref={tail} position={[-0.18, 0.2, 0]}>
        <mesh rotation={[0, 0, 0.8]} position={[-0.08, 0.06, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.2, 4]} />
          <meshStandardMaterial color="#c4844a" />
        </mesh>
      </group>
    </group>
  );
}

export function Dog() {
  const tail = useRef<THREE.Group>(null);
  useFrame(() => {
    if (tail.current) tail.current.rotation.z = Math.sin(gameClock.seconds * 6) * 0.45;
  });
  return (
    <group>
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.14, 0.28, 4, 8]} />
        <meshStandardMaterial color="#c47a3a" roughness={0.7} />
      </mesh>
      <mesh position={[0.28, 0.38, 0]} castShadow>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color="#d08a48" />
      </mesh>
      <mesh position={[0.22, 0.32, 0]}>
        <boxGeometry args={[0.16, 0.05, 0.16]} />
        <meshStandardMaterial color="#c4453c" />
      </mesh>
      <group ref={tail} position={[-0.28, 0.36, 0]}>
        <mesh rotation={[0, 0, 1]} position={[-0.1, 0.04, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 0.22, 5]} />
          <meshStandardMaterial color="#a86830" />
        </mesh>
      </group>
    </group>
  );
}

export function Tractor() {
  const wheel = useRef<THREE.Mesh>(null);
  useFrame((_, frameDelta) => {
    const dt = animationDelta(frameDelta);
    if (wheel.current) wheel.current.rotation.x -= dt * 0.8;
  });
  return (
    <group>
      <mesh ref={wheel} position={[-0.35, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.18, 12]} />
        <meshStandardMaterial color="#2a241c" roughness={0.85} />
      </mesh>
      <mesh position={[0.4, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.12, 10]} />
        <meshStandardMaterial color="#2a241c" />
      </mesh>
      <mesh position={[0.05, 0.42, 0]} castShadow>
        <boxGeometry args={[0.85, 0.32, 0.5]} />
        <meshStandardMaterial color="#d4534a" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0.28, 0.68, 0]}>
        <boxGeometry args={[0.32, 0.28, 0.42]} />
        <meshStandardMaterial color="#b7e0ea" roughness={0.15} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function Mailbox() {
  const flag = useRef<THREE.Group>(null);
  useFrame(() => {
    if (flag.current) flag.current.rotation.z = Math.sin(gameClock.seconds * 1.6) * 0.15;
  });
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.9, 6]} />
        <Mat color="#6b3e24" />
      </mesh>
      <mesh position={[0.12, 0.85, 0]} castShadow>
        <boxGeometry args={[0.42, 0.22, 0.22]} />
        <meshStandardMaterial color="#d4534a" roughness={0.5} metalness={0.15} />
      </mesh>
      <group ref={flag} position={[0.32, 0.95, 0]}>
        <mesh position={[0.08, 0.08, 0]}>
          <boxGeometry args={[0.16, 0.1, 0.02]} />
          <meshStandardMaterial color="#e1534a" />
        </mesh>
      </group>
    </group>
  );
}

export function Stall() {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.12, 0.7]} />
        <Mat color="#c4894e" />
      </mesh>
      <mesh position={[0, 0.85, 0]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.7, 0.06, 0.9]} />
        <meshStandardMaterial color="#f4a0be" roughness={0.6} />
      </mesh>
      <mesh position={[-0.55, 0.55, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.28]} />
        <Mat color="#e2b14a" />
      </mesh>
    </group>
  );
}

export function Sign() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 1.1, 6]} />
        <Mat color="#6b3e24" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.06]} />
        <Mat color="#f3e6d0" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Fence({ cols = 2 }: ModelProps) {
  const w = Math.max(CELL, (cols ?? 2) * CELL * 0.92);
  const posts = Math.max(2, Math.round(w / 1.1));
  return (
    <group>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <Mat surface="wood" color="#e7d7bc" repeat={[Math.max(2, w), 0.25]} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <Mat surface="wood" color="#f0e6d2" repeat={[Math.max(2, w), 0.25]} roughness={0.68} />
      </mesh>
      {Array.from({ length: posts }, (_, i) => {
        const x = -w / 2 + (i * w) / (posts - 1);
        return (
          <mesh key={i} position={[x, 0.45, 0]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.08]} />
            <Mat surface="wood" color="#f4ead8" repeat={[0.3, 0.8]} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Hay() {
  return (
    <mesh position={[0, 0.28, 0]} rotation={[0, 0.4, 0]} castShadow>
      <cylinderGeometry args={[0.38, 0.42, 0.5, 10]} />
      <meshStandardMaterial color="#e2b14a" roughness={0.9} />
    </mesh>
  );
}

export function Greenhouse() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.6, 0.2, 1.1]} />
        <Mat color="#c4894e" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.75, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d7f3f4" transparent opacity={0.45} roughness={0.05} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <Mat color="#1f9a8e" />
      </mesh>
    </group>
  );
}

export function FencePeg({ golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.9, 6]} />
        <Mat color="#f0e2c8" golden={golden} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <Mat color="#e2b14a" golden={golden} metalness={golden ? 1 : 0.1} />
      </mesh>
    </group>
  );
}

export function FlowerSign({ golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.7, 5]} />
        <Mat color="#3d7a32" />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.16, 8, 6]} />
        <meshStandardMaterial color={golden ? "#e7c56b" : "#f4a0be"} emissive={golden ? "#b8862a" : "#000"} emissiveIntensity={golden ? 0.4 : 0} roughness={0.45} metalness={golden ? 0.8 : 0} />
      </mesh>
      <mesh position={[0, 0.75, 0.08]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#e2b14a" />
      </mesh>
    </group>
  );
}

export function AnimalSign() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.08, 1, 0.08]} />
        <Mat color="#6b3e24" />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.55, 0.32, 0.05]} />
        <Mat color="#f6ead2" />
      </mesh>
    </group>
  );
}

export function PlotStake({ golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.07, 0.9, 0.07]} />
        <Mat color="#6b3e24" golden={golden} />
      </mesh>
      <mesh position={[0.18, 0.78, 0]}>
        <boxGeometry args={[0.28, 0.16, 0.03]} />
        <Mat color="#f6ead2" golden={golden} />
      </mesh>
    </group>
  );
}

export const MODELS: Record<string, (props: ModelProps) => ReactElement> = {
  barn: CourtyardHouse,
  farmhouse: CourtyardHouse,
  silo: EarthGranary,
  shed: StoneWorkshop,
  windmill: EarthGranary,
  waterTower: WaterTower,
  coop: Coop,
  pond: Pond,
  tree: () => <AtlasCedar height={4.8} />,
  blossom: Blossom,
  wheat: Wheat,
  crops: Crops,
  scarecrow: Scarecrow,
  chicken: Chicken,
  hen: Hen,
  cow: Cow,
  sheep: Sheep,
  donkey: Donkey,
  cat: Cat,
  dog: Dog,
  tractor: Tractor,
  mailbox: Mailbox,
  stall: Stall,
  sign: Sign,
  fence: Fence,
  hay: Hay,
  greenhouse: Greenhouse,
  fencePeg: FencePeg,
  flowerSign: FlowerSign,
  animalSign: AnimalSign,
  plotStake: PlotStake,
};
