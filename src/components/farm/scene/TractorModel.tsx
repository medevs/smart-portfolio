"use client";
import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gameClock } from "@/farm/game/clock";
import { walk, TRACTOR } from "./walk-state";
import { vehicleVisual, type VehicleVisual } from "./object-motion";
import { Metal, Timber, Rod, Rivets, type V3 } from "./ObjectParts";
import { MakerHead } from "./MakerAvatar";
function Wheel({radius,width,front=false}:{radius:number;width:number;front?:boolean}) {
  const tread=useRef<THREE.InstancedMesh>(null);
  const count=front?18:26;
  useLayoutEffect(()=>{if(!tread.current)return;const o=new THREE.Object3D();for(let i=0;i<count;i++){const a=i/count*Math.PI*2;o.position.set(Math.cos(a)*(radius-.01),Math.sin(a)*(radius-.01),0);o.rotation.set(0,0,a);o.updateMatrix();tread.current.setMatrixAt(i,o.matrix)}tread.current.instanceMatrix.needsUpdate=true;tread.current.computeBoundingSphere()},[count,radius]);
  return <group>
    <mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[radius*.94,radius*.94,width,24]}/><meshStandardMaterial color="#343a32" roughness={.96}/></mesh>
    <instancedMesh ref={tread} args={[undefined,undefined,count]} castShadow><boxGeometry args={[.055,radius*.2,width*1.12]}/><meshStandardMaterial color="#30372e" roughness={1}/></instancedMesh>
    {[-1,1].map(side=><group key={side} position={[0,0,side*width*.53]}>
      <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[radius*.52,radius*.52,.025,20]}/><meshStandardMaterial color="#9a5948" metalness={.35} roughness={.7}/></mesh>
      <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[radius*.19,radius*.19,.06,12]}/><meshStandardMaterial color="#777b6b" metalness={.5} roughness={.64}/></mesh>
      <Rivets points={Array.from({length:6},(_,i)=>[Math.cos(i*Math.PI/3)*radius*.31,Math.sin(i*Math.PI/3)*radius*.31,side*.025])}/>
    </group>)}
  </group>;
}
export function Tractor() {
  const rear=useRef<(THREE.Group|null)[]>([]),front=useRef<(THREE.Group|null)[]>([]),steering=useRef<(THREE.Group|null)[]>([]),driver=useRef<THREE.Group>(null);
  const previous=useRef<VehicleVisual>({x:TRACTOR.x+walk.tx,z:TRACTOR.z+walk.tz,yaw:walk.vehicleYaw,rear:0,front:0,steer:0});
  useFrame(()=>{
    previous.current=vehicleVisual(previous.current,{x:TRACTOR.x+walk.tx,z:TRACTOR.z+walk.tz,yaw:walk.vehicleYaw},gameClock.paused);
    for(const wheel of rear.current)if(wheel)wheel.rotation.z=previous.current.rear;
    for(const wheel of front.current)if(wheel)wheel.rotation.z=previous.current.front;
    for(const axle of steering.current)if(axle)axle.rotation.y=previous.current.steer;
    if(driver.current)driver.current.visible=walk.driving;
  });
  return <group name="working-tractor">
    <Metal position={[.02,.5,0]} size={[1.48,.14,.48]} color="#59634f"/>
    <Metal position={[.33,.76,0]} size={[.82,.38,.48]} color="#9b5e48"/>
    <Metal position={[.76,.72,0]} size={[.035,.3,.43]} color="#424b40"/>
    {Array.from({length:9},(_,i)=><Metal key={i} position={[.785,.59+i*.028,0]} size={[.015,.01,.38]} color="#89907b"/>)}
    {[-1,1].map((side,i)=><group key={side}>
      <group name={`tractor-rear-wheel-${i}`} ref={node=>{rear.current[i]=node}} position={[-.46,.4,side*.39]}><Wheel radius={.4} width={.2}/></group>
      <group name={`tractor-steering-${i}`} ref={node=>{steering.current[i]=node}} position={[.58,.245,side*.34]}><group name={`tractor-front-wheel-${i}`} ref={node=>{front.current[i]=node}}><Wheel radius={.245} width={.135} front/></group></group>
      <Metal position={[-.46,.77,side*.36]} size={[.55,.035,.28]} color="#965b47"/>
      <Metal position={[-.25,.5,side*.38]} size={[.36,.045,.2]} color="#6e725f"/>
      <mesh position={[.79,.86,side*.16]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.055,.055,.045,12]}/><meshStandardMaterial color="#d1c6a0" emissive="#b6a16e" emissiveIntensity={.12} roughness={.25}/></mesh>
    </group>)}
    <Rod a={[-.46,.4,-.4]} b={[-.46,.4,.4]} r={.045} metal/>
    <Rod a={[.58,.245,-.33]} b={[.58,.245,.33]} r={.025} metal/>
    <Metal position={[-.33,.81,0]} size={[.3,.08,.34]} color="#454e40"/>
    <Metal position={[-.48,.97,0]} size={[.065,.32,.33]} color="#454e40"/>
    <Rod a={[-.11,.65,0]} b={[.02,1.04,0]} r={.02} metal/>
    <mesh position={[.02,1.04,0]} rotation={[0,0,-.3]}><torusGeometry args={[.12,.012,6,20]}/><meshStandardMaterial color="#353f34" roughness={.9}/></mesh>
    <Rod a={[.45,.9,-.13]} b={[.45,1.42,-.13]} r={.027} color="#555c4e" metal/>
    <Metal position={[.47,1.43,-.13]} size={[.1,.025,.08]} color="#565e50"/>
    {[-1,1].map(side=><Rod key={side} a={[-.59,.7,side*.27]} b={[-.59,1.57,side*.27]} r={.03} metal/>)}
    <Metal position={[-.2,1.59,0]} size={[.9,.045,.85]} color="#a39c7c"/>
    <Rivets points={[-.15,.1,.35,.6].flatMap(x=>[-1,1].map(s=>[x,.94,s*.245] as V3))}/>
    <Timber position={[-.77,.35,0]} size={[.12,.09,.2]} color="#827963"/>
    <group ref={driver} name="tractor-driver" position={[-.38,.18,0]} scale={.8} rotation={[0,Math.PI/2,0]} visible={false}>
      {[-1,1].map(side=><group key={side}>
        <Rod a={[side*.1,.78,0]} b={[side*.1,.77,.28]} r={.065} color="#414847"/>
        <Rod a={[side*.1,.77,.28]} b={[side*.1,.46,.32]} r={.052} color="#414847"/>
        <Metal position={[side*.1,.43,.37]} size={[.14,.1,.24]} color="#514c3d"/>
        <Rod a={[side*.2,1.16,0]} b={[side*.2,.98,.18]} r={.052} color="#998886"/>
        <Rod a={[side*.2,.98,.18]} b={[side*.12,1.05,.42]} r={.045} color="#998886"/>
        <mesh position={[side*.12,1.05,.42]}><sphereGeometry args={[.05,9,7]}/><meshStandardMaterial color="#aa8970" roughness={1}/></mesh>
      </group>)}
      <mesh position={[0,1.02,0]}><capsuleGeometry args={[.16,.3,4,10]}/><meshStandardMaterial color="#998886" roughness={1}/></mesh><MakerHead/>
    </group>
  </group>;
}
