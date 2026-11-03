import type { Point } from "@/farm/game/world";

/** Shared by the walk controls, the physics bodies, and the tractor mesh. */
export const walk = {
  keys: { w: false, a: false, s: false, d: false, arrowup:false, arrowdown:false, arrowleft:false, arrowright:false },
  routeRequest: null as (Point & {label:string}) | null,
  route: [] as Point[],
  routeIndex: 0,
  routeLabel: "",
  routeStatus: "idle" as "idle" | "walking" | "arrived" | "blocked",
  cameraCut: true,
  driving: false,
  trailerX: -2.25,
  trailerZ: 5.5,
  trailerYaw: Math.PI / 2,
  trailerY: .22,
  vehicleSpeed: 0,
  trailerSpeed: 0,
  trailerInitialized: false,
  paused: false,
  toggleDrive: false,
  px: 0,
  pz: 8,
  tx: 0,
  tz: 0,
  yaw: Math.PI,
  vehicleYaw: Math.PI / 2,
  sprinting: false,
  moving: 0,
  travel: null as Point | null,
  stickX: 0,
  stickY: 0,
};

export const TRACTOR = { x: 0, z: 5.5 };

/** Clear transient input without moving the visitor or parked tractor. */
export function resetWalkInput() {
  for(const key of Object.keys(walk.keys) as (keyof typeof walk.keys)[])walk.keys[key]=false;
  walk.stickX = 0;
  walk.stickY = 0;
  walk.toggleDrive = false;
  walk.sprinting = false;
  walk.moving = 0;
  // An explicit request made inside Map survives the pause → resume handoff, like travel.
  walk.route = []; walk.routeIndex = 0; walk.routeStatus = "idle";
}

export const WALK_SPEED=4.5;
export const SPRINT_MULTIPLIER=1.6;

/** Camera orientation defines input; avatar facing never feeds back into steering. */
export function walkingMovement(forward: number, strafe: number, dt: number, sprint = false, cameraTurn = 0) {
  const length = Math.max(1, Math.hypot(forward, strafe));
  const distance = WALK_SPEED * (sprint ? SPRINT_MULTIPLIER : 1) * Math.min(Math.max(dt, 0), 0.05);
  const c=Math.cos(cameraTurn),s=Math.sin(cameraTurn);
  return { x: (strafe*c-forward*s)/length*distance, z: (-forward*c-strafe*s)/length*distance };
}

/** Radial analog input allows gentle motion in every direction, with a small jitter dead zone. */
export function movementInput() {
  if(walk.paused){resetWalkInput();return {forward:0,strafe:0};}
  const keys=walk.keys,length=Math.hypot(walk.stickX,walk.stickY);
  const strength=Math.max(0,Math.min(1,(length-.12)/.88));
  const x=length?walk.stickX/length*strength:0,y=length?walk.stickY/length*strength:0;
  return {
    forward:Number(keys.w||keys.arrowup)-Number(keys.s||keys.arrowdown)-y,
    strafe:Number(keys.d||keys.arrowright)-Number(keys.a||keys.arrowleft)+x,
  };
}
export function isMovementKey(key:string):key is keyof typeof walk.keys {
  return Object.hasOwn(walk.keys,key);
}

export function cancelWalkRoute() {
  walk.routeRequest=null;walk.route=[];walk.routeIndex=0;walk.routeStatus="idle";
}

/** World-space steering keeps guided walking independent of camera gestures. */
export function routeMovement(here:Point,dt:number) {
  while(walk.routeIndex<walk.route.length){
    const target=walk.route[walk.routeIndex],x=target.x-here.x,z=target.z-here.z,length=Math.hypot(x,z);
    if(length<.1){walk.routeIndex++;continue;}
    const step=Math.min(length,WALK_SPEED*(walk.sprinting?SPRINT_MULTIPLIER:1)*Math.min(Math.max(dt,0),.05));
    return {x:x/length*step,z:z/length*step};
  }
  if(walk.routeStatus==="walking"){walk.route=[];walk.routeIndex=0;walk.routeStatus="arrived";}
  return {x:0,z:0};
}
