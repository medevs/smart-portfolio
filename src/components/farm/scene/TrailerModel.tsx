"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Progress } from "@/farm/game/progress";
import { gameClock } from "@/farm/game/clock";
import { walk } from "./walk-state";
import { AppleBasket } from "./FarmObjects";
import { Metal, Timber, Rod, Rivets } from "./ObjectParts";

/** Visuals sample the jointed Rapier trailer; they never move the physics bodies. */
export function TrailerModel({progress}:{progress:Progress}) {
  const root=useRef<THREE.Group>(null),wheels=useRef<(THREE.Group|null)[]>([]);
  const previous=useRef<{x:number;z:number;angle:number}|null>(null);
  useFrame(()=>{
    if(!root.current)return;
    root.current.position.set(walk.trailerX,walk.trailerY,walk.trailerZ);
    root.current.rotation.y=walk.trailerYaw;
    const old=previous.current;
    const distance=old?(walk.trailerX-old.x)*Math.sin(walk.trailerYaw)+(walk.trailerZ-old.z)*Math.cos(walk.trailerYaw):0;
    const angle=old&&!gameClock.paused&&Math.abs(distance)<2?old.angle+distance/.22:old?.angle??0;
    for(const wheel of wheels.current)if(wheel)wheel.rotation.x=angle;
    previous.current={x:walk.trailerX,z:walk.trailerZ,angle};
  });
  return <group name="harvest-trailer" ref={root} position={[walk.trailerX,walk.trailerY,walk.trailerZ]} rotation={[0,walk.trailerYaw,0]}>
    <Metal position={[0,.18,0]} size={[1.12,.1,1.55]} color="#626d5b"/>
    {[-.4,-.2,0,.2,.4].map(x=><Timber key={x} position={[x,.26,0]} size={[.18,.07,1.48]}/>)}
    {[-1,1].map((side,i)=><group key={side}>
      {[.4,.59].map(y=><Timber key={y} position={[side*.56,y,0]} size={[.055,.14,1.6]} color="#8f8567"/>)}
      {[-.7,.7].map(z=><Metal key={z} position={[side*.56,.43,z]} size={[.04,.5,.055]}/>)}
      <group name={`trailer-wheel-${i}`} ref={node=>{wheels.current[i]=node}} position={[side*.62,0,-.2]}>
        <mesh rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.22,.22,.15,20]}/><meshStandardMaterial color="#353c32" roughness={1}/></mesh>
        <mesh position={[side*.08,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.12,.12,.015,16]}/><meshStandardMaterial color="#8c8c72" roughness={.65} metalness={.4}/></mesh>
        <Rivets points={Array.from({length:6},(_,j)=>[side*.095,Math.cos(j*Math.PI/3)*.08,Math.sin(j*Math.PI/3)*.08])} r={.012}/>
      </group>
      <Rod a={[side*.48,.18,.7]} b={[0,0,1.25]} r={.03} metal/>
    </group>)}
    {[-1,1].map(side=>[.4,.59].map(y=><Timber key={`${side}:${y}`} position={[0,y,side*.78]} size={[1.08,.14,.055]} color="#8f8567"/>))}
    <Rod a={[-.65,0,-.2]} b={[.65,0,-.2]} r={.035} metal/>
    <mesh position={[0,0,1.25]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.06,.018,6,16]}/><meshStandardMaterial color="#697061" metalness={.6} roughness={.65}/></mesh>
    {progress.basket==="trailer"&&progress.apples>0&&<group name="trailer-apple-basket" position={[0,.3,-.1]}><AppleBasket count={progress.apples}/></group>}
  </group>;
}
