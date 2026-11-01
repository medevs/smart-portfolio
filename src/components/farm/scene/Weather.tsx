"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gameClock } from "@/farm/game/clock";
import { rainSegment } from "@/farm/game/weather";

/** One draw call. The shared clock freezes rain for pause, hidden tabs and reduced motion. */
export function Rain({ low }: { low: boolean }) {
  const mesh = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((low ? 120 : 420) * 6), 3).setUsage(THREE.DynamicDrawUsage));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 9, 0), 66);
    return g;
  }, [low]);
  useFrame(() => {
    const positions = mesh.current?.geometry.attributes.position;
    if (!positions) return;
    for (let i = 0; i < positions.count / 2; i++) {
      const [x, y, z, endX, endY, endZ] = rainSegment(i, gameClock.seconds);
      positions.setXYZ(i * 2, x, y, z);
      positions.setXYZ(i * 2 + 1, endX, endY, endZ);
    }
    positions.needsUpdate = true;
  });
  return <lineSegments ref={mesh} name="gentle-rain" geometry={geometry}>
    <lineBasicMaterial color="#c2d5dd" transparent opacity={.4} depthWrite={false} />
  </lineSegments>;
}
