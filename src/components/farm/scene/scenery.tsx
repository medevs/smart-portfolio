"use client";

import { useMemo, useRef } from "react";
import { gameClock, animationDelta } from "@/farm/game/clock";
import { useFrame } from "@react-three/fiber";
import { OptionalAsset } from "./OptionalAsset";
import { groundedModel } from "./prop-geometry";
import { foothillGeometry } from "./natural-geometry";
import { Surface } from "./materials";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Spot = {
  file: string;
  position: [number, number, number];
  height: number;
  rotation?: number;
};

/** Optional local scans enrich the yard without blocking the playable scene. */
export const CORE_PROPS: Spot[] = [
  { file: "shrub_02", position: [-4.2, 0, 5.2], height: 1.15, rotation: 0.3 },
  { file: "shrub_03", position: [6.4, 0, 5.6], height: 0.9 },
  { file: "shrub_04", position: [9.2, 0, 4.8], height: 1.05, rotation: 1 },
  { file: "grass_medium_02", position: [-2, 0, 3.2], height: 0.4 },
  { file: "grass_medium_02", position: [4.5, 0, 2.4], height: 0.35, rotation: 1.4 },
  { file: "grass_bermuda_01", position: [1.5, 0, 4.2], height: 0.28 },
  { file: "fern_02", position: [-13, 0, -4], height: 0.7 },
  { file: "rock_07", position: [-8.5, 0, 6.4], height: 0.45, rotation: 0.6 },
  { file: "rock_09", position: [11, 0, 3.5], height: 0.4 },
  { file: "Barrel_01", position: [2.4, 0, 0.2], height: 0.85, rotation: 0.4 },
  { file: "wooden_crate_01", position: [3.1, 0, 0.7], height: 0.55 },
];

/** The rest of the yard, mounted after the first frame so the visit can start. */
export const EXTRA_PROPS: Spot[] = [
  { file: "shrub_01", position: [-6, 0, -6], height: 1.6 },
  { file: "tree_stump_01", position: [7.5, 0, -4], height: 0.55 },
  { file: "boulder_01", position: [16, 0, 2], height: 1.3, rotation: 0.8 },
  { file: "rock_moss_set_01", position: [-14, 0, 4], height: 0.7 },
  { file: "dandelion_01", position: [-1, 0, 5], height: 0.35 },
  { file: "celandine_01", position: [3, 0, 4.6], height: 0.3 },
  { file: "nettle_plant", position: [-7, 0, 4.5], height: 0.7 },
  { file: "grass_medium_01", position: [8, 0, -1], height: 0.55 },
  { file: "wooden_barrels_01", position: [3.6, 0, -0.6], height: 1.1 },
  { file: "wooden_crate_02", position: [2.6, 0, 1.1], height: 0.45 },
  { file: "wooden_bucket_01", position: [-10.4, 0, 0.8], height: 0.35 },
  { file: "wooden_bucket_02", position: [4.2, 0, 1.4], height: 0.4 },
  { file: "watering_can_metal_01", position: [-9.2, 0, 1.1], height: 0.4 },
  { file: "wooden_ladder", position: [3.4, 0, -1.6], height: 2.2, rotation: 0.15 },
  { file: "wooden_lantern_01", position: [-10.8, 0, -0.4], height: 0.55 },
  { file: "rusted_spade_01", position: [1.2, 0, 3.6], height: 1.1 },
  { file: "planter_box_01", position: [-11.5, 0, 1.2], height: 0.45 },
  { file: "planter_box_02", position: [5.5, 0, -2.5], height: 0.5 },
  { file: "painted_wooden_bench", position: [6.8, 0, 3.2], height: 0.85, rotation: 0.2 },
  { file: "wooden_picnic_table", position: [8.5, 0, 2.2], height: 0.8 },
  { file: "stone_fire_pit", position: [-2.2, 0, 3.4], height: 0.45 },
  { file: "propane_tank", position: [12, 0, -1], height: 1.1 },
  { file: "modular_wooden_pier", position: [-16.2, 0, 2.4], height: 0.6, rotation: 0.15 },
  { file: "wicker_basket_01", position: [-10, 0, 1.5], height: 0.35 },
  { file: "moss_01", position: [-9, 0, 5.5], height: 0.15 },
  { file: "fern_02", position: [14, 0, -3], height: 0.65, rotation: 1.7 },
];

function Prop({ spot }: { spot: Spot }) {
  const url = `/farm/models/${spot.file}.glb`;
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const root = groundedModel(scene,spot.height);
    root.position.set(...spot.position);
    root.rotation.y = spot.rotation ?? 0;
    return root;
  }, [scene, spot]);
  return <primitive object={object} dispose={null} />;
}

export function Scenery({ detail }: { detail: boolean }) {
  return (
    <group>
      {CORE_PROPS.map((spot, index) => (
        <OptionalAsset key={`core-${spot.file}-${index}`}><Prop spot={spot} /></OptionalAsset>
      ))}
      {detail
        ? EXTRA_PROPS.map((spot, index) => <OptionalAsset key={`extra-${spot.file}-${index}`}><Prop spot={spot} /></OptionalAsset>)
        : null}
    </group>
  );
}

export function Horizon() {
  const ground = useMemo(() => foothillGeometry(), []);
  return <mesh name="middle-atlas-foothills" geometry={ground} receiveShadow><meshStandardMaterial vertexColors roughness={1} metalness={0}/></mesh>;
}

export function MillWorks({ waterCollected = false }: {waterCollected?: boolean}) {
  return (
    <group>

      <Well waterCollected={waterCollected} />
      <Gate />
    </group>
  );
}

function MillWheel() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, frameDelta) => {
    const dt = animationDelta(frameDelta);
    if (ref.current) ref.current.rotation.x -= dt * 0.55;
  });
  return (
    <group position={[-14.2, 0.75, 2.2]}>
      <group ref={ref}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.7, 0.06, 8, 18]} />
          <meshStandardMaterial color="#6b5344" roughness={0.8} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
            <boxGeometry args={[1.35, 0.08, 0.22]} />
            <meshStandardMaterial color="#7d624e" roughness={0.75} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Well({waterCollected = false}:{waterCollected?:boolean}) {
  const bucketY = waterCollected ? 1.2 : .25;
  return <group name="stone-well-mechanism" position={[-12.5,0,3.4]}>
    <mesh position={[0,.36,0]} receiveShadow castShadow><cylinderGeometry args={[.72,.8,.72,24,1,true]}/><Surface name="rock" color="#a29881" repeat={[4,1]} metalness={0}/></mesh>
    <mesh position={[0,.36,0]}><cylinderGeometry args={[.5,.56,.68,24,1,true]}/><meshStandardMaterial color="#5e5a4b" side={THREE.BackSide} roughness={1}/></mesh>
    <mesh position={[0,.74,0]} rotation={[Math.PI/2,0,0]} castShadow><torusGeometry args={[.61,.115,6,28]}/><Surface name="rock" color="#b1a78f" repeat={[4,1]} metalness={0}/></mesh>
    <mesh position={[0,.12,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.61,24]}/><meshStandardMaterial color="#263f3e" roughness={.2} metalness={0}/></mesh>
    {[-.85,.85].map(x=><group key={x} position={[x,0,0]}>
      <mesh position={[0,1.05,0]} castShadow><boxGeometry args={[.12,2.1,.14]}/><Surface name="wood" color="#77684d" repeat={[.3,3]} metalness={0}/></mesh>
      <mesh position={[0,.05,0]}><boxGeometry args={[.3,.1,.34]}/><Surface name="rock" color="#aaa18c" metalness={0}/></mesh>
    </group>)}
    <mesh position={[0,1.85,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.09,.09,1.95,12]}/><Surface name="wood" color="#6e5f45" repeat={[1,2]} metalness={0}/></mesh>
    <mesh position={[.1,(1.85+bucketY+.295)/2,0]}><cylinderGeometry args={[.012,.012,1.85-bucketY-.295,6]}/><meshStandardMaterial color="#b8a786" roughness={1}/></mesh>
    <group name="well-bucket" position={[.1,bucketY,0]}>
      <mesh castShadow><cylinderGeometry args={[.16,.12,.27,12,1,true]}/><Surface name="wood" color="#958063" repeat={[1,1]} metalness={0}/></mesh>
      <mesh position={[0,.135,0]}><torusGeometry args={[.15,.012,6,16,Math.PI]}/><meshStandardMaterial color="#54584f" metalness={.5} roughness={.65}/></mesh>
    </group>
    <group position={[1.03,1.85,0]} rotation={[waterCollected ? .8 : 0,0,0]}>
      <mesh position={[0,-.18,0]}><boxGeometry args={[.045,.36,.045]}/><meshStandardMaterial color="#53564b" metalness={.5} roughness={.7}/></mesh>
      <mesh position={[.12,-.35,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.035,.035,.24,8]}/><Surface name="wood" color="#6d5a40" metalness={0}/></mesh>
    </group>
  </group>;
}

function Gate() {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  useFrame(() => {
    const swing = Math.sin(gameClock.seconds * 0.35) * 0.2;
    if (left.current) left.current.rotation.y = swing;
    if (right.current) right.current.rotation.y = -swing;
  });
  return (
    <group position={[1.2, 0, 8.5]}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.9, 0, 0]}>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.1, 1.4, 0.1]} />
            <meshStandardMaterial color="#6b5344" />
          </mesh>
          <group ref={side < 0 ? left : right}>
            <mesh position={[side * 0.42, 0.7, 0]}>
              <boxGeometry args={[0.78, 1.05, 0.06]} />
              <meshStandardMaterial color="#e4d2b0" roughness={0.7} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
