"use client";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { OptionalAsset } from "./OptionalAsset";

export const MAKER_PORTRAIT = "/images/profile.jpeg";
/** Front-facing curved face, projected from the existing portfolio portrait, not a generated identity. */
export function makePortraitFace() {
  const geometry = new THREE.SphereGeometry(.155, 28, 20, 0, Math.PI, .32, 2.48);
  const position = geometry.attributes.position, uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    // Original square portrait: forehead through chin, between the two ears.
    uv.setXY(i, .458 + position.getX(i) / .155 * .153, .614 + position.getY(i) / .155 * .187);
  }
  return geometry;
}
function PortraitFace() {
  const original = useTexture(MAKER_PORTRAIT);
  const geometry = useMemo(() => makePortraitFace(), []);
  const texture = useMemo(() => { const copy = original.clone(); copy.colorSpace = THREE.SRGBColorSpace; return copy; }, [original]);
  useEffect(() => () => { texture.dispose(); geometry.dispose(); }, [texture, geometry]);
  return <mesh name="maker-portrait-face" geometry={geometry} position={[0, 1.43, .008]} scale={[.92, 1.1, .91]}>
    <meshStandardMaterial map={texture} roughness={.9} metalness={0} />
  </mesh>;
}
export function MakerHead() {
  return <group name="maker-head">
    <mesh position={[0,1.43,0]} scale={[.92,1.1,.9]} castShadow><sphereGeometry args={[.153,24,16]}/><meshStandardMaterial color="#bc8b6c" roughness={.95}/></mesh>
    <mesh position={[0,1.61,-.015]} scale={[1,.5,1]} castShadow><sphereGeometry args={[.16,18,12]}/><meshStandardMaterial color="#22211f" roughness={1}/></mesh>
    {Array.from({length:16},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*.13,1.58+(i%3)*.025,Math.cos(i*2.4)*.115]} castShadow><sphereGeometry args={[.046,7,6]}/><meshStandardMaterial color={i%2 ? "#252420" : "#302e29"} roughness={1}/></mesh>)}
    <OptionalAsset><PortraitFace /></OptionalAsset>
    {/* Thin round rims follow the glasses visible in the source photo. */}
    {[-.068,.068].map(x=><mesh key={x} position={[x,1.464,.146]}><torusGeometry args={[.056,.0028,5,24]}/><meshStandardMaterial color="#c5ba9f" metalness={.72} roughness={.3}/></mesh>)}
    <mesh position={[0,1.473,.149]}><boxGeometry args={[.027,.004,.004]}/><meshStandardMaterial color="#c5ba9f" metalness={.72} roughness={.3}/></mesh>
    {[-.142,.142].map(x=><mesh key={x} position={[x,1.427,0]} scale={[.35,.7,.7]}><sphereGeometry args={[.055,10,8]}/><meshStandardMaterial color="#b78468" roughness={1}/></mesh>)}
    <mesh position={[0,1.253,0]}><cylinderGeometry args={[.061,.07,.14,12]}/><meshStandardMaterial color="#bc8b6c" roughness={1}/></mesh>
  </group>;
}
