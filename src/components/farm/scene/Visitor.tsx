"use client";
import { useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { JourneyProgress } from "./journey-state";
import { AppleBasket } from "./FarmObjects";
import { MakerHead } from "./MakerAvatar";
import { walk, WALK_SPEED } from "./walk-state";
import { gameClock } from "@/farm/game/clock";

/** Walking maker avatar, using the owner-authorized portfolio portrait. */
export function Visitor() {
  const progress = useContext(JourneyProgress);
  const carrying = progress.apples > 0 && progress.basket !== "trailer";
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null), rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null), rightLeg = useRef<THREE.Group>(null);
  const leftKnee = useRef<THREE.Group>(null), rightKnee = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3());
  useFrame(({ camera }, dt) => {
    if (root.current) {
      root.current.visible = !walk.driving && camera.position.distanceToSquared(cameraTarget.current.set(walk.px, 1.1, walk.pz)) > .56;
      root.current.rotation.y = walk.yaw;
    }
    const stride = gameClock.paused || gameClock.reduced ? 0 : Math.sin(gameClock.seconds * (walk.sprinting ? 14 : 10)) * Math.min(walk.moving / WALK_SPEED, 1.4) * .55;
    const blend = 1 - Math.exp(-12 * Math.min(dt, .05));
    for (const [part, target] of [[leftLeg, stride], [rightLeg, -stride], [leftArm, carrying ? -1.05 : -stride * .7], [rightArm, carrying ? -1.05 : stride * .7]] as const) {
      if (part.current) part.current.rotation.x = THREE.MathUtils.lerp(part.current.rotation.x, target, blend);
    }
    if(leftKnee.current) leftKnee.current.rotation.x=Math.max(0,-stride)*.8;
    if(rightKnee.current) rightKnee.current.rotation.x=Math.max(0,stride)*.8;
  });
  const limb = (ref: React.RefObject<THREE.Group | null>, x: number, y: number, length: number, color: string, knee?:React.RefObject<THREE.Group|null>) => <group ref={ref} position={[x,y,0]}>
    <mesh position={[0,-length*.25,0]} castShadow><capsuleGeometry args={[.058,length*.5-.116,4,9]}/><meshStandardMaterial color={color} roughness={1}/></mesh>
    <group ref={knee} position={[0,-length*.5,0]}>
      <mesh position={[0,-length*.25,0]} castShadow><capsuleGeometry args={[.052,length*.5-.104,4,9]}/><meshStandardMaterial color={color} roughness={1}/></mesh>
      {knee?<mesh position={[0,-length*.5-.025,.04]} castShadow><boxGeometry args={[.14,.11,.25]}/><meshStandardMaterial color="#514c3d" roughness={1}/></mesh>:<mesh position={[0,-length*.5-.025,0]} scale={[1,1.2,.75]}><sphereGeometry args={[.055,9,7]}/><meshStandardMaterial color="#aa8970" roughness={1}/></mesh>}
    </group>
  </group>;
  return <group name="maker-visitor" ref={root} position={[0, -.7, 0]}>
    <mesh position={[0, .95, 0]} castShadow><capsuleGeometry args={[.18, .32, 4, 9]} /><meshStandardMaterial color="#998886" roughness={.94} /></mesh>
    <MakerHead />
    {carrying && <group name="carried-apple-basket" position={[0,.8,.43]} scale={.7}><AppleBasket count={progress.apples}/></group>}
    {limb(leftArm, -.24, 1.13, .45, "#998886")}{limb(rightArm, .24, 1.13, .45, "#998886")}
    {limb(leftLeg, -.1, .7, .62, "#414847", leftKnee)}{limb(rightLeg, .1, .7, .62, "#414847", rightKnee)}
    <mesh position={[0,.76,0]}><boxGeometry args={[.32,.035,.24]}/><meshStandardMaterial color="#685f4a" roughness={1}/></mesh>
    <mesh position={[.1,1.06,.18]}><boxGeometry args={[.08,.09,.015]}/><meshStandardMaterial color="#a18e88" roughness={1}/></mesh>
    {[.94,1.02,1.1].map(y=><mesh key={y} position={[0,y,.183]}><sphereGeometry args={[.008,6,4]}/><meshStandardMaterial color="#4e5549" roughness={1}/></mesh>)}
    {[-1,1].map(side => <mesh key={side} position={[side*.065,1.18,.155]} rotation={[0,0,side*.42]}><boxGeometry args={[.105,.13,.025]}/><meshStandardMaterial color="#b2a09b" roughness={1}/></mesh>)}
    <mesh position={[0, .99, -.21]} castShadow><boxGeometry args={[.26, .33, .11]} /><meshStandardMaterial color="#977b55" roughness={1} /></mesh>
  </group>;
}
