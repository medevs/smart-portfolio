import { distance, ORCHARD_TREES, type Point } from "@/farm/game/world";
import { safeSpawn, YARD_BUILDINGS } from "./yard-boundaries";

export type WalkingObstacle = Point & { radius: number };
const LIMIT = 43, WIDTH = LIMIT * 2 + 1;
const size = WIDTH * WIDTH;
const pointAt = (id:number):Point => ({x:id % WIDTH-LIMIT,z:Math.floor(id/WIDTH)-LIMIT});
const idAt = (x:number,z:number) => (z+LIMIT)*WIDTH+x+LIMIT;
const ground = Uint8Array.from({length:size},(_,id)=>Number(safeSpawn(pointAt(id))));

/** One bounded search per request; no pathfinding or scene traversal in the render loop. */
export function findWalkingRoute(from:Point,to:Point,obstacles:WalkingObstacle[]=[]):Point[] | null {
  if(![from.x,from.z,to.x,to.z].every(Number.isFinite)||!safeSpawn(to))return null;
  const avoid=obstacles;
  const clear=(point:Point)=>safeSpawn(point)&&avoid.every(obstacle=>distance(point,obstacle)>obstacle.radius);
  const line=(a:Point,b:Point)=>walkingSegmentClear(a,b,avoid,a.x===from.x&&a.z===from.z);
  if(!safeSpawn(from)||!clear(to))return null;
  if(line(from,to))return [{...to}];
  const open=Uint8Array.from(ground,(value,id)=>value&&avoid.every(obstacle=>distance(pointAt(id),obstacle)>obstacle.radius)?1:0);
  const anchor=(p:Point)=>{
    const candidates:number[]=[];
    for(let z=Math.max(-LIMIT,Math.floor(p.z)-2);z<=Math.min(LIMIT,Math.ceil(p.z)+2);z++)
      for(let x=Math.max(-LIMIT,Math.floor(p.x)-2);x<=Math.min(LIMIT,Math.ceil(p.x)+2);x++)if(open[idAt(x,z)])candidates.push(idAt(x,z));
    return candidates.sort((a,b)=>distance(p,pointAt(a))-distance(p,pointAt(b))).find(id=>line(p,pointAt(id)));
  };
  const start=anchor(from),end=anchor(to);
  if(start===undefined||end===undefined)return null;
  const costs=new Float64Array(size).fill(Infinity),parent=new Int32Array(size).fill(-1),closed=new Uint8Array(size);
  const heap:{id:number;score:number}[]=[];
  const push=(id:number,score:number)=>{
    const entry={id,score};let i=heap.length;heap.push(entry);
    while(i>0){const p=(i-1)>>1;if(heap[p].score<=score)break;heap[i]=heap[p];i=p;}heap[i]=entry;
  };
  const pop=()=>{
    const first=heap[0],last=heap.pop()!;
    if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1].score<heap[c].score)c++;if(heap[c].score>=last.score)break;heap[i]=heap[c];i=c;}heap[i]=last;}
    return first.id;
  };
  costs[start]=0;push(start,distance(pointAt(start),pointAt(end)));
  while(heap.length){
    const id=pop();if(closed[id])continue;closed[id]=1;
    if(id===end){
      const points:Point[]=[{...to}];let cursor=end;
      while(cursor!==-1){points.push(pointAt(cursor));cursor=parent[cursor];}points.push({...from});points.reverse();
      const route:Point[]=[];let i=0;
      while(i<points.length-1){let next=points.length-1;while(next>i+1&&!line(points[i],points[next]))next--;route.push(points[next]);i=next;}
      return route;
    }
    const p=pointAt(id);
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
      if(!dx&&!dz)continue;const x=p.x+dx,z=p.z+dz;
      if(Math.abs(x)>LIMIT||Math.abs(z)>LIMIT)continue;
      const next=idAt(x,z);
      if(!open[next]||closed[next]||dx&&dz&&(!open[idAt(p.x+dx,p.z)]||!open[idAt(p.x,p.z+dz)]))continue;
      // Check continuous clearance too, including gaps between orchard trunks.
      if(!line(p,pointAt(next)))continue;
      const cost=costs[id]+Math.hypot(dx,dz);
      if(cost>=costs[next])continue;costs[next]=cost;parent[next]=id;push(next,cost+distance(pointAt(next),pointAt(end)));
    }
  }
  return null;
}

const trunks=ORCHARD_TREES.map(tree=>({...tree,radius:.56}));
const rectangles=[...YARD_BUILDINGS.map(block=>({x:block.position[0],z:block.position[2],rx:block.args[0]+.41,rz:block.args[2]+.41})),{x:-12.5,z:3.4,rx:1.19,rz:1.19}];

/** Exact segment tests prevent a smoothed route from clipping a building corner. */
export function walkingSegmentClear(a:Point,b:Point,obstacles:WalkingObstacle[]=[],escaping=false) {
  for(const rect of rectangles){
    let enter=0,exit=1,intersects=true;
    for(const axis of ["x","z"] as const){
      const radius=axis==="x"?rect.rx:rect.rz,delta=b[axis]-a[axis],min=rect[axis]-radius,max=rect[axis]+radius;
      if(Math.abs(delta)<1e-10){if(a[axis]<min||a[axis]>max){intersects=false;break;}continue;}
      const t1=(min-a[axis])/delta,t2=(max-a[axis])/delta;
      enter=Math.max(enter,Math.min(t1,t2));exit=Math.min(exit,Math.max(t1,t2));
      if(enter>exit){intersects=false;break;}
    }
    if(intersects)return false;
  }
  const dx=b.x-a.x,dz=b.z-a.z,lengthSquared=dx*dx+dz*dz;
  for(const circle of [...trunks,...obstacles]){
    // A visitor beside a parked vehicle may start within its conservative circle.
    // Permit only the first outward segment, retaining the obstacle for the rest of the route.
    if(escaping&&distance(a,circle)<=circle.radius&&distance(b,circle)>circle.radius&&(a.x-circle.x)*dx+(a.z-circle.z)*dz>=0)continue;
    const t=lengthSquared?Math.max(0,Math.min(1,((circle.x-a.x)*dx+(circle.z-a.z)*dz)/lengthSquared)):0;
    if(Math.hypot(a.x+dx*t-circle.x,a.z+dz*t-circle.z)<=circle.radius)return false;
  }
  return true;
}
