"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Spot = {
  file: string;
  position: [number, number, number];
  height: number;
  rotation?: number;
};

/** Models that have to be in before the loader finishes. */
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

const ready = new Set<string>();

function Prop({ spot }: { spot: Spot }) {
  const url = `/farm/models/${spot.file}.glb`;
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const root = scene.clone(true);
    root.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = spot.height / Math.max(size.y, 1e-4);
    root.scale.setScalar(scale);
    root.position.set(spot.position[0], -box.min.y * scale, spot.position[2]);
    root.rotation.y = spot.rotation ?? 0;
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return root;
  }, [scene, spot]);
  ready.add(url);
  return <primitive object={object} />;
}

export function Scenery({ detail }: { detail: boolean }) {
  return (
    <group>
      {CORE_PROPS.map((spot, index) => (
        <Prop key={`core-${spot.file}-${index}`} spot={spot} />
      ))}
      {detail
        ? EXTRA_PROPS.map((spot, index) => <Prop key={`extra-${spot.file}-${index}`} spot={spot} />)
        : null}
    </group>
  );
}

export function Horizon() {
  const hills = [
    [-28, -18, 10, "#6ea24a"],
    [8, -24, 14, "#7eae56"],
    [32, -16, 11, "#628f42"],
    [-40, 4, 8, "#87b45c"],
    [42, 8, 9, "#6d9848"],
  ] as const;
  return (
    <group>
      {hills.map(([x, z, r, color], i) => (
        <mesh key={i} position={[x, -r * 0.55, z]} receiveShadow>
          <sphereGeometry args={[r, 24, 16]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0.04]} position={[1.2, 0.03, 16]} receiveShadow>
        <planeGeometry args={[3.2, 28]} />
        <meshStandardMaterial color="#8b6844" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[-22, 0.02, 2]} receiveShadow>
        <planeGeometry args={[4.5, 36]} />
        <meshStandardMaterial color="#2f6f86" metalness={0.45} roughness={0.18} />
      </mesh>
      {[-6, 0, 6, 12, 18].map((z) => (
        <group key={z} position={[4.2, 0, z]}>
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 4.4, 6]} />
            <meshStandardMaterial color="#4d555c" metalness={0.4} roughness={0.55} />
          </mesh>
          <mesh position={[1.2, 4.2, 0]}>
            <boxGeometry args={[2.6, 0.03, 0.03]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>
      ))}
      <group position={[26, 0, -8]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[i * 2.2, 1.1 + (i % 2) * 0.4, (i % 2) * 1.5]}>
            <boxGeometry args={[1.6, 2 + (i % 3), 1.4]} />
            <meshStandardMaterial color={i % 2 ? "#c4b6a2" : "#8d6b58"} roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function MillWorks() {
  return (
    <group>

      <Well />
      <Gate />
    </group>
  );
}

function MillWheel() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
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

function Well() {
  const crank = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (crank.current) crank.current.rotation.x += dt * 0.9;
  });
  return (
    <group position={[-12.5, 0, 3.4]}>
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[0.7, 0.78, 0.7, 12]} />
        <meshStandardMaterial color="#9a9186" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.16, 12]} />
        <meshStandardMaterial color="#1d4e5c" roughness={0.25} metalness={0.15} />
      </mesh>
      <group ref={crank} position={[0.62, 1.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.46, 8]} />
          <meshStandardMaterial color="#6b5344" roughness={0.6} />
        </mesh>
        <mesh position={[0.2, 0.12, 0]}>
          <boxGeometry args={[0.05, 0.26, 0.05]} />
          <meshStandardMaterial color="#5c4636" />
        </mesh>
      </group>
    </group>
  );
}

function Gate() {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const swing = Math.sin(clock.elapsedTime * 0.35) * 0.2;
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
