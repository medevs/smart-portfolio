"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { Rod } from "./ObjectParts";

/** Dimpled shoulders and a restrained red/yellow blush replace a perfect sphere. */
export function appleFruitGeometry() {
  const g = new THREE.SphereGeometry(1, 28, 20),
    p = g.attributes.position,
    colors: number[] = [];
  const red = new THREE.Color("#9b4935"),
    gold = new THREE.Color("#bda05f");
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i),
      angle = Math.atan2(z, x),
      r = Math.hypot(x, z);
    const lobes = 1 + Math.cos(angle * 5) * 0.045 * Math.pow(Math.abs(y), 3);
    p.setXYZ(
      i,
      x * lobes,
      y * 0.93 - Math.sign(y) * Math.pow(Math.abs(y), 12) * 0.17,
      z * lobes * 0.96,
    );
    const blush = THREE.MathUtils.smoothstep(
      x * 0.65 + z * 0.4 + Math.sin(y * 8) * 0.08,
      -0.4,
      0.7,
    );
    const speckle = Math.sin(x * 149 + z * 73) * Math.sin(y * 113 - z * 97) > 0.91 ? 0.1 : 0;
    const color = gold
      .clone()
      .lerp(red, blush)
      .multiplyScalar(0.92 + 0.08 * r - speckle);
    colors.push(color.r, color.g, color.b);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
const APPLE_FRUIT = appleFruitGeometry();
export function AppleFruit({ size = 0.115 }: { size?: number }) {
  const leaf = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [0.03, 1.03, 0, 0.36, 1.25, -0.16, 0.82, 1.3, 0.04, 0.36, 1.12, 0.22],
        3,
      ),
    );
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group name="detailed-apple" scale={size}>
      <mesh geometry={APPLE_FRUIT} dispose={null} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.52} metalness={0} />
      </mesh>
      <Rod a={[0, 0.72, 0]} b={[0.1, 1.2, 0.04]} r={0.045} color="#66543d" />
      <mesh geometry={leaf}>
        <meshStandardMaterial color="#6f7849" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
