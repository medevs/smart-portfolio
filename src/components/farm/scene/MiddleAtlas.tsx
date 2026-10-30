"use client";

import { Surface } from "./materials";
import type { ModelProps } from "./models";

/** Regional interpretation, with source photographs documented in MOROCCO-REFERENCES.md. */
function Block({ position, size, color = "#b99b78", stone = false }: {
  position: [number, number, number]; size: [number, number, number]; color?: string; stone?: boolean;
}) {
  return <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <Surface name={stone ? "rock" : "dirt"} color={color} repeat={[2, 1]} roughness={0.98} metalness={0} />
  </mesh>;
}

function Window({ x, y, z, night }: { x: number; y: number; z: number; night: boolean }) {
  return <group position={[x, y, z]}>
    <Block position={[0, 0, 0]} size={[0.6, 0.75, 0.12]} color="#eee0bb" />
    <mesh position={[0, 0, 0.07]}>
      <planeGeometry args={[0.4, 0.55]} />
      <meshStandardMaterial color={night ? "#f3bc67" : "#293d3d"} emissive="#e9a34a" emissiveIntensity={night ? 1.4 : 0} />
    </mesh>
    {[-0.13, 0, 0.13].map(x => <Block key={x} position={[x, 0, 0.09]} size={[0.025, 0.58, 0.025]} color="#493d32" />)}
  </group>;
}

export function CourtyardHouse({ night, golden }: ModelProps) {
  const earth = golden ? "#d5b15f" : "#b89b7a";
  return <group>
    <Block position={[0, 0.18, 0]} size={[5.8, 0.36, 4.2]} stone color="#a3947d" />
    <Block position={[0, 1.55, -0.65]} size={[5.4, 2.65, 2.6]} color={earth} />
    <Block position={[0, 2.91, -0.65]} size={[5.6, 0.16, 2.8]} color="#a98e6c" />
    {[-2.65, 2.65].map(x => <Block key={x} position={[x, 3.12, -0.65]} size={[0.18, 0.38, 2.8]} color={earth} />)}
    <Block position={[0, 3.12, -1.98]} size={[5.6, 0.38, 0.18]} color={earth} />
    <Block position={[-2.65, 0.95, 1.15]} size={[0.24, 1.55, 2.3]} stone />
    <Block position={[2.65, 0.95, 1.15]} size={[0.24, 1.55, 2.3]} stone />
    {[-1.85, 1.85].map(x => <Block key={x} position={[x, 0.85, 2.2]} size={[1.7, 1.35, 0.25]} stone />)}
    <Block position={[0, 1.05, 0.69]} size={[0.92, 1.9, 0.16]} color="#534b38" />
    <Window x={-1.65} y={1.92} z={0.72} night={night} />
    <Window x={1.65} y={1.92} z={0.72} night={night} />
    {[-1.95, -0.98, 0, 0.98, 1.95].map(x => <Block key={x} position={[x, 2.75, 0.98]} size={[0.1, 0.12, 1.1]} color="#64513b" />)}
    <Block position={[0, 0.42, 1.86]} size={[1.15, 0.18, 0.5]} stone />
    {night && <pointLight position={[0, 2.2, 1.3]} color="#ffc583" intensity={2} distance={7} />}
  </group>;
}

export function EarthGranary({ night, golden }: ModelProps) {
  return <group>
    <Block position={[0, 0.32, 0]} size={[2.2, 0.64, 2.2]} stone color="#a38c72" />
    <Block position={[0, 1.9, 0]} size={[1.95, 2.7, 1.95]} color={golden ? "#d5b15f" : "#b59572"} />
    <Block position={[0, 3.3, 0]} size={[2.12, 0.14, 2.12]} color="#b99b78" />
    {[-0.94, 0.94].flatMap(x => [-0.94, 0.94].map(z => <Block key={`${x}:${z}`} position={[x, 3.52, z]} size={[0.25, 0.38, 0.25]} />))}
    <Block position={[0, 0.97, 1.01]} size={[0.66, 1.18, 0.12]} color="#574833" />
    <Window x={0} y={2.35} z={1.02} night={night} />
  </group>;
}

export function StoneWorkshop(props: ModelProps) {
  return <group scale={[0.76, 0.82, 0.78]}><CourtyardHouse {...props} /></group>;
}

export function AtlasCedar({ height = 6 }: { height?: number }) {
  return <group scale={height / 6}>
    <mesh position={[0, 2.3, 0]} castShadow><cylinderGeometry args={[0.14, 0.33, 4.6, 9]} /><Surface name="wood" color="#6e6453" metalness={0} /></mesh>
    {[0, 1, 2, 3, 4].map(i => <group key={i} position={[0, 2.6 + i * 0.63, 0]} rotation={[0, i * 1.7, 0]}>
      <mesh castShadow scale={[1, 0.27, 0.85]}><sphereGeometry args={[2.05 - i * 0.27, 9, 6]} /><meshStandardMaterial color={i % 2 ? "#526c60" : "#3f6258"} roughness={1} /></mesh>
      <Block position={[0.5, -0.1, 0]} size={[1.6, 0.09, 0.1]} color="#695b45" />
    </group>)}
  </group>;
}

function AppleTree() {
  return <group>
    <mesh position={[0, 0.9, 0]} castShadow><cylinderGeometry args={[0.07, 0.14, 1.8, 7]} /><Surface name="wood" color="#806644" /></mesh>
    <mesh position={[0, 2, 0]} scale={[1, 0.85, 1]} castShadow><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color="#667c40" roughness={1} /></mesh>
    {[0, 1, 2, 3, 4, 5].map(i => <mesh key={i} position={[Math.sin(i * 2.4) * 0.85, 1.7 + (i % 3) * 0.28, Math.cos(i * 2.4) * 0.85]} castShadow><sphereGeometry args={[0.09, 7, 6]} /><meshStandardMaterial color="#b35737" roughness={0.7} /></mesh>)}
  </group>;
}

export function AtlasLandscape() {
  return <group>
    {/* An orchard in rows, with a narrow stone-lined seguia beside it. */}
    {[0, 1, 2].flatMap(row => [0, 1, 2, 3].map(col => <group key={`${row}:${col}`} position={[-20 + col * 2.6, 0, 8 + row * 2.8]}><AppleTree /></group>))}
    {[-0.36, 0.36].map(x => <Block key={x} position={[-10.4 + x, 0.12, 9.5]} size={[0.16, 0.24, 14]} stone color="#ae9c7f" />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10.4, 0.1, 9.5]}><planeGeometry args={[0.56, 14]} /><meshStandardMaterial color="#648f88" roughness={0.22} metalness={0.1} /></mesh>
    {Array.from({length: 16}, (_, i) => <group key={i} position={[-28 + i * 3.8, 0, -17 - (i % 3) * 3]}><AtlasCedar height={5.2 + (i % 4) * 0.6} /></group>)}
    {/* Layered rocky ridges rather than isolated cone peaks. */}
    {Array.from({length: 10}, (_, i) => <group key={i} position={[-48 + i * 10, -1, -59 - (i % 2) * 6]} scale={[1.7, 1, 0.8]}>
      <mesh position={[0, 8 + (i % 3), 0]} castShadow><coneGeometry args={[12, 20 + (i % 3) * 3, 5]} /><meshStandardMaterial color={i % 2 ? "#85867f" : "#99968a"} roughness={1} /></mesh>
      <mesh position={[0, 16 + (i % 3) * 1.7, 0]}><coneGeometry args={[4.1, 7 + (i % 3), 5]} /><meshStandardMaterial color="#e3e4d9" roughness={1} /></mesh>
    </group>)}
  </group>;
}

export function Donkey() {
  return <group>
    <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.25, 0.64, 5, 10]} /><meshStandardMaterial color="#8c877b" roughness={0.95} /></mesh>
    {[-0.3, 0.3].flatMap(x => [-0.17, 0.17].map(z => <mesh key={`${x}:${z}`} position={[x, 0.35, z]} castShadow><cylinderGeometry args={[0.055, 0.065, 0.7, 7]} /><meshStandardMaterial color="#6f6b64" roughness={1} /></mesh>))}
    <mesh position={[-0.5, 1.14, 0]} rotation={[0, 0, -0.45]} castShadow><capsuleGeometry args={[0.14, 0.36, 4, 9]} /><meshStandardMaterial color="#999487" roughness={0.9} /></mesh>
    <mesh position={[-0.65, 1.38, 0]} scale={[1.4, 0.85, 1]} castShadow><sphereGeometry args={[0.17, 10, 8]} /><meshStandardMaterial color="#aaa392" roughness={0.9} /></mesh>
    {[-0.09, 0.09].map(z => <mesh key={z} position={[-0.55, 1.68, z]} rotation={[0, 0, -0.15]} castShadow><capsuleGeometry args={[0.04, 0.26, 4, 6]} /><meshStandardMaterial color="#797467" roughness={1} /></mesh>)}
    <mesh position={[-0.73, 1.44, 0.15]}><sphereGeometry args={[0.018, 6, 6]} /><meshStandardMaterial color="#282720" /></mesh>
    <mesh position={[0.54, 0.72, 0]} rotation={[0, 0, 0.25]}><cylinderGeometry args={[0.025, 0.04, 0.5, 6]} /><meshStandardMaterial color="#625f53" /></mesh>
  </group>;
}
