"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { agedMetalGeometry, paintRoughness } from "./surface-geometry";
import { Surface } from "./materials";
export type V3 = [number, number, number];
export function Timber({
  position = [0, 0, 0],
  size,
  rotation = [0, 0, 0],
  color = "#817159",
}: {
  position?: V3;
  size: V3;
  rotation?: V3;
  color?: string;
}) {
  return (
    <RoundedBox
      args={size}
      position={position}
      rotation={rotation}
      radius={Math.min(0.018, ...size.map((n) => n / 5))}
      smoothness={1}
      castShadow
      receiveShadow
    >
      <Surface
        name="wood"
        color={color}
        repeat={[Math.max(0.2, size[0] * 1.5), Math.max(0.3, size[1] * 2)]}
        metalness={0}
      />
    </RoundedBox>
  );
}
export function Metal({
  position = [0, 0, 0],
  size,
  rotation = [0, 0, 0],
  color = "#60675e",
}: {
  position?: V3;
  size: V3;
  rotation?: V3;
  color?: string;
}) {
  const [x, y, z] = size;
  const geometry = useMemo(() => agedMetalGeometry([x, y, z], color), [x, y, z, color]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      name="weathered-metal"
      geometry={geometry}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        vertexColors
        metalness={0.15}
        roughness={0.9}
        roughnessMap={paintRoughness}
        bumpMap={paintRoughness}
        bumpScale={0.0015}
      />
    </mesh>
  );
}
export function Rod({
  a,
  b,
  r = 0.025,
  color = "#687066",
  metal = false,
}: {
  a: V3;
  b: V3;
  r?: number;
  color?: string;
  metal?: boolean;
}) {
  const start = new THREE.Vector3(...a),
    end = new THREE.Vector3(...b),
    length = start.distanceTo(end);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    end.sub(start).normalize(),
  );
  return (
    <mesh
      position={start.add(new THREE.Vector3(...b)).multiplyScalar(0.5)}
      quaternion={q}
      castShadow
    >
      <cylinderGeometry args={[r, r, length, 8]} />
      <meshStandardMaterial
        color={color}
        metalness={metal ? 0.55 : 0}
        roughness={metal ? 0.6 : 1}
      />
    </mesh>
  );
}
export function Rivets({ points, r = 0.012 }: { points: V3[]; r?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new THREE.Object3D();
    points.forEach((p, i) => {
      o.position.set(...p);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [points]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[r, 6, 4]} />
      <meshStandardMaterial color="#545a50" metalness={0.65} roughness={0.65} />
    </instancedMesh>
  );
}
export function Ellipsoid({
  position = [0, 0, 0],
  scale,
  color,
  roughness = 0.92,
}: {
  position?: V3;
  scale: V3;
  color: string;
  roughness?: number;
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
    </mesh>
  );
}
