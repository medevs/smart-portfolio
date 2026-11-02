"use client";
import { useContext, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { gameClock } from "@/farm/game/clock";
import { CELL } from "@/farm/world";
import { NaturalDetail } from "./MiddleAtlas";
import { appleGeometry, randomSeed } from "./natural-geometry";
import { Surface } from "./materials";
import { Ellipsoid, Metal, Rod, Timber, Rivets, type V3 } from "./ObjectParts";
import type { ModelProps } from "./models";

export function WaterTower({golden=false}:ModelProps) {
  return <group name="galvanized-water-tower">
    {[-1,1].flatMap(x=>[-1,1].map(z=><group key={`${x}:${z}`}>
      <Metal position={[x*.56,1.42,z*.56]} size={[.085,2.84,.085]}/>
      <mesh position={[x*.56,.08,z*.56]}><boxGeometry args={[.3,.16,.3]}/><Surface name="rock" color="#aaa58e" metalness={0}/></mesh>
    </group>))}
    {[-1,1].map(s=><group key={s}><Rod a={[-.55,.25,s*.55]} b={[.55,2.7,s*.55]} metal/><Rod a={[.55,.25,s*.55]} b={[-.55,2.7,s*.55]} metal/><Rod a={[s*.55,.25,-.55]} b={[s*.55,2.7,.55]} metal/></group>)}
    <mesh position={[0,3.05,0]} castShadow><cylinderGeometry args={[.9,.9,.82,32]}/><Surface color="#a5aaa0" golden={golden} metalness={.45} roughness={.67}/></mesh>
    {Array.from({length:11},(_,i)=><mesh key={i} position={[0,2.67+i*.077,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.906,.012,5,32]}/><meshStandardMaterial color="#969e91" metalness={.5} roughness={.7}/></mesh>)}
    <mesh position={[0,3.48,0]} scale={[1,.18,1]}><sphereGeometry args={[.91,24,12,0,Math.PI*2,0,Math.PI/2]}/><Surface color="#9da397" golden={golden} metalness={.45} roughness={.7}/></mesh>
    <Rod a={[.72,2.7,0]} b={[.72,.25,0]} r={.045} metal/><Rod a={[.72,.25,0]} b={[1.1,.25,0]} r={.045} metal/>
    <mesh position={[1.1,.25,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.1,.015,6,16]}/><meshStandardMaterial color="#875c46" metalness={.5} roughness={.7}/></mesh>
    {[-.18,.18].map(z=><Rod key={z} a={[-.94,.05,z]} b={[-.94,3.62,z]} r={.018} metal/>)}
    {Array.from({length:13},(_,i)=><Rod key={i} a={[-.96,.18+i*.27,-.18]} b={[-.96,.18+i*.27,.18]} r={.014} metal/>)}
  </group>;
}
export function Coop() {
  return <group name="timber-henhouse">
    {[-.65,.65].flatMap(x=>[-.48,.48].map(z=><Timber key={`${x}:${z}`} position={[x,.35,z]} size={[.1,.7,.1]}/>))}
    <Timber position={[0,.55,0]} size={[1.6,.1,1.2]}/>
    {Array.from({length:9},(_,i)=><group key={i}><Timber position={[-.72+i*.18,.99,-.57]} size={[.17,.8,.06]} color={i%2?"#93856a":"#a2967b"}/><Timber position={[-.72+i*.18,.99,.57]} size={[.17,.8,.06]} color="#96886d"/></group>)}
    {[-1,1].map(s=><group key={s}><Timber position={[s*.79,.99,0]} size={[.06,.8,1.2]}/><mesh position={[s*.44,1.5,0]} rotation={[0,0,s*-.25]} castShadow><boxGeometry args={[.94,.055,1.45]}/><Surface name="roof" color="#777b69" repeat={[2,2]} metalness={0}/></mesh></group>)}
    <Timber position={[.45,.7,.78]} size={[.5,.35,.4]} color="#8a7b5f"/>
    <Metal position={[.45,.91,.78]} size={[.56,.04,.45]} color="#8b9280"/>
    <mesh position={[-.35,.78,.61]}><planeGeometry args={[.4,.45]}/><meshStandardMaterial color="#343d2e" roughness={1}/></mesh>
    <Timber position={[-.35,.29,1.03]} rotation={[.55,0,0]} size={[.4,.045,.96]}/>
    {Array.from({length:6},(_,i)=><Timber key={i} position={[-.35,.53-i*.072,.64+i*.15]} size={[.43,.028,.035]} color="#b0a182"/>)}
    <Rivets points={[-.67,.67].flatMap(x=>[.7,1.26].map(y=>[x,y,.61] as V3))}/>
  </group>;
}
function bankGeometry() {
  const g=new THREE.RingGeometry(1.78,2.3,40,2);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const a=Math.atan2(p.getY(i),p.getX(i)),r=1+Math.sin(a*5)*.045+Math.cos(a*9)*.025;p.setXY(i,p.getX(i)*r,p.getY(i)*r)}g.computeVertexNormals();return g;
}
export function Pond({wind=.65}:ModelProps) {
  const bank=useMemo(()=>bankGeometry(),[]),rings=useRef<THREE.Group>(null),low=useContext(NaturalDetail);
  useFrame(()=>{if(rings.current)rings.current.children.forEach((ring,i)=>ring.scale.setScalar(.7+((gameClock.seconds*.08+i*.3)%1)*.4))});
  return <group name="reed-lined-pond">
    <mesh rotation={[-Math.PI/2,0,0]} geometry={bank} position={[0,.025,0]} receiveShadow><Surface name="dirt" color="#867b5c" repeat={[3,3]} metalness={0}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.035,0]}><circleGeometry args={[1.95,48]}/><meshStandardMaterial color="#667e70" roughness={.24} metalness={0} envMapIntensity={.8} transparent opacity={.92}/></mesh>
    <group ref={rings} position={[0,.042,0]}>{[.5,1,1.5].map(r=><mesh key={r} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[r,r+.008,40]}/><meshBasicMaterial color="#bec6ae" transparent opacity={.15*wind} depthWrite={false}/></mesh>)}</group>
    {Array.from({length:low?10:20},(_,i)=>{const a=i*2.399,r=1.95+(i%3)*.08;return <group key={i} position={[Math.cos(a)*r,0,Math.sin(a)*r]} rotation={[0,a,0]}><Rod a={[0,0,0]} b={[.04,.6+(i%4)*.08,0]} r={.01} color="#7b845e"/><mesh position={[.04,.65+(i%4)*.08,0]}><capsuleGeometry args={[.019,.1,3,6]}/><meshStandardMaterial color="#77734e" roughness={1}/></mesh><mesh position={[.08,.23,0]} rotation={[0,0,-.2]}><coneGeometry args={[.035,.45,4]}/><meshStandardMaterial color="#77845a" roughness={1}/></mesh></group>})}
  </group>;
}
function colored(g:THREE.BufferGeometry,color:string) {const c=new THREE.Color(color),a=[];for(let i=0;i<g.attributes.position.count;i++)a.push(c.r,c.g,c.b);g.setAttribute('color',new THREE.Float32BufferAttribute(a,3));return g.toNonIndexed();}
function plantGeometry(wheat:boolean) {
  const parts:THREE.BufferGeometry[]=[];
  if(wheat) {
    parts.push(colored(new THREE.CylinderGeometry(.008,.012,.68,5).translate(0,.34,0),'#a09661'));
    for(let i=0;i<6;i++)for(const side of [-1,1])parts.push(colored(new THREE.SphereGeometry(.022,6,4).scale(1,1.8,.8).rotateZ(side*.5).translate(side*.018,.68+i*.032,0),'#b8a56e'));
    for(const side of [-1,1])parts.push(colored(new THREE.ConeGeometry(.025,.32,4).rotateZ(side*-.4).translate(side*.045,.35,0),'#9b9e6a'));
  } else {
    for(let i=0;i<9;i++){const a=i*2.399;parts.push(colored(new THREE.SphereGeometry(1,7,5).scale(.11,.025,.22).rotateX(.25+i*.04).rotateY(a).translate(Math.sin(a)*.1,.09+(i%3)*.035,Math.cos(a)*.1),i%2?'#879565':'#647e53'))}
  }
  const result=mergeGeometries(parts,false)!;parts.forEach(g=>g.dispose());return result;
}
const WHEAT=plantGeometry(true),LETTUCE=plantGeometry(false);
function Field({cols=3,rows=1,wheat=false,watered=false,wind=.65}:ModelProps&{wheat?:boolean}) {
  const low=useContext(NaturalDetail),w=Math.max(1.4,cols*CELL*.9),d=Math.max(1.4,rows*CELL*.9);
  const perRow=Math.max(5,Math.round(w/(low?.5:.34))),rowCount=Math.max(2,Math.round(d/(low?.7:.5))),count=perRow*rowCount;
  const plants=useRef<THREE.InstancedMesh>(null),stamp=useRef(-1),dummy=useMemo(()=>new THREE.Object3D(),[]);
  useLayoutEffect(()=>{stamp.current=-1},[count,w,d,wind]);
  useFrame(()=>{const tick=Math.floor(gameClock.seconds*20);if(tick===stamp.current||!plants.current)return;stamp.current=tick;for(let i=0;i<count;i++){const x=-w/2+((i%perRow+.5)*w/perRow),z=-d/2+(Math.floor(i/perRow)+.5)*d/rowCount;dummy.position.set(x,.03,z);dummy.rotation.set(0,i*2.399,Math.sin(gameClock.seconds*1.2+i)*.035*wind);dummy.scale.setScalar(.85+(i%5)*.055);dummy.updateMatrix();plants.current.setMatrixAt(i,dummy.matrix)}plants.current.instanceMatrix.needsUpdate=true;plants.current.computeBoundingSphere()});
  return <group name={wheat?"wheat-with-grain-heads":"leafy-kitchen-beds"}>
    <mesh position={[0,.015,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[w+.3,d+.3]}/><Surface name="dirt" color={watered?'#6e654b':'#a09370'} repeat={[3,2]} roughness={watered?.8:1} metalness={0}/></mesh>
    <instancedMesh ref={plants} args={[wheat?WHEAT:LETTUCE,undefined,count]} castShadow dispose={null}><meshStandardMaterial vertexColors roughness={.96} metalness={0}/></instancedMesh>
    {[-d/2,d/2].map(z=><Timber key={z} position={[0,.05,z]} size={[w,.1,.06]} color="#93876a"/>)}
  </group>;
}
export const Wheat=(props:ModelProps)=><Field {...props} wheat/>;
export const Crops=(props:ModelProps)=><Field {...props}/>;
const BLOSSOM_BRANCHES=appleGeometry(41,true).wood;
export function Blossom() {
  const petals=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{if(!petals.current)return;const random=randomSeed(18),o=new THREE.Object3D();for(let i=0;i<180;i++){const flower=Math.floor(i/5),a=flower*2.399,y=(flower%7)/7-.5,r=Math.sqrt(1-y*y);o.position.set(Math.sin(a)*r*.61+Math.cos(i)*.035,1.42+y*.7,Math.cos(a)*r*.61+Math.sin(i)*.035);o.rotation.set(random(),a,i);o.scale.set(1,.35,1.5);o.updateMatrix();petals.current.setMatrixAt(i,o.matrix)}petals.current.instanceMatrix.needsUpdate=true;petals.current.computeBoundingSphere()},[]);
  return <group name="orchard-blossom"><mesh geometry={BLOSSOM_BRANCHES} scale={.66} castShadow dispose={null}><meshStandardMaterial color="#776e56" roughness={1}/></mesh><instancedMesh ref={petals} args={[undefined,undefined,180]} castShadow><sphereGeometry args={[.04,6,4]}/><meshStandardMaterial color="#d6c9b8" roughness={.95}/></instancedMesh></group>;
}
export function Scarecrow() {
  const shirt=useRef<THREE.Group>(null);useFrame(()=>{if(shirt.current)shirt.current.rotation.z=Math.sin(gameClock.seconds*.6)*.025});
  return <group name="field-scarecrow"><Timber position={[0,.85,0]} size={[.065,1.7,.065]}/><Timber position={[0,1.22,0]} size={[1.2,.055,.055]} rotation={[0,0,-.1]}/>
    <group ref={shirt} position={[0,1.14,0]}><Ellipsoid scale={[.18,.28,.11]} color="#828c79"/>{[-1,1].map(s=><group key={s}><Timber position={[s*.35,.08,0]} size={[.5,.15,.16]} rotation={[0,0,s*-.08]} color="#909581"/>{[0,1,2].map(i=><Rod key={i} a={[s*.58,.06,0]} b={[s*(.72+i*.03),-.03+i*.045,0]} r={.009} color="#b4aa78"/>)}</group>)}<Rod a={[-.18,-.18,.11]} b={[.18,-.18,.11]} r={.018} color="#a79d75"/></group>
    <Ellipsoid position={[0,1.58,0]} scale={[.12,.15,.11]} color="#b4a786"/>
    <mesh position={[0,1.72,0]}><cylinderGeometry args={[.25,.25,.025,20]}/><meshStandardMaterial color="#a2966b" roughness={1}/></mesh><mesh position={[0,1.79,0]}><cylinderGeometry args={[.105,.15,.15,16]}/><meshStandardMaterial color="#a69a71" roughness={1}/></mesh>
  </group>;
}
export function Mailbox() {
  return <group name="weathered-postbox"><Timber position={[0,.48,0]} size={[.09,.96,.09]}/><Metal position={[.1,.98,0]} size={[.45,.28,.28]} color="#778370"/><Metal position={[.1,1.13,0]} size={[.5,.035,.31]} color="#7e8976"/><Metal position={[.1,1.01,.146]} size={[.32,.018,.008]} color="#333f31"/><Metal position={[.1,.91,.15]} size={[.12,.018,.018]}/><Metal position={[.34,1.16,0]} size={[.1,.12,.02]} color="#9c6d4c"/><Rivets points={[[-.08,.9,.15],[.28,.9,.15]]}/></group>;
}
export function Stall() {
  const apples=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{if(!apples.current)return;const o=new THREE.Object3D();for(let i=0;i<18;i++){o.position.set(-.65+(i%6)*.16,.94+Math.floor(i/6)*.025,-.2+Math.floor(i/6)*.16);o.updateMatrix();apples.current.setMatrixAt(i,o.matrix)}apples.current.instanceMatrix.needsUpdate=true;apples.current.computeBoundingSphere()},[]);
  return <group name="timber-produce-stall">
    {[-.78,.78].flatMap(x=>[-.36,.36].map(z=><Timber key={`${x}:${z}`} position={[x,.94,z]} size={[.08,1.88,.08]}/>))}
    <Timber position={[0,.8,0]} size={[1.7,.1,.85]}/>
    {Array.from({length:8},(_,i)=><Timber key={i} position={[-.73+i*.21,.4,.37]} size={[.2,.7,.035]} color={i%2?'#948466':'#a39576'}/>)}
    {[-1,1].map(s=><mesh key={s} position={[0,1.9,s*.3]} rotation={[s*.23,0,0]} castShadow><boxGeometry args={[1.98,.025,.68]}/><meshStandardMaterial color="#b3ad8f" roughness={1}/></mesh>)}
    <Timber position={[-.22,.87,0]} size={[1.2,.06,.6]}/><instancedMesh ref={apples} args={[undefined,undefined,18]} castShadow><sphereGeometry args={[.075,10,7]}/><meshStandardMaterial color="#9a7048" roughness={.85}/></instancedMesh>
  </group>;
}
export function Sign({golden=false}:Partial<ModelProps>) {
  return <group name="joined-timber-sign"><Timber position={[0,.58,0]} size={[.085,1.16,.085]}/><Timber position={[0,1.12,0]} size={[.72,.33,.055]} color="#b6aa87"/><Timber position={[0,1.12,-.055]} size={[.65,.04,.04]} rotation={[0,0,.25]}/><Rivets points={[[-.29,1.22,.031],[.29,1.02,.031]]}/>{golden&&<Metal position={[.25,1.12,.036]} size={[.035,.14,.01]} color="#b9a568"/>}</group>;
}
export function Fence({cols=2}:ModelProps) {
  const w=Math.max(CELL,cols*CELL*.92),count=Math.max(2,Math.round(w/1.1));
  return <group name="mortised-pasture-fence">{[.4,.7].map(y=><Timber key={y} position={[0,y,0]} size={[w,.075,.06]} color="#9d9479"/>)}{Array.from({length:count},(_,i)=>{const x=-w/2+i*w/(count-1);return <group key={i}><Timber position={[x,.48,0]} size={[.1,.96,.1]}/><Metal position={[x,.975,0]} size={[.12,.025,.12]} color="#727a68"/><Rivets points={[[x,.4,.06],[x,.7,.06]]}/></group>})}</group>;
}
export function Hay() {
  const g=useMemo(()=>{const geo=new THREE.CylinderGeometry(.4,.4,.68,36,4);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x),r=1+Math.sin(a*36)*.012;p.setXYZ(i,x*r,p.getY(i),z*r)}geo.computeVertexNormals();return geo},[]);
  return <group name="twine-bound-hay" position={[0,.4,0]} rotation={[0,.3,Math.PI/2]}><mesh geometry={g} castShadow><meshStandardMaterial color="#aaa074" roughness={1}/></mesh>{[-.22,.22].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.405,.01,5,36]}/><meshStandardMaterial color="#776f50" roughness={1}/></mesh>)}</group>;
}
function tunnelGeometry() {
  const positions=[],uv=[],indices=[];
  for(let side=0;side<2;side++)for(let i=0;i<=24;i++){const a=i/24*Math.PI;positions.push(Math.cos(a)*1.2,Math.sin(a)*.95+.2,(side-.5)*3.4);uv.push(i/24,side)}
  for(let i=0;i<24;i++)indices.push(i,i+1,i+25,i+1,i+26,i+25);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function Greenhouse() {
  const cover=useMemo(()=>tunnelGeometry(),[]);
  return <group name="hoop-greenhouse"><mesh geometry={cover} castShadow><meshStandardMaterial color="#b5bfb0" transparent opacity={.24} depthWrite={false} side={THREE.DoubleSide} roughness={.48} metalness={0}/></mesh>
    {[-1.65,-.8,0,.8,1.65].map(z=><mesh key={z} position={[0,.2,z]} scale={[1.2,.95,1]}><torusGeometry args={[1,.017,5,24,Math.PI]}/><meshStandardMaterial color="#818b79" metalness={.5} roughness={.7}/></mesh>)}
    {[-1.2,1.2].map(x=><Timber key={x} position={[x,.12,0]} size={[.08,.2,3.5]}/>)}
    <Rod a={[0,.2,1.66]} b={[0,1.15,1.66]} metal/><Rod a={[-.5,.2,1.66]} b={[-.5,.95,1.66]} metal/>
    {[-.7,.7].map(x=><group key={x} position={[x,0,0]}><Timber position={[0,.12,0]} size={[.75,.2,2.8]} color="#a2997d"/>{[-1,-.5,0,.5,1].map(z=><Ellipsoid key={z} position={[0,.3,z]} scale={[.17,.08,.2]} color="#75845b"/>)}</group>)}
  </group>;
}
export function FencePeg({golden=false}:ModelProps) {return <group name="capped-fence-peg"><Timber position={[0,.48,0]} size={[.1,.96,.1]}/><mesh position={[0,.98,0]}><boxGeometry args={[.13,.04,.13]}/><Surface golden={golden} color="#858d79" metalness={.45} roughness={.66}/></mesh><Rivets points={[[0,.8,.06]]}/></group>}
export function FlowerSign({golden=false}:ModelProps) {return <group name="garden-flower"><Rod a={[0,0,0]} b={[0,.6,0]} r={.013} color="#718154"/>{Array.from({length:8},(_,i)=><mesh key={i} position={[Math.cos(i*Math.PI/4)*.09,.62,Math.sin(i*Math.PI/4)*.09]} rotation={[0,-i*Math.PI/4,0]} scale={[.045,.018,.1]}><sphereGeometry args={[1,7,5]}/><Surface color={golden?'#c0ac6e':'#cfbc9f'} golden={golden} roughness={.85} metalness={0}/></mesh>)}<Ellipsoid position={[0,.63,0]} scale={[.05,.025,.05]} color="#9c8f54"/><Timber position={[.15,.18,0]} size={[.18,.1,.018]} color="#b4aa8b"/></group>}
export const AnimalSign=()=> <Sign/>;
export const PlotStake=(props:ModelProps)=> <group scale={.75}><Sign {...props}/></group>;

/** Extra construction details share the footprint and preserve each building's identity. */
export function BuildingFinish({width=5.4,depth=2.6,height=2.8}:{width?:number;depth?:number;height?:number}) {
  return <group name="building-joinery-and-drainage"><Rod a={[-width*.5,height,depth*.5]} b={[-width*.5,.2,depth*.5]} r={.035} color="#817b65" metal/><Metal position={[0,height,depth*.5+.04]} size={[width,.055,.06]} color="#8d8973"/>{[-1,1].map(s=><Timber key={s} position={[s*width*.42,height-.22,depth*.5+.1]} size={[.06,.4,.06]} rotation={[0,0,s*.45]}/>)}<mesh position={[width*.45,1.75,depth*.5+.13]}><boxGeometry args={[.12,.22,.13]}/><meshStandardMaterial color="#746d53" metalness={.45} roughness={.7}/></mesh></group>;
}

export function WateringCan() {
  return <group name="metal-watering-can"><mesh castShadow><cylinderGeometry args={[.15,.19,.32,20]}/><meshStandardMaterial color="#7c8d80" metalness={.35} roughness={.7}/></mesh><mesh position={[0,.17,0]}><torusGeometry args={[.145,.012,5,20]}/><meshStandardMaterial color="#677b6a" metalness={.45} roughness={.7}/></mesh><Rod a={[.14,-.09,0]} b={[.42,.16,0]} r={.025} color="#7c8d80" metal/><mesh position={[.44,.19,0]} rotation={[0,0,-.8]}><cylinderGeometry args={[.075,.035,.045,12]}/><meshStandardMaterial color="#6b7b6b" metalness={.5} roughness={.6}/></mesh><mesh position={[-.19,.01,0]} scale={[1,1.4,1]}><torusGeometry args={[.12,.014,6,20,Math.PI*1.5]}/><meshStandardMaterial color="#657a69" metalness={.4} roughness={.7}/></mesh></group>;
}
export function AppleBasket({count=7}:{count?:number}) {
  const points=[new THREE.Vector2(.2,0),new THREE.Vector2(.28,.035),new THREE.Vector2(.35,.2),new THREE.Vector2(.36,.23)];
  return <group name="woven-apple-basket"><mesh castShadow><latheGeometry args={[points,20]}/><Surface name="wood" color="#a19169" repeat={[8,2]} metalness={0}/></mesh>{[.07,.13,.2,.23].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.23+y*.55,.012,5,20]}/><meshStandardMaterial color="#877e5c" roughness={1}/></mesh>)}{Array.from({length:Math.max(0,Math.min(7,count))},(_,i)=><group key={i} position={[Math.sin(i*2.399)*.23,.23+(i===6?.1:0),Math.cos(i*2.399)*.23]}><Ellipsoid scale={[.092,.09,.085]} color={i%2?'#ab8150':'#9f6650'}/><Rod a={[0,.07,0]} b={[.012,.11,0]} r={.008} color="#6c644c"/></group>)}</group>;
}
