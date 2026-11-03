"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gameClock } from "@/farm/game/clock";
import { Timber, Rivets } from "./ObjectParts";

/** Small details share the paused/reduced-motion world clock, with no timers or downloads. */
export function FarmLife({ rain = false }: { rain?: boolean }) {
  const water = useRef<THREE.InstancedMesh>(null),
    bees = useRef<THREE.InstancedMesh>(null);
  const wings = useRef<THREE.InstancedMesh>(null),
    heads = useRef<THREE.InstancedMesh>(null);
  const offsets = useMemo(() => Array.from({ length: 8 }, (_, i) => i * 2.4), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (water.current) {
      for (let i = 0; i < 18; i++) {
        dummy.position.set(
          ((i % 3) - 1) * 0.14,
          0,
          ((gameClock.seconds * 0.65 + i * 0.68) % 12.5) - 6.25,
        );
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        water.current.setMatrixAt(i, dummy.matrix);
      }
      water.current.instanceMatrix.needsUpdate = true;
    }
    if (bees.current && !rain) {
      for (let i = 0; i < 8; i++) {
        const t = gameClock.seconds * 1.7 + offsets[i];
        dummy.position.set(
          Math.sin(t) * (0.6 + i * 0.055),
          1.5 + Math.sin(t * 1.8 + i) * 0.35,
          Math.cos(t * 0.8) * 0.75,
        );
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 0.65, 0.65);
        dummy.updateMatrix();
        bees.current.setMatrixAt(i, dummy.matrix);
        const x = dummy.position.x,
          y = dummy.position.y,
          z = dummy.position.z;
        dummy.position.set(x, y, z + 0.03);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        heads.current?.setMatrixAt(i, dummy.matrix);
        for (let side = 0; side < 2; side++) {
          dummy.position.set(x + (side ? 1 : -1) * 0.026, y + 0.018, z);
          dummy.scale.set(0.035, 0.01, 0.017);
          dummy.rotation.set(
            0,
            0,
            (side ? 1 : -1) * (0.3 + Math.sin(gameClock.seconds * 35 + i) * 0.65),
          );
          dummy.updateMatrix();
          wings.current?.setMatrixAt(i * 2 + side, dummy.matrix);
        }
      }
      bees.current.instanceMatrix.needsUpdate = true;
      if (heads.current) heads.current.instanceMatrix.needsUpdate = true;
      if (wings.current) wings.current.instanceMatrix.needsUpdate = true;
    }
  });
  return (
    <group name="farm-life-details">
      <instancedMesh
        name="flowing-seguia"
        ref={water}
        args={[undefined, undefined, 18]}
        position={[-10.4, 0.116, 9.5]}
        frustumCulled={false}
      >
        <planeGeometry args={[0.045, 0.28]} />
        <meshBasicMaterial color="#c5ded6" transparent opacity={0.36} depthWrite={false} />
      </instancedMesh>
      <instancedMesh
        name="orchard-bees"
        ref={bees}
        args={[undefined, undefined, 8]}
        position={[24, 0, 15]}
        visible={!rain}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.032, 6, 4]} />
        <meshStandardMaterial color="#9a7b38" roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={heads}
        args={[undefined, undefined, 8]}
        position={[24, 0, 15]}
        visible={!rain}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.015, 6, 4]} />
        <meshStandardMaterial color="#434b35" roughness={0.8} />
      </instancedMesh>
      <instancedMesh
        ref={wings}
        args={[undefined, undefined, 16]}
        position={[24, 0, 15]}
        visible={!rain}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 4]} />
        <meshStandardMaterial
          color="#c1cbb9"
          transparent
          opacity={0.55}
          depthWrite={false}
          roughness={0.6}
        />
      </instancedMesh>
      <group name="cedar-lookout-bench" position={[-20, 0, -15.3]}>
        {[-0.32, 0, 0.32].map((z) => (
          <Timber key={z} position={[0, 0.63, z]} size={[2.6, 0.1, 0.24]} color="#9c9475" />
        ))}
        {[-1, 1].map((x) => (
          <group key={x}>
            <Timber position={[x, 0.3, 0]} size={[0.14, 0.6, 0.75]} />
            <Timber position={[x, 0.5, 0]} size={[0.18, 0.12, 0.88]} />
          </group>
        ))}
        <Timber position={[0, 0.25, 0]} size={[2.2, 0.12, 0.12]} />
        <Rivets
          points={[-1, 1].flatMap((x) =>
            [-0.32, 0, 0.32].map((z) => [x, 0.688, z] as [number, number, number]),
          )}
        />
      </group>
      <group name="courtyard-tea-tray" position={[-4.6, 0.98, 19]}>
        <TeaTray />
      </group>
    </group>
  );
}

export function TeaTray() {
  const vessel = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.09, 0),
          new THREE.Vector2(0.15, 0.04),
          new THREE.Vector2(0.17, 0.13),
          new THREE.Vector2(0.13, 0.22),
          new THREE.Vector2(0.09, 0.25),
        ],
        24,
      ),
    [],
  );
  const spout = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.12, 0.08, 0),
          new THREE.Vector3(0.23, 0.12, 0),
          new THREE.Vector3(0.28, 0.26, 0),
        ]),
        10,
        0.022,
        8,
        false,
      ),
    [],
  );
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.022, 32]} />
        <meshStandardMaterial color="#a49b79" metalness={0.65} roughness={0.48} />
      </mesh>
      {[0.37, 0.39].map((r) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
          <torusGeometry args={[r, 0.007, 6, 32]} />
          <meshStandardMaterial color="#8f9179" metalness={0.65} roughness={0.5} />
        </mesh>
      ))}
      <group position={[0, 0.026, 0]}>
        <mesh geometry={vessel} castShadow>
          <meshStandardMaterial
            color="#b0b4a3"
            metalness={0.75}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={spout} castShadow>
          <meshStandardMaterial color="#a7ad9b" metalness={0.75} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.255, 0]}>
          <coneGeometry args={[0.1, 0.045, 24]} />
          <meshStandardMaterial color="#b0b4a3" metalness={0.75} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.295, 0]}>
          <sphereGeometry args={[0.018, 10, 8]} />
          <meshStandardMaterial color="#636e5d" roughness={0.75} />
        </mesh>
        <mesh position={[-0.17, 0.13, 0]} scale={[0.8, 1.25, 1]}>
          <torusGeometry args={[0.095, 0.014, 7, 24, Math.PI * 1.6]} />
          <meshStandardMaterial color="#a7ad9b" metalness={0.75} roughness={0.4} />
        </mesh>
      </group>
      {[-0.24, 0.24].map((x) => (
        <group key={x} position={[x, 0.02, 0.22]}>
          <mesh position={[0, 0.065, 0]}>
            <cylinderGeometry args={[0.045, 0.034, 0.13, 16, 1, true]} />
            <meshStandardMaterial
              color="#a2b7a3"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <cylinderGeometry args={[0.04, 0.035, 0.07, 16]} />
            <meshStandardMaterial color="#8b7143" transparent opacity={0.75} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
