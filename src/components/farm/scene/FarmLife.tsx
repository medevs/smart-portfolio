"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gameClock } from "@/farm/game/clock";
import { Surface } from "./materials";

/** Small details share the paused/reduced-motion world clock, with no timers or downloads. */
export function FarmLife({ rain = false }: { rain?: boolean }) {
  const water = useRef<THREE.InstancedMesh>(null), bees = useRef<THREE.InstancedMesh>(null);
  const offsets = useMemo(() => Array.from({length:8}, (_,i) => i * 2.4), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (water.current) {
      for (let i = 0; i < 18; i++) {
        dummy.position.set((i % 3 - 1) * .14, 0, ((gameClock.seconds * .65 + i * .68) % 12.5) - 6.25);
        dummy.rotation.set(-Math.PI / 2, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
        water.current.setMatrixAt(i, dummy.matrix);
      }
      water.current.instanceMatrix.needsUpdate = true;
    }
    if (bees.current && !rain) {
      for (let i = 0; i < 8; i++) {
        const t = gameClock.seconds * 1.7 + offsets[i];
        dummy.position.set(Math.sin(t) * (.6 + i * .055), 1.5 + Math.sin(t * 1.8 + i) * .35, Math.cos(t * .8) * .75);
        dummy.rotation.set(0, 0, 0); dummy.scale.set(1, .65, .65); dummy.updateMatrix();
        bees.current.setMatrixAt(i, dummy.matrix);
      }
      bees.current.instanceMatrix.needsUpdate = true;
    }
  });
  return <group name="farm-life-details">
    <instancedMesh name="flowing-seguia" ref={water} args={[undefined, undefined, 18]} position={[-10.4,.116,9.5]} frustumCulled={false}>
      <planeGeometry args={[.045,.28]}/><meshBasicMaterial color="#c5ded6" transparent opacity={.36} depthWrite={false}/>
    </instancedMesh>
    <instancedMesh name="orchard-bees" ref={bees} args={[undefined, undefined, 8]} position={[24,0,15]} visible={!rain} frustumCulled={false}>
      <sphereGeometry args={[.032,6,4]}/><meshStandardMaterial color="#9a7b38" roughness={1}/>
    </instancedMesh>
    <group name="cedar-lookout-bench" position={[-20,0,-15.3]}>
      {[-.32,0,.32].map(z=><mesh key={z} position={[0,.63,z]} castShadow receiveShadow><boxGeometry args={[2.6,.1,.24]}/><Surface name="wood" color="#9c8661" repeat={[3,1]} metalness={0}/></mesh>)}
      {[-1,1].map(x=><mesh key={x} position={[x,.3,0]} castShadow><boxGeometry args={[.18,.6,.75]}/><Surface name="rock" color="#a2987d" metalness={0}/></mesh>)}
    </group>
    <group name="courtyard-tea-tray" position={[-4.6,1.08,19]}>
      <mesh><cylinderGeometry args={[.38,.38,.025,24]}/><meshStandardMaterial color="#b5a47a" metalness={.65} roughness={.36}/></mesh>
      <mesh position={[0,.17,0]} castShadow scale={[1,.85,1]}><sphereGeometry args={[.16,16,12]}/><meshStandardMaterial color="#b8bab0" metalness={.8} roughness={.25}/></mesh>
      <mesh position={[0,.31,0]}><coneGeometry args={[.1,.06,16]}/><meshStandardMaterial color="#b8bab0" metalness={.8} roughness={.25}/></mesh>
      <mesh position={[.18,.19,0]} rotation={[0,0,-.6]}><cylinderGeometry args={[.026,.05,.2,10]}/><meshStandardMaterial color="#b8bab0" metalness={.8} roughness={.25}/></mesh>
      <mesh position={[-.17,.18,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.11,.018,6,16]}/><meshStandardMaterial color="#b8bab0" metalness={.8} roughness={.25}/></mesh>
      {[-.22,.22].map(x=><mesh key={x} position={[x,.07,.2]}><cylinderGeometry args={[.045,.035,.12,10]}/><meshStandardMaterial color="#75938a" roughness={.3} metalness={.15}/></mesh>)}
    </group>
  </group>;
}
