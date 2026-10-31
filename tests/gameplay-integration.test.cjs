const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const THREE = require('three');
const { create, act } = require('@react-three/test-renderer');
const { useFrame, useThree } = require('@react-three/fiber');
const CameraControls = require('camera-controls').default;
global.self=globalThis;
global.requestAnimationFrame=callback=>setTimeout(callback,16);
global.cancelAnimationFrame=clearTimeout;
global.DOMRect=class {constructor(x=0,y=0,width=0,height=0){Object.assign(this,{x,y,width,height})}};
global.window=new EventTarget();
global.document=Object.assign(new EventTarget(),{hidden:false});
global.HTMLElement=class {};
global.IS_REACT_ACT_ENVIRONMENT=true;
CameraControls.install({THREE});
const originalResolve=Module._resolveFilename;
Module._resolveFilename=function(request,parent,...rest){return originalResolve.call(this,request.startsWith('@/')?path.resolve('src',request.slice(2)):request,parent,...rest)};
for(const ext of ['.ts','.tsx']) Module._extensions[ext]=function(module,filename){module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,filename)};
// Real camera-controls transforms; omit DOM event connection in this GPU-free test.
const Orbit=React.forwardRef(function Orbit(props,ref){
  const {camera}=useThree();const [controls]=React.useState(()=>new CameraControls(camera));
  controls.minDistance=props.minDistance;controls.maxDistance=props.maxDistance;
  React.useImperativeHandle(ref,()=>controls,[controls]);
  useFrame((_,dt)=>controls.update(dt),-1);
  return null;
});
// A CPU texture fixture checks material/UV wiring; it does not simulate GPU pixels.
const portraitTexture = new THREE.Texture({src:'/images/profile.jpeg'});
const originalLoad=Module._load;
Module._load=function(request,...rest){return request==='@react-three/drei'?{CameraControls:Orbit,useTexture:()=>portraitTexture}:originalLoad.call(this,request,...rest)};
const { CameraRig }=require('../src/components/farm/scene/CameraRig.tsx');
const { PhysicsYard }=require('../src/components/farm/scene/explore.tsx');
const { walk, resetWalkInput }=require('../src/components/farm/scene/walk-state.ts');
function reset(){resetWalkInput();Object.assign(walk,{px:0,pz:8,tx:0,tz:0,yaw:Math.PI,vehicleYaw:Math.PI/2,driving:false,paused:false,travel:null,cameraCut:true})}

// The test renderer batches subscribers across frames. Step one frame at a time
// so physics/camera callbacks interleave exactly as they do in the real render loop.
async function frames(renderer,count,delta){for(let i=0;i<count;i++) await renderer.advanceFrames(1,delta);}

test('orbit yields camera ownership to walking; follow settles instead of being reset every frame',async()=>{
  reset();const camera=new THREE.PerspectiveCamera(45,1,.1,240);
  const props={walking:false,paused:false,reducedMotion:false,focus:null};
  const renderer=await create(React.createElement(CameraRig,props),{camera});
  await frames(renderer,4,1/60);
  assert.ok(camera.position.distanceTo(new THREE.Vector3(34,25,39))<.01);
  await renderer.update(React.createElement(CameraRig,{...props,walking:true}));
  await frames(renderer,120,1/60);
  assert.ok(camera.position.distanceTo(new THREE.Vector3(0,3.2,14.2))<.01,'walking camera reaches the visitor');
  walk.px=30;walk.pz=30;
  await frames(renderer,120,1/60);
  assert.ok(camera.position.distanceTo(new THREE.Vector3(30,3.2,36.2))<.01,'follow is not pulled back to orbit');
  const before=camera.position.clone();
  await renderer.update(React.createElement(CameraRig,{...props,walking:true,paused:true}));
  walk.px=30;await frames(renderer,10,1/60);assert.ok(camera.position.equals(before));
  await renderer.update(React.createElement(CameraRig,props));await frames(renderer,2,1/60);
  assert.ok(camera.position.distanceTo(new THREE.Vector3(34,25,39))<.01);
  await renderer.unmount();
});

async function yard(){
  const renderer=await create(React.createElement(React.Suspense,{fallback:null},React.createElement(PhysicsYard,{paused:false})));
  for(let i=0;i<200;i++){
    if(renderer.scene.findAll(n=>n.instance.name==='farm-visitor-body').length) return renderer;
    await act(async()=>{await new Promise(resolve=>setTimeout(resolve,10))});
  }
  await renderer.unmount();throw Error('Rapier did not initialize');
}

test('actual visitor and tractor keep settled height across moving UI rerenders',async()=>{
  reset();const renderer=await yard();
  await frames(renderer,90,1/60);
  const visitor=renderer.scene.findByProps({name:'farm-visitor-body'}).instance;
  const tractor=renderer.scene.findByProps({name:'farm-tractor-body'}).instance;
  assert.ok(visitor.position.y>.65&&visitor.position.y<.73);
  const settled=visitor.position.y;
  walk.stickX=1;await frames(renderer,30,1/60);walk.stickX=0;
  const x=walk.px;
  await renderer.update(React.createElement(React.Suspense,{fallback:null},React.createElement(PhysicsYard,{paused:false})));
  assert.ok(Math.abs(visitor.position.y-settled)<.005,'rerender must not relaunch visitor at spawn height');
  assert.ok(Math.abs(visitor.position.x-x)<.07,'rerender must not rewind horizontal movement');
  walk.driving=true;walk.stickY=-1;await frames(renderer,20,1/60);walk.stickY=0;
  const tractorY=tractor.position.y;
  await renderer.update(React.createElement(React.Suspense,{fallback:null},React.createElement(PhysicsYard,{paused:false})));
  assert.ok(Math.abs(tractor.position.y-tractorY)<.005,'rerender must not relaunch moving tractor');
  await renderer.unmount();
});

test('walking distance stays stable at 30, 60 and 120 render frames per second',async()=>{
  const distances=[];
  for(const fps of [30,60,120]){
    reset();walk.px=30;walk.pz=30;
    const renderer=await yard();await frames(renderer,20,1/60);
    walk.stickX=1;const start=walk.px;
    await frames(renderer,fps,1/fps);distances.push(walk.px-start);
    walk.stickX=0;await renderer.unmount();
  }
  for(const d of distances) assert.ok(Math.abs(d-3.6)<.07,`one second must move 3.6 units, measured ${d}`);
});

function key(type,key){const event=new Event(type);Object.defineProperty(event,'key',{value:key});window.dispatchEvent(event)}
test('real input stops on key release and pause; tractor and travel remain controllable',async()=>{
  reset();walk.px=30;walk.pz=30;
  const renderer=await yard();await frames(renderer,20,1/60);
  key('keydown','w');await frames(renderer,30,1/60);key('keyup','w');
  assert.ok(walk.pz<28.3,'W moves forward');
  const stopped=walk.pz;await frames(renderer,20,1/60);assert.ok(Math.abs(walk.pz-stopped)<.01,'release stops walking');
  key('keydown','w');walk.paused=true;
  await renderer.update(React.createElement(React.Suspense,{fallback:null},React.createElement(PhysicsYard,{paused:true})));
  assert.equal(walk.keys.w,false,'pause clears held keyboard input');
  walk.paused=false;
  await renderer.update(React.createElement(React.Suspense,{fallback:null},React.createElement(PhysicsYard,{paused:false})));
  await frames(renderer,20,1/60);assert.ok(Math.abs(walk.pz-stopped)<.01,'resume does not keep stale W');
  walk.travel={x:0,z:7.5};await frames(renderer,3,1/60);
  assert.ok(Math.hypot(walk.px,walk.pz-7.5)<.01);assert.equal(walk.travel,null);
  key('keydown','f');await frames(renderer,2,1/60);key('keyup','f');assert.equal(walk.driving,true);
  key('keydown','w');await frames(renderer,30,1/60);key('keyup','w');assert.ok(walk.tx>1,'tractor responds to W');
  const parked=walk.tx;await frames(renderer,20,1/60);assert.ok(Math.abs(walk.tx-parked)<.05,'release brakes tractor');
  key('keydown','f');await frames(renderer,3,1/60);key('keyup','f');assert.equal(walk.driving,false);
  const visitor=renderer.scene.findByProps({name:'farm-visitor-body'}).instance;
  assert.ok(visitor.position.y>.65&&visitor.position.y<.73,'exit stays near ground instead of dropping from the air');
  await renderer.unmount();
});


test('walking zoom changes the actual camera distance without losing follow ownership',async()=>{
  reset();walk.px=30;walk.pz=25;
  const { cameraView, setCameraDistance, resetCameraView } = require('../src/components/farm/scene/camera-view.ts');
  resetCameraView();
  const camera=new THREE.PerspectiveCamera(45,1,.1,240);
  const renderer=await create(React.createElement(CameraRig,{walking:true,paused:false,reducedMotion:false,focus:null}),{camera});
  const target=new THREE.Vector3(30,1.1,25);
  try {
    await frames(renderer,2,1/60);
    const normal=camera.position.distanceTo(target);
    setCameraDistance(3.4);await frames(renderer,120,1/60);
    assert.ok(camera.position.distanceTo(target)<normal*.6);
    setCameraDistance(16);await frames(renderer,120,1/60);
    assert.ok(camera.position.distanceTo(target)>normal*2.5);
    cameraView.turn=Math.PI;await frames(renderer,120,1/60);
    assert.ok(camera.position.z<25,'turning lets the visitor see the portrait from the front');
  } finally { await renderer.unmount();resetCameraView(); }
});


test('orbit zoom also moves the real camera-controls rig within its limits',async()=>{
  reset();const { setCameraDistance, resetCameraView }=require('../src/components/farm/scene/camera-view.ts');
  resetCameraView();const camera=new THREE.PerspectiveCamera(45,1,.1,240);
  const renderer=await create(React.createElement(CameraRig,{walking:false,paused:false,reducedMotion:true,focus:null}),{camera});
  const target=new THREE.Vector3(0,1.2,0);
  try {
    await frames(renderer,2,1/60);const original=camera.position.distanceTo(target);
    setCameraDistance(1.8);await frames(renderer,120,1/60);assert.ok(camera.position.distanceTo(target)<original*.35);
    setCameraDistance(16);await frames(renderer,120,1/60);assert.ok(camera.position.distanceTo(target)<=85.01);assert.ok(camera.position.distanceTo(target)>original);
  } finally { await renderer.unmount();resetCameraView(); }
});
