"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { walk } from "./walk-state";

/** A single draw call; rebuild only when a route or its next corner changes. */
export function WalkingTrail() {
  const mesh=useRef<THREE.InstancedMesh>(null);
  const previous=useRef({route:walk.route,index:-1});
  const matrix=useMemo(()=>new THREE.Matrix4(),[]);
  useFrame(()=>{
    const trail=mesh.current;if(!trail)return;
    if(previous.current.route===walk.route&&previous.current.index===walk.routeIndex)return;
    previous.current={route:walk.route,index:walk.routeIndex};let count=0;
    if(walk.routeStatus==="walking"){
      let from={x:walk.px,z:walk.pz};
      for(const target of walk.route.slice(walk.routeIndex)){
        const length=Math.hypot(target.x-from.x,target.z-from.z),steps=Math.max(1,Math.ceil(length/1.1));
        for(let i=1;i<=steps&&count<192;i++){
          matrix.makeTranslation(from.x+(target.x-from.x)*i/steps,.16,from.z+(target.z-from.z)*i/steps);
          trail.setMatrixAt(count++,matrix);
        }
        from=target;
      }
    }
    trail.count=count;trail.instanceMatrix.needsUpdate=true;
  });
  return <instancedMesh ref={mesh} args={[undefined,undefined,192]} count={0} frustumCulled={false} name="guided-walking-trail">
    <sphereGeometry args={[.065,6,4]}/><meshBasicMaterial color="#edce90" toneMapped={false}/>
  </instancedMesh>;
}
