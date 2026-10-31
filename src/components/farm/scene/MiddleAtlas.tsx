"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
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
    <SolarRoof />
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

export function AtlasLandscape({ night = false }: { night?: boolean }) {
  return <group>
    {/* An orchard in rows, with a narrow stone-lined seguia beside it. */}
    <Orchard />
    <FutureSpaces night={night} />
    <group position={[0, 0, -17]}><ModernHomestead night={night} /></group>
    {[-0.36, 0.36].map(x => <Block key={x} position={[-10.4 + x, 0.12, 9.5]} size={[0.16, 0.24, 14]} stone color="#ae9c7f" />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10.4, 0.1, 9.5]}><planeGeometry args={[0.56, 14]} /><meshStandardMaterial color="#648f88" roughness={0.22} metalness={0.1} /></mesh>
    {Array.from({length: 16}, (_, i) => <group key={i} position={[-28 + i * 3.8, 0, -17 - (i % 3) * 3]}><AtlasCedar height={5.2 + (i % 4) * 0.6} /></group>)}
    <AtlasRidge />
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

function SolarRoof() {
  return <group position={[0, 3.13, -0.65]} rotation={[-0.16, 0, 0]}>
    {[-1.25, 0, 1.25].map(x => <mesh key={x} position={[x, 0, 0]} castShadow>
      <boxGeometry args={[1.08, 0.06, 1.45]} /><meshStandardMaterial color="#263d49" metalness={0.4} roughness={0.3} />
    </mesh>)}
  </group>;
}

type Instance = { position: [number, number, number]; scale?: [number, number, number]; rotation?: number };
function Repeated({ instances, shape, color }: { instances: Instance[]; shape: "trunk" | "canopy" | "apple" | "crop"; color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const object = new THREE.Object3D();
    instances.forEach((instance, i) => {
      object.position.set(...instance.position);
      object.scale.set(...(instance.scale ?? [1, 1, 1]));
      object.rotation.set(0, instance.rotation ?? 0, 0);
      object.updateMatrix();
      mesh.current!.setMatrixAt(i, object.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [instances]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, instances.length]} castShadow receiveShadow>
    {shape === "trunk" ? <cylinderGeometry args={[0.08, 0.15, 1.8, 7]} /> : shape === "apple" ? <sphereGeometry args={[0.1, 6, 5]} /> : shape === "crop" ? <sphereGeometry args={[0.18, 7, 5]} /> : <icosahedronGeometry args={[1.15, 2]} />}
    <meshStandardMaterial color={color} roughness={0.93} />
  </instancedMesh>;
}

/** Rows and crop beds use instancing, keeping the expanded land to a few draws. */
function Orchard() {
  const trees = useMemo<Instance[]>(() => Array.from({ length: 48 }, (_, i) => ({
    position: [-31 + (i % 6) * 3, 0.9, 8 + Math.floor(i / 6) * 3], rotation: i * 2.4,
  })), []);
  const crowns = useMemo<Instance[]>(() => trees.map((tree, i) => ({ ...tree, position: [tree.position[0], 2.1, tree.position[2]], scale: [1, 0.82 + i % 3 * 0.05, 1] })), [trees]);
  const apples = useMemo<Instance[]>(() => trees.flatMap(tree => Array.from({ length: 5 }, (_, i) => ({ position: [tree.position[0] + Math.sin(i * 2.4) * .95, 1.85 + i % 3 * .3, tree.position[2] + Math.cos(i * 2.4) * .95] }))), [trees]);
  const crops = useMemo<Instance[]>(() => Array.from({ length: 240 }, (_, i) => ({ position: [8 + (i % 20) * .55, .22, 13 + Math.floor(i / 20) * .7], scale: [1, .7, 1] })), []);
  return <group>
    <Repeated instances={trees} shape="trunk" color="#71533d" />
    <Repeated instances={crowns} shape="canopy" color="#657b43" />
    <Repeated instances={apples} shape="apple" color="#b65c36" />
    <Repeated instances={crops} shape="crop" color="#526c3d" />
    {[0, 1, 2, 3].map(i => <Block key={i} position={[13.3, .06, 13.7 + i * 2.1]} size={[12, .12, 1.5]} color="#806849" />)}
    <Block position={[-23.5, .04, 18.5]} size={[20, .08, 24]} color="#a08c61" />
  </group>;
}

function AtlasRidge() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(210, 48, 100, 16);
    g.rotateX(-Math.PI / 2);
    const positions = g.attributes.position;
    const colors = [];
    const rock = new THREE.Color("#8b8e87"), snow = new THREE.Color("#e5e5dc");
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i);
      const ridge = 11 + 5 * Math.sin(x * .075) + 3 * Math.cos(x * .19) + 1.4 * Math.sin(x * .7);
      const y = Math.max(0, ridge * Math.sin((z + 24) / 48 * Math.PI)) + Math.sin(x * .4 + z * .25);
      positions.setY(i, y);
      const color = rock.clone().lerp(snow, THREE.MathUtils.smoothstep(y + Math.sin(x) * .7, 12, 17));
      colors.push(color.r, color.g, color.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return <mesh geometry={geometry} position={[0, -1, -66]}><meshStandardMaterial vertexColors roughness={1} /></mesh>;
}

function MakerAtWork() {
  return <group position={[0, 0, .3]}>
    <Block position={[0, .85, 0]} size={[1.65, .1, .65]} color="#725c42" />
    {[-.65, .65].map(x => <Block key={x} position={[x, .4, 0]} size={[.07, .8, .07]} color="#38423d" />)}
    <Block position={[0, 1.17, -.16]} size={[.55, .37, .04]} color="#293f45" />
    <mesh position={[0, 1.05, .55]} castShadow><capsuleGeometry args={[.18, .38, 4, 8]} /><meshStandardMaterial color="#4c6655" /></mesh>
    <mesh position={[0, 1.51, .55]} castShadow><sphereGeometry args={[.14, 10, 8]} /><meshStandardMaterial color="#665649" /></mesh>
    <Block position={[0, .65, .65]} size={[.45, .1, .45]} color="#584635" />
  </group>;
}

function FutureSpaces({ night }: { night: boolean }) {
  return <group>
    {/* The distant maker is symbolic; no personal likeness is inferred. */}
    <group position={[-11, 0, .3]}><MakerAtWork /></group>
    <group position={[-3, 0, 19]}>
      <Block position={[0, .1, 0]} size={[9, .2, 6]} stone color="#b9ab8d" />
      {[-4, 4].flatMap(x => [-2.5, 2.5].map(z => <Block key={`${x}:${z}`} position={[x, 1.6, z]} size={[.16, 3, .16]} color="#796146" />))}
      {Array.from({ length: 13 }, (_, i) => <Block key={i} position={[-4 + i * .67, 3.15, 0]} size={[.1, .14, 5.6]} color="#766144" />)}
      <Block position={[0, .9, 0]} size={[6, .12, 1.3]} color="#8e7250" />
      {[-1.1, 1.1].map(z => <Block key={z} position={[0, .5, z]} size={[6, .13, .4]} color="#8e7250" />)}
      <Html position={[0, 3.8, 0]} center distanceFactor={28}><a className="world-place-label" href="/gather#meetups">Future gathering courtyard ↗</a></Html>
    </group>
    {[0, 1].map(i => <group key={i} position={[17 + i * 7, 0, -16]} scale={.8}>
      <CourtyardHouse night={night} />
      <Html position={[0, 4.4, 0]} center distanceFactor={28}><a className="world-place-label" href="/gather#visiting">Future guest space ↗</a></Html>
    </group>)}
    {/* Greenhouse and utility structures remain behind the productive beds. */}
    {[0, 1, 2].map(i => <group key={i} position={[23 + i * 1.7, 0, 15]}>
      <Block position={[0, .65, 0]} size={[1.1, 1.1, .8]} color="#d0b16c" />
      <Block position={[0, 1.24, 0]} size={[1.2, .12, .9]} color="#7f9b91" />
    </group>)}
  </group>;
}

function ModernHomestead({ night }: { night: boolean }) {
  return <group>
    <Block position={[0, .15, 0]} size={[11.5, .3, 8.5]} stone color="#aa9b80" />
    <Block position={[0, 1.8, -1]} size={[10.4, 3.3, 4.8]} color="#baa17f" />
    <Block position={[0, 3.5, -1]} size={[10.8, .18, 5.2]} color="#99876b" />
    {[-4, -2, 0, 2, 4].map(x => <group key={x} position={[x, 1.7, 1.43]}>
      <Block position={[0, 0, 0]} size={[1.7, 2.4, .12]} color="#34443f" />
      <mesh position={[0, 0, .08]}><planeGeometry args={[1.5, 2.18]} />
        <meshStandardMaterial color={night ? "#e8ba70" : "#668a91"} roughness={.2} metalness={.3} emissive="#d99943" emissiveIntensity={night ? .8 : 0} />
      </mesh>
    </group>)}
    <group position={[0, .55, -1]}><SolarRoof /></group>
    {[-5, 5].map(x => <Block key={x} position={[x, 1.65, 3.4]} size={[.15, 3.1, .15]} color="#745d41" />)}
    {Array.from({ length: 17 }, (_, i) => <Block key={i} position={[-5 + i * .625, 3.2, 2.7]} size={[.1, .12, 2.1]} color="#796447" />)}
    <Block position={[-3.8, .45, 3.2]} size={[1.4, .6, .7]} stone color="#b29c7b" />
    <Block position={[3.8, .45, 3.2]} size={[1.4, .6, .7]} stone color="#b29c7b" />
  </group>;
}
