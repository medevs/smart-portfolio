"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gameClock } from "@/farm/game/clock";
import { Surface } from "./materials";

/** Small details share the paused/reduced-motion world clock, with no timers or downloads. */
export function FarmLife() {
  const water = useRef<THREE.Group>(null), bees = useRef<THREE.Group>(null);
  const offsets = useMemo(() => Array.from({length:8}, (_,i) => i * 2.4), []);
  useFrame(() => {
    if (water.current) water.current.children.forEach((mesh,i) => { mesh.position.z = ((gameClock.seconds * .65 + i * .68) % 12.5) - 6.25; });
    if (bees.current) bees.current.children.forEach((mesh,i) => {
      const t = gameClock.seconds * 1.7 + offsets[i];
      mesh.position.set(Math.sin(t)*(.6+i*.055), 1.5+Math.sin(t*1.8+i)*.35, Math.cos(t*.8)*.75);
    });
  });
  return <group name="farm-life-details">
    <group name="flowing-seguia" ref={water} position={[-10.4,.116,9.5]}>{Array.from({length:18},(_,i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[(i%3-1)*.14,0,i*.68-6.25]}><planeGeometry args={[.045,.28]}/><meshBasicMaterial color="#c5ded6" transparent opacity={.36} depthWrite={false}/></mesh>)}</group>
    <group name="orchard-bees" ref={bees} position={[24,.0,15]}>{offsets.map((phase,i)=><mesh key={phase} position={[Math.sin(phase),1.5,Math.cos(phase)]} scale={[1,.65,.65]}><sphereGeometry args={[.032,6,4]}/><meshStandardMaterial color={i%2 ? "#b08c42" : "#4b4937"} roughness={1}/></mesh>)}</group>
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
