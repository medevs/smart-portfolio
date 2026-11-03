"use client";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { randomSeed } from "./natural-geometry";
import { Surface } from "./materials";

/** Staggered stone faces share one draw. Keep relief within five centimetres. */
export function Masonry({
  width,
  depth,
  height,
  position = [0, 0, 0],
}: {
  width: number;
  depth: number;
  height: number;
  position?: [number, number, number];
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const rows = Math.max(1, Math.ceil(height / 0.27));
  const count = rows * (Math.ceil(width / 0.48) * 2 + Math.ceil(depth / 0.48) * 2);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const random = randomSeed(Math.round(width * 100 + depth * 10)),
      object = new THREE.Object3D(),
      color = new THREE.Color();
    let index = 0;
    for (let row = 0; row < rows; row++)
      for (let face = 0; face < 4; face++) {
        const span = face < 2 ? width : depth,
          pieces = Math.ceil(span / 0.48),
          unit = span / pieces;
        for (let i = 0; i < pieces; i++) {
          const along = -span / 2 + (i + 0.5) * unit + (row % 2 ? unit * 0.13 : -unit * 0.13);
          object.position.set(
            face < 2 ? along : face === 2 ? -width / 2 : width / 2,
            ((row + 0.5) * height) / rows,
            face < 2 ? (face === 0 ? -depth / 2 : depth / 2) : along,
          );
          object.scale.set(
            face < 2 ? unit * 0.95 : 0.085,
            (height / rows) * (0.82 + random() * 0.12),
            face < 2 ? 0.085 : unit * 0.95,
          );
          object.rotation.set(0, 0, (random() - 0.5) * 0.035);
          object.updateMatrix();
          mesh.current.setMatrixAt(index, object.matrix);
          color.setHSL(0.105 + random() * 0.025, 0.1 + random() * 0.1, 0.68 + random() * 0.14);
          mesh.current.setColorAt(index++, color);
        }
      }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [width, depth, height, rows]);
  return (
    <instancedMesh
      name="limestone-courses"
      ref={mesh}
      position={position}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <Surface name="rock" color="#b4aa94" repeat={[0.8, 0.5]} metalness={0} />
    </instancedMesh>
  );
}
