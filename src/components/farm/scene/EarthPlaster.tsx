"use client";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export const earthFunctions = `
varying vec3 vEarthPosition;
float earthHash(vec3 p) { vec3 q=fract(p*vec3(0.113,0.173,0.197)); return fract(dot(q,q.yzx+17.13)*31.71); }
float earthNoise(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(earthHash(i),earthHash(i+vec3(1,0,0)),f.x),mix(earthHash(i+vec3(0,1,0)),earthHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(earthHash(i+vec3(0,0,1)),earthHash(i+vec3(1,0,1)),f.x),mix(earthHash(i+vec3(0,1,1)),earthHash(i+vec3(1,1,1)),f.x),f.y),f.z);
}`;
export const earthColor = `
float earthPatch=earthNoise(vEarthPosition*2.1)*0.65+earthNoise(vEarthPosition*14.0)*0.35;
float earthDamp=1.0-smoothstep(0.15,1.1,vEarthPosition.y);
diffuseColor.rgb *= (0.89+earthPatch*0.16)*(1.0-earthDamp*0.12);`;
export const earthNormal = `
float earthHeight=earthNoise(vEarthPosition*28.0)*0.006+earthNoise(vEarthPosition*7.0)*0.012;
vec3 earthDx=dFdx(-vViewPosition), earthDy=dFdy(-vViewPosition);
vec3 earthR1=cross(earthDy,normal), earthR2=cross(normal,earthDx);
float earthDet=dot(earthDx,earthR1);
if(abs(earthDet)>0.00000001) normal=normalize(abs(earthDet)*normal-sign(earthDet)*(dFdx(earthHeight)*earthR1+dFdy(earthHeight)*earthR2));`;

/** Shared factory keeps the component and full Three shader regression on the same hook. */
export function createEarthMaterial(color: string) {
  const mat = new THREE.MeshStandardMaterial({ color, metalness: 0, roughness: 0.97 });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader =
      "varying vec3 vEarthPosition;\n" +
      shader.vertexShader.replace(
        "#include <project_vertex>",
        "vEarthPosition=(modelMatrix*vec4(transformed,1.0)).xyz;\n#include <project_vertex>",
      );
    shader.fragmentShader =
      earthFunctions +
      "\n" +
      shader.fragmentShader
        .replace("#include <color_fragment>", "#include <color_fragment>\n" + earthColor)
        .replace(
          "#include <normal_fragment_maps>",
          "#include <normal_fragment_maps>\n" + earthNormal,
        );
  };
  mat.customProgramCacheKey = () => "atlas-earth-plaster-v2";
  return mat;
}

/** Fine mineral relief and restrained damp staining, in stable world metres. */
export function EarthPlaster({ color }: { color: string }) {
  const material = useMemo(() => createEarthMaterial(color), [color]);
  useEffect(() => () => material.dispose(), [material]);
  return <primitive object={material} attach="material" />;
}
