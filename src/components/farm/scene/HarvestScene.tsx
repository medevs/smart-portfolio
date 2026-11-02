"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HARVEST_APPLES, pickedApples } from "@/farm/game/journey";
import type { Progress } from "@/farm/game/progress";
import { gameClock } from "@/farm/game/clock";
import { Rod } from "./ObjectParts";

export function HarvestScene({progress}:{progress:Progress}) {
  const picked = pickedApples(progress);
  const available = progress.completed.includes("garden") && !progress.completed.includes("orchard");
  return <group name="orchard-harvest">
    {HARVEST_APPLES.map((apple,i)=><group key={i} position={[apple.x,apple.y,apple.z]}>
      <Rod a={[0,0,0]} b={i===0?[0,.25,-.95]:i===1?[.95,.25,0]:[0,.25,-.95]} r={.025} color="#746849"/>
      {!picked.includes(i) && <group name={`pickable-apple-${i}`}>
        <mesh scale={[1,.93,1]} castShadow><sphereGeometry args={[.115,14,10]}/><meshStandardMaterial color="#ba6245" roughness={.68}/></mesh>
        <Rod a={[0,.08,0]} b={[.015,.17,0]} r={.009} color="#655c40"/>
        {available && <mesh position={[0,-apple.y+.1,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.27,.31,24]}/><meshBasicMaterial color="#c3a268" transparent opacity={.65} depthWrite={false}/></mesh>}
      </group>}
    </group>)}
  </group>;
}

export function TeaSteam() {
  const ref=useRef<THREE.InstancedMesh>(null);
  const object=useMemo(()=>new THREE.Object3D(),[]);
  useFrame(()=>{
    if(!ref.current)return;
    for(let i=0;i<6;i++){
      const t=(gameClock.seconds*.18+i/6)%1;
      object.position.set((i%2?-.24:.24)+Math.sin(t*5+i)*.02,.17+t*.3,.22+Math.cos(i)*.02);
      object.scale.setScalar(.015+Math.sin(t*Math.PI)*.02);object.updateMatrix();
      ref.current.setMatrixAt(i,object.matrix);
    }
    ref.current.instanceMatrix.needsUpdate=true;
  });
  return <instancedMesh name="shared-tea-steam" ref={ref} args={[undefined,undefined,6]} position={[-4.6,.98,19]} frustumCulled={false}><sphereGeometry args={[1,6,4]}/><meshBasicMaterial color="#dfded0" transparent opacity={.14} depthWrite={false}/></instancedMesh>;
}

export function SharedTableSetting() {
  return <group name="harvest-table-setting" position={[-3,.967,19]}>
    <mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[4.6,.62]}/><meshStandardMaterial color="#b9aa81" roughness={1}/></mesh>
    {[-1,1].map(side=><group key={side} position={[side*2.2,.025,0]}>
      <mesh><cylinderGeometry args={[.22,.18,.025,24]}/><meshStandardMaterial color="#d0c9b1" roughness={.75}/></mesh>
      {[-1,0,1].map(i=><mesh key={i} position={[i*.08,.04,0]} rotation={[0,i*.4,0]} scale={[.07,.025,.12]}><sphereGeometry args={[1,10,6]}/><meshStandardMaterial color="#d2be85" roughness={.85}/></mesh>)}
    </group>)}
  </group>;
}
