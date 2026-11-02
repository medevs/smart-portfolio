"use client";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { groundedModel } from "./prop-geometry";

/** Existing local CC0 scans; callers isolate loading and retain a complete fallback. */
export function ScannedProp({file,height}:{file:"wicker_basket_01"|"watering_can_metal_01";height:number}) {
  const {scene}=useGLTF(`/farm/models/${file}.glb`);
  const object=useMemo(()=>groundedModel(scene,height),[scene,height]);
  return <primitive object={object} dispose={null}/>;
}
