"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gameClock } from "@/farm/game/clock";
import { Timber, Rivets } from "./ObjectParts";

/** Small details share the paused/reduced-motion world clock, with no timers or downloads. */
export function FarmLife({ rain = false }: { rain?: boolean }) {
  const water = useRef<THREE.InstancedMesh>(null), bees = useRef<THREE.InstancedMesh>(null);
  const wings=useRef<THREE.InstancedMesh>(null), heads=useRef<THREE.InstancedMesh>(null);
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
        const x=dummy.position.x,y=dummy.position.y,z=dummy.position.z;
        dummy.position.set(x,y,z+.03);dummy.scale.setScalar(1);dummy.updateMatrix();heads.current?.setMatrixAt(i,dummy.matrix);
        for(let side=0;side<2;side++){dummy.position.set(x+(side?1:-1)*.026,y+.018,z);dummy.scale.set(.035,.01,.017);dummy.rotation.set(0,0,(side?1:-1)*(.3+Math.sin(gameClock.seconds*35+i)*.65));dummy.updateMatrix();wings.current?.setMatrixAt(i*2+side,dummy.matrix);}

      }
      bees.current.instanceMatrix.needsUpdate = true;
      if(heads.current) heads.current.instanceMatrix.needsUpdate=true;
      if(wings.current) wings.current.instanceMatrix.needsUpdate=true;
    }
  });
  return <group name="farm-life-details">
    <instancedMesh name="flowing-seguia" ref={water} args={[undefined, undefined, 18]} position={[-10.4,.116,9.5]} frustumCulled={false}>
      <planeGeometry args={[.045,.28]}/><meshBasicMaterial color="#c5ded6" transparent opacity={.36} depthWrite={false}/>
    </instancedMesh>
    <instancedMesh name="orchard-bees" ref={bees} args={[undefined, undefined, 8]} position={[24,0,15]} visible={!rain} frustumCulled={false}>
      <sphereGeometry args={[.032,6,4]}/><meshStandardMaterial color="#9a7b38" roughness={1}/>
    </instancedMesh>
    <instancedMesh ref={heads} args={[undefined,undefined,8]} position={[24,0,15]} visible={!rain} frustumCulled={false}><sphereGeometry args={[.015,6,4]}/><meshStandardMaterial color="#434b35" roughness={.8}/></instancedMesh>
    <instancedMesh ref={wings} args={[undefined,undefined,16]} position={[24,0,15]} visible={!rain} frustumCulled={false}><sphereGeometry args={[1,6,4]}/><meshStandardMaterial color="#c1cbb9" transparent opacity={.55} depthWrite={false} roughness={.6}/></instancedMesh>
    <group name="cedar-lookout-bench" position={[-20,0,-15.3]}>
      {[-.32,0,.32].map(z=><Timber key={z} position={[0,.63,z]} size={[2.6,.1,.24]} color="#9c9475"/>)}
      {[-1,1].map(x=><group key={x}><Timber position={[x,.3,0]} size={[.14,.6,.75]}/><Timber position={[x,.5,0]} size={[.18,.12,.88]}/></group>)}
      <Timber position={[0,.25,0]} size={[2.2,.12,.12]}/><Rivets points={[-1,1].flatMap(x=>[-.32,0,.32].map(z=>[x,.688,z] as [number,number,number]))}/>
    </group>
    <group name="courtyard-tea-tray" position={[-4.6,.98,19]}><TeaTray/></group>
  </group>;
}


export function TeaTray() {
  const vessel=useMemo(()=>new THREE.LatheGeometry([new THREE.Vector2(.09,0),new THREE.Vector2(.15,.04),new THREE.Vector2(.17,.13),new THREE.Vector2(.13,.22),new THREE.Vector2(.09,.25)],24),[]);
  const spout=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(.12,.08,0),new THREE.Vector3(.23,.12,0),new THREE.Vector3(.28,.26,0)]),10,.022,8,false),[]);
  return <group>
    <mesh><cylinderGeometry args={[.4,.4,.022,32]}/><meshStandardMaterial color="#a49b79" metalness={.65} roughness={.48}/></mesh>
    {[.37,.39].map(r=><mesh key={r} rotation={[Math.PI/2,0,0]} position={[0,.018,0]}><torusGeometry args={[r,.007,6,32]}/><meshStandardMaterial color="#8f9179" metalness={.65} roughness={.5}/></mesh>)}
    <group position={[0,.026,0]}>
      <mesh geometry={vessel} castShadow><meshStandardMaterial color="#b0b4a3" metalness={.75} roughness={.35} side={THREE.DoubleSide}/></mesh>
      <mesh geometry={spout} castShadow><meshStandardMaterial color="#a7ad9b" metalness={.75} roughness={.35}/></mesh>
      <mesh position={[0,.255,0]}><coneGeometry args={[.1,.045,24]}/><meshStandardMaterial color="#b0b4a3" metalness={.75} roughness={.35}/></mesh>
      <mesh position={[0,.295,0]}><sphereGeometry args={[.018,10,8]}/><meshStandardMaterial color="#636e5d" roughness={.75}/></mesh>
      <mesh position={[-.17,.13,0]} scale={[.8,1.25,1]}><torusGeometry args={[.095,.014,7,24,Math.PI*1.6]}/><meshStandardMaterial color="#a7ad9b" metalness={.75} roughness={.4}/></mesh>
    </group>
    {[-.24,.24].map(x=><group key={x} position={[x,.02,.22]}><mesh position={[0,.065,0]}><cylinderGeometry args={[.045,.034,.13,16,1,true]}/><meshStandardMaterial color="#a2b7a3" transparent opacity={.5} side={THREE.DoubleSide} roughness={.2}/></mesh><mesh position={[0,.035,0]}><cylinderGeometry args={[.04,.035,.07,16]}/><meshStandardMaterial color="#8b7143" transparent opacity={.75} roughness={.4}/></mesh></group>)}
  </group>;
}
