"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const FILES = {
  grass: ["grass_diff", "grass_nor", "grass_arm"],
  dirt: ["dirt_diff", "dirt_nor", "dirt_arm"],
  wood: ["wood_diff", "wood_nor", "wood_arm"],
  roof: ["roof_diff", "roof_nor", "roof_arm"],
  brick: ["brick_diff", "brick_nor", "brick_arm"],
  rock: ["rock_diff", "rock_nor", "rock_arm"],
} as const;

export type SurfaceName = keyof typeof FILES;

type Set = { diff: THREE.Texture; nor: THREE.Texture; arm: THREE.Texture };

const Ctx = createContext<Record<SurfaceName, Set> | null>(null);

const URLS = (Object.keys(FILES) as SurfaceName[]).flatMap((name) =>
  FILES[name].map((file) => `/farm/tex/${file}.webp`)
);

/** Loads the CC0 surface set once. Suspends until every map is in. */
export function Textures({ children }: { children: ReactNode }) {
  const loaded = useTexture(URLS);
  const lib = useMemo(() => {
    const out = {} as Record<SurfaceName, Set>;
    let index = 0;
    for (const name of Object.keys(FILES) as SurfaceName[]) {
      const diff = loaded[index++];
      const nor = loaded[index++];
      const arm = loaded[index++];
      for (const tex of [diff, nor, arm]) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 8;
      }
      diff.colorSpace = THREE.SRGBColorSpace;
      nor.colorSpace = THREE.NoColorSpace;
      arm.colorSpace = THREE.NoColorSpace;
      out[name] = { diff, nor, arm };
    }
    return out;
  }, [loaded]);
  return <Ctx.Provider value={lib}>{children}</Ctx.Provider>;
}

export function Surface({
  name,
  color = "#ffffff",
  repeat = [1, 1],
  golden = false,
  roughness = 1,
  metalness = 0.04,
}: {
  name?: SurfaceName;
  color?: string;
  repeat?: [number, number];
  golden?: boolean;
  roughness?: number;
  metalness?: number;
}) {
  const lib = useContext(Ctx);
  const rx = repeat[0];
  const ry = repeat[1];
  const material = useMemo(() => {
    if (golden) {
      return new THREE.MeshStandardMaterial({
        color: "#e7c56b",
        metalness: 1,
        roughness: 0.22,
        emissive: "#b8862a",
        emissiveIntensity: 0.45,
        envMapIntensity: 1.2,
      });
    }
    const set = name && lib ? lib[name] : null;
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      envMapIntensity: 1,
    });
    if (!set) return mat;
    mat.map = set.diff;
    mat.normalMap = set.nor;
    mat.roughnessMap = set.arm;
    mat.metalnessMap = set.arm;
    mat.normalScale = new THREE.Vector2(0.85, 0.85);
    const rep = new THREE.Vector2(rx, ry);
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uRepeat = { value: rep };
      shader.vertexShader =
        "uniform vec2 uRepeat;\n" +
        shader.vertexShader.replace(
          "#include <uv_vertex>",
          `#include <uv_vertex>
           #ifdef USE_MAP
             vMapUv *= uRepeat;
           #endif
           #ifdef USE_NORMALMAP
             vNormalMapUv *= uRepeat;
           #endif
           #ifdef USE_ROUGHNESSMAP
             vRoughnessMapUv *= uRepeat;
           #endif
           #ifdef USE_METALNESSMAP
             vMetalnessMapUv *= uRepeat;
           #endif`
        );
    };
    return mat;
  }, [color, golden, lib, metalness, name, roughness, rx, ry]);
  return <primitive object={material} attach="material" />;
}
