"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HARVEST_APPLES, pickedApples } from "@/farm/game/journey";
import type { Progress } from "@/farm/game/progress";
import { gameClock } from "@/farm/game/clock";
import { AppleFruit } from "./RealisticDetails";
import { Rod } from "./ObjectParts";

export function HarvestScene({ progress }: { progress: Progress }) {
  const picked = pickedApples(progress);
  const available =
    progress.completed.includes("garden") && !progress.completed.includes("orchard");
  return (
    <group name="orchard-harvest">
      {HARVEST_APPLES.map((apple, i) => (
        <group key={i} position={[apple.x, apple.y, apple.z]}>
          <Rod
            a={[0, 0, 0]}
            b={i === 0 ? [0, 0.25, -0.95] : i === 1 ? [0.95, 0.25, 0] : [0, 0.25, -0.95]}
            r={0.025}
            color="#746849"
          />
          {!picked.includes(i) && (
            <group name={`pickable-apple-${i}`}>
              <AppleFruit />
              {available && (
                <mesh position={[0, -apple.y + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.27, 0.31, 24]} />
                  <meshBasicMaterial
                    color="#c3a268"
                    transparent
                    opacity={0.65}
                    depthWrite={false}
                  />
                </mesh>
              )}
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

export function TeaSteam() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const object = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < 6; i++) {
      const t = (gameClock.seconds * 0.18 + i / 6) % 1;
      object.position.set(
        (i % 2 ? -0.24 : 0.24) + Math.sin(t * 5 + i) * 0.02,
        0.17 + t * 0.3,
        0.22 + Math.cos(i) * 0.02,
      );
      object.scale.setScalar(0.015 + Math.sin(t * Math.PI) * 0.02);
      object.updateMatrix();
      ref.current.setMatrixAt(i, object.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      name="shared-tea-steam"
      ref={ref}
      args={[undefined, undefined, 6]}
      position={[-4.6, 0.98, 19]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 4]} />
      <meshBasicMaterial color="#dfded0" transparent opacity={0.14} depthWrite={false} />
    </instancedMesh>
  );
}

export function SharedTableSetting() {
  return (
    <group name="harvest-table-setting" position={[-3, 0.967, 19]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 0.62]} />
        <meshStandardMaterial color="#b9aa81" roughness={1} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 2.2, 0.025, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.18, 0.025, 24]} />
            <meshStandardMaterial color="#d0c9b1" roughness={0.75} />
          </mesh>
          {[-1, 0, 1].map((i) => (
            <mesh
              key={i}
              position={[i * 0.08, 0.04, 0]}
              rotation={[0, i * 0.4, 0]}
              scale={[0.07, 0.025, 0.12]}
            >
              <sphereGeometry args={[1, 10, 6]} />
              <meshStandardMaterial color="#d2be85" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
