"use client";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { OptionalAsset } from "./OptionalAsset";

export const MAKER_PORTRAIT = "/images/profile.jpeg";
/** Front-facing curved face, projected from the existing portfolio portrait, not a generated identity. */
export function makePortraitFace() {
  const geometry = new THREE.SphereGeometry(0.155, 28, 20, 0, Math.PI, 0.32, 2.48);
  const position = geometry.attributes.position,
    uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    // Original square portrait: forehead through chin, between the two ears.
    uv.setXY(
      i,
      0.458 + (position.getX(i) / 0.155) * 0.153,
      0.614 + (position.getY(i) / 0.155) * 0.187,
    );
  }
  return geometry;
}
function PortraitFace() {
  const original = useTexture(MAKER_PORTRAIT);
  const geometry = useMemo(() => makePortraitFace(), []);
  const texture = useMemo(() => {
    const copy = original.clone();
    copy.colorSpace = THREE.SRGBColorSpace;
    return copy;
  }, [original]);
  useEffect(
    () => () => {
      texture.dispose();
      geometry.dispose();
    },
    [texture, geometry],
  );
  return (
    <mesh
      name="maker-portrait-face"
      geometry={geometry}
      position={[0, 1.43, 0.008]}
      scale={[0.92, 1.1, 0.91]}
    >
      <meshStandardMaterial map={texture} roughness={0.9} metalness={0} />
    </mesh>
  );
}
export function MakerHead() {
  return (
    <group name="maker-head">
      <mesh position={[0, 1.43, 0]} scale={[0.92, 1.1, 0.9]} castShadow>
        <sphereGeometry args={[0.153, 24, 16]} />
        <meshStandardMaterial color="#bc8b6c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.61, -0.015]} scale={[1, 0.5, 1]} castShadow>
        <sphereGeometry args={[0.16, 18, 12]} />
        <meshStandardMaterial color="#22211f" roughness={1} />
      </mesh>
      {Array.from({ length: 16 }, (_, i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 2.4) * 0.13, 1.58 + (i % 3) * 0.025, Math.cos(i * 2.4) * 0.115]}
          castShadow
        >
          <sphereGeometry args={[0.046, 7, 6]} />
          <meshStandardMaterial color={i % 2 ? "#252420" : "#302e29"} roughness={1} />
        </mesh>
      ))}
      <OptionalAsset>
        <PortraitFace />
      </OptionalAsset>
      {/* Thin round rims follow the glasses visible in the source photo. */}
      {[-0.068, 0.068].map((x) => (
        <mesh key={x} position={[x, 1.464, 0.146]}>
          <torusGeometry args={[0.056, 0.0028, 5, 24]} />
          <meshStandardMaterial color="#c5ba9f" metalness={0.72} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 1.473, 0.149]}>
        <boxGeometry args={[0.027, 0.004, 0.004]} />
        <meshStandardMaterial color="#c5ba9f" metalness={0.72} roughness={0.3} />
      </mesh>
      {[-0.142, 0.142].map((x) => (
        <mesh key={x} position={[x, 1.427, 0]} scale={[0.35, 0.7, 0.7]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color="#b78468" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 1.253, 0]}>
        <cylinderGeometry args={[0.061, 0.07, 0.14, 12]} />
        <meshStandardMaterial color="#bc8b6c" roughness={1} />
      </mesh>
    </group>
  );
}
