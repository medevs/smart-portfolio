"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FarmData } from "@/farm/types";
import type { Placed } from "@/farm/loadFarm";
import { plotPosition } from "@/farm/world";
import { GROUND_HALF } from "@/farm/game/collision";
import { landNoise } from "./natural-geometry";
import { Surface } from "./materials";
import { Hay } from "./FarmObjects";
import { gameClock } from "@/farm/game/clock";

export function Ground() {
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(GROUND_HALF * 2, GROUND_HALF * 2, 70, 70);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors: number[] = [];
    const dry = new THREE.Color("#b3ac8b"),
      growth = new THREE.Color("#82906b");
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const roll = Math.sin(x * 0.12) * 0.35 + Math.cos(z * 0.09) * 0.22;
      const dist = Math.hypot(x, z);
      const flat = THREE.MathUtils.smoothstep(dist, 38, 60);
      pos.setY(i, roll * flat - 0.02);
      const color = dry
        .clone()
        .lerp(growth, landNoise(x * 0.13, z * 0.13))
        .multiplyScalar(0.9 + landNoise(x * 0.7, z * 0.7) * 0.16);
      colors.push(color.r, color.g, color.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    g.setAttribute("uv2", g.getAttribute("uv"));
    return g;
  }, []);
  return (
    <mesh geometry={geom} receiveShadow>
      <Surface
        name="grass"
        color="#ffffff"
        vertexColors
        repeat={[28, 28]}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

export function HayBales() {
  return (
    <group>
      {[
        [3.4, 1.1],
        [4.3, 1.7],
        [2.6, 2.2],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} scale={0.7}>
          <Hay />
        </group>
      ))}
    </group>
  );
}

export function Lane() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0.08]} position={[0.4, 0.025, 2.6]} receiveShadow>
        <planeGeometry args={[2.6, 18]} />
        <Surface name="dirt" repeat={[1.4, 8]} roughness={0.92} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh
          key={x}
          rotation={[-Math.PI / 2, 0, 0.08]}
          position={[0.4 + x, 0.03, 2.6]}
          receiveShadow
        >
          <planeGeometry args={[0.28, 16]} />
          <meshStandardMaterial color="#5c4632" roughness={1} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

export function Rocks() {
  const spots: [number, number, number, number][] = [
    [-9.2, 0.12, -4.5, 0.7],
    [-6.4, 0.08, 3.2, 0.35],
    [8.8, 0.1, 5.4, 0.55],
    [11.2, 0.14, -2.2, 0.8],
    [3.4, 0.06, -7.5, 0.4],
    [-3.2, 0.08, 7.2, 0.28],
  ];
  return (
    <group>
      {spots.map(([x, y, z, s], i) => (
        <mesh
          key={i}
          position={[x, y, z]}
          rotation={[0.2, i, 0.4]}
          scale={s}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <Surface name="rock" repeat={[1, 1]} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function Wildflowers({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const color = useMemo(() => new THREE.Color(), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 14;
      dummy.position.set(Math.cos(angle) * radius, 0.08, Math.sin(angle) * radius);
      dummy.scale.setScalar(0.35 + Math.random() * 0.5);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setHSL(Math.random() > 0.5 ? 0.95 : 0.12, 0.55, 0.62);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [color, count]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 6, 5]} />
      <meshStandardMaterial roughness={0.7} />
    </instancedMesh>
  );
}

export function Grass({
  placed,
  grid,
  count,
  wind,
}: {
  placed: Placed[];
  grid: FarmData["grid"];
  count: number;
  wind: number;
}) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -0.08, 0, 0, 0.08, 0, 0, 0.02, 0.42, 0.02, -0.02, 0.42, -0.02,
    ]);
    const normals = new Float32Array([0, 0.3, 1, 0, 0.3, 1, 0, 0.4, 1, 0, 0.4, 1]);
    const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    return g;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  const material = useMemo(() => {
    const mat = new THREE.MeshLambertMaterial({ color: "#7e8c4c", side: THREE.DoubleSide });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uWind = { value: 1 };
      shader.vertexShader =
        "attribute float aPhase;\nuniform float uTime;\nuniform float uWind;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float tip = uv.y;
           transformed.x += sin(uTime * 1.5 + aPhase) * tip * 0.12 * uWind;
           transformed.z += cos(uTime * 1.2 + aPhase * 0.7) * tip * 0.08 * uWind;`,
        );
      mat.userData.shader = shader;
    };
    return mat;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const phases = new Float32Array(count);
    let n = 0;
    let guard = 0;
    while (n < count && guard < count * 12) {
      guard++;
      const x = (Math.random() - 0.5) * 48;
      const z = (Math.random() - 0.5) * 48;
      if (Math.hypot(x, z) > 23) continue;
      let blocked = false;
      for (const entry of placed) {
        const [px, , pz] = plotPosition(entry.plot, grid);
        const r = 0.7 + (entry.plot.cols ?? 1) * 0.55;
        if ((x - px) ** 2 + (z - pz) ** 2 < r * r) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
      dummy.position.set(x, 0, z);
      dummy.rotation.y = Math.random() * Math.PI;
      const s = 0.55 + Math.random() * 0.7;
      dummy.scale.set(s, 0.28 + Math.random() * 0.38, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(n, dummy.matrix);
      phases[n] = Math.random() * Math.PI * 2;
      const tint = new THREE.Color().setHSL(
        0.2 + Math.random() * 0.06,
        0.32,
        0.32 + Math.random() * 0.13,
      );
      mesh.setColorAt(n, tint);
      n++;
    }
    mesh.count = n;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
  }, [count, grid, placed]);

  /* eslint-disable react-hooks/immutability -- Three owns these mutable GPU uniforms. */
  useFrame(() => {
    const shader = (ref.current?.material as THREE.Material | undefined)?.userData.shader as
      { uniforms: { uTime: { value: number }; uWind: { value: number } } } | undefined;
    // Three owns this GPU uniform; useFrame updates it without React rerenders.
    if (shader) {
      shader.uniforms.uTime.value = gameClock.seconds;
      shader.uniforms.uWind.value = wind;
    }
  });

  /* eslint-enable react-hooks/immutability */

  return <instancedMesh ref={ref} args={[geom, material, count]} frustumCulled={false} />;
}

export function Clouds({ night }: { night: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grd = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    grd.addColorStop(0, "rgba(255,255,255,0.95)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useFrame(() => {
    if (ref.current) ref.current.position.x = Math.sin(gameClock.seconds * 0.05) * 1.5;
  });
  if (!tex) return null;
  const puffs = [
    [-6, 9, -8],
    [4, 10, -10],
    [10, 8.5, -4],
  ];
  return (
    <group ref={ref}>
      {puffs.map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          {[0, 1, 2].map((k) => (
            <sprite key={k} position={[(k - 1) * 1.4, k === 1 ? 0.4 : 0, 0]} scale={[3.2, 2.2, 1]}>
              <spriteMaterial
                map={tex}
                transparent
                depthWrite={false}
                color={night ? "#9aa4c8" : "#f2f0e7"}
                opacity={night ? 0.35 : 0.9}
              />
            </sprite>
          ))}
        </group>
      ))}
    </group>
  );
}

export function Birds() {
  const ref = useRef<THREE.Group>(null),
    wings = useRef<(THREE.Group | null)[]>([]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0, 0, 0.38, 0, 0.1, 0.22, 0, -0.12], 3),
    );
    g.computeVertexNormals();
    return g;
  }, []);
  useFrame(() => {
    const t = gameClock.seconds;
    if (ref.current) {
      ref.current.position.set(
        Math.sin(t * 0.25) * 8,
        7.5 + Math.sin(t * 0.8) * 0.2,
        Math.cos(t * 0.25) * 8 - 2,
      );
      ref.current.rotation.y = t * 0.25;
    }
    wings.current.forEach((wing, i) => {
      if (wing) wing.rotation.z = Math.sin(t * 5 + i * 0.7) * 0.4 * (i % 2 ? 1 : -1);
    });
  });
  return (
    <group ref={ref}>
      {[0, 1.2, -1.1].map((x, i) => (
        <group key={i} position={[x, i * 0.2, i * 0.4]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.025, 0.15, 3, 6]} />
            <meshStandardMaterial color="#4b5145" roughness={1} />
          </mesh>
          {[-1, 1].map((side, j) => (
            <group
              key={side}
              ref={(node) => {
                wings.current[i * 2 + j] = node;
              }}
              scale={[side, 1, 1]}
            >
              <mesh geometry={geometry}>
                <meshStandardMaterial color="#4c5548" roughness={1} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
