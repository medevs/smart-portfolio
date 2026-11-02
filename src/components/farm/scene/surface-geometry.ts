import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { landNoise } from "./natural-geometry";

/** Wear is strongest on exposed edges; paint stays nonmetallic and softly rough. */
export function agedMetalGeometry(size:[number,number,number],paint:string) {
  const g=new RoundedBoxGeometry(...size,2,Math.min(.025,...size.map(n=>n/5))),p=g.attributes.position;
  const base=new THREE.Color(paint),steel=new THREE.Color("#8b8878"),rust=new THREE.Color("#805b3e"),colors:number[]=[];
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    const axes=[Math.abs(x)/size[0]*2,Math.abs(y)/size[1]*2,Math.abs(z)/size[2]*2].sort((a,b)=>b-a);
    const grain=landNoise(x*31+8,z*27+y*17),wear=THREE.MathUtils.smoothstep(axes[1],.78,.98)*(.22+grain*.5);
    const stain=THREE.MathUtils.smoothstep(landNoise(x*9+2,z*8+y*7),.57,.83)*.4;
    const c=base.clone().lerp(rust,stain).lerp(steel,wear).multiplyScalar(.94+grain*.1);colors.push(c.r,c.g,c.b);
  }
  g.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));return g;
}

const side=128,data=new Uint8Array(side*side*4);
for(let y=0;y<side;y++)for(let x=0;x<side;x++){
  const noise=landNoise(x*.65,y*.65),scratch=Math.sin(x*2.9+y*.03)>.96?.1:0;
  const value=Math.round((.75+noise*.2-scratch)*255),i=(y*side+x)*4;
  data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
}
export const paintRoughness=new THREE.DataTexture(data,side,side,THREE.RGBAFormat);
paintRoughness.wrapS=paintRoughness.wrapT=THREE.RepeatWrapping;
paintRoughness.minFilter=THREE.LinearMipmapLinearFilter;paintRoughness.magFilter=THREE.LinearFilter;paintRoughness.generateMipmaps=true;paintRoughness.needsUpdate=true;
