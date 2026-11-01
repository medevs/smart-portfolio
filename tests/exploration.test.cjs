const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module'), ts = require('typescript');
const THREE = require('three');
const resolve = Module._resolveFilename;
Module._resolveFilename=function(request,parent,...rest){return resolve.call(this,request.startsWith('@/')?path.resolve('src',request.slice(2)):request,parent,...rest)};
for(const extension of ['.ts','.tsx']) Module._extensions[extension]=function(module,filename){module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,filename)};
const {FIELD_NOTES,discover}=require('../src/farm/game/discoveries.ts');
const {destination}=require('../src/farm/game/world.ts');
const {freshProfile,parseProfile}=require('../src/farm/game/save.ts');
const {cameraView,zoomCamera,setCameraDistance,resetCameraView,keepCameraClear,bindFollowCamera}=require('../src/components/farm/scene/camera-view.ts');

test('field notes require physical proximity and persist independently of the farm activity loop',()=>{
  let found=[];
  for(const note of FIELD_NOTES){
    const point=destination(note.id);
    assert.equal(discover(found,note.id,{x:40,z:40},true).changed,false);
    assert.equal(discover(found,note.id,point,false).changed,false);
    const result=discover(found,note.id,point,true);
    assert.equal(result.changed,true);found=result.found;
    assert.equal(discover(found,note.id,point,true).changed,false);
  }
  const profile=freshProfile();profile.discoveries=found;
  assert.deepEqual(parseProfile(JSON.stringify(profile)).discoveries,found);
  assert.deepEqual(profile.progress.completed,[],'discoveries cannot fabricate ordered farming rewards');
  delete profile.discoveries;
  assert.deepEqual(parseProfile(JSON.stringify(profile)).discoveries,[],'old saves remain compatible');
  profile.discoveries=['apiary','unknown','apiary'];
  assert.deepEqual(parseProfile(JSON.stringify(profile)).discoveries,['apiary']);
});

test('zoom stays bounded and obstacle clipping stops the camera before a building',()=>{
  resetCameraView();zoomCamera(-100);assert.equal(cameraView.distance,1.8);
  zoomCamera(100);assert.equal(cameraView.distance,16);
  setCameraDistance(NaN);assert.equal(cameraView.distance,16);
  const target=new THREE.Vector3(0,1.1,4),desired=new THREE.Vector3(0,3.2,-5);
  keepCameraClear(target,desired);
  assert.ok(desired.z>0,'camera stops in front of the workshop');
  resetCameraView();
});

class CanvasTarget extends EventTarget {
  captures=new Set();
  ownerDocument={defaultView:new EventTarget()};
  setPointerCapture(id){this.captures.add(id)}
  hasPointerCapture(id){return this.captures.has(id)}
  releasePointerCapture(id){this.captures.delete(id)}
}
function send(canvas,type,values){const e=new Event(type,{cancelable:true});for(const [key,value]of Object.entries(values))Object.defineProperty(e,key,{value});canvas.dispatchEvent(e);return e;}
test('real wheel, drag and pinch handlers zoom/turn and release captured gestures on pause',()=>{
  resetCameraView();const canvas=new CanvasTarget(),cleanup=bindFollowCamera(canvas);
  const wheel=send(canvas,'wheel',{deltaY:-100,deltaMode:0});assert.equal(wheel.defaultPrevented,true);assert.ok(cameraView.distance<6.2);
  send(canvas,'pointerdown',{button:0,pointerId:1,clientX:0,clientY:0});
  send(canvas,'pointermove',{pointerId:1,clientX:20,clientY:0});assert.ok(cameraView.turn<0);
  send(canvas,'pointerdown',{button:0,pointerId:2,clientX:120,clientY:0});
  const before=cameraView.distance;
  send(canvas,'pointermove',{pointerId:2,clientX:220,clientY:0});assert.ok(cameraView.distance<before,`spreading two fingers zooms in: ${before} -> ${cameraView.distance}`);
  canvas.ownerDocument.defaultView.dispatchEvent(new Event('blur'));
  assert.equal(canvas.captures.size,0,'focus loss releases a camera gesture');
  const turn=cameraView.turn;
  send(canvas,'pointermove',{pointerId:1,clientX:100,clientY:0});assert.equal(cameraView.turn,turn);
  cleanup();assert.equal(canvas.captures.size,0);
  const pausedDistance=cameraView.distance;send(canvas,'wheel',{deltaY:100,deltaMode:0});assert.equal(cameraView.distance,pausedDistance);
  resetCameraView();
});


test('standing beneath an orchard crown keeps the close camera outside its leaves',()=>{
  const {ORCHARD_TREES}=require('../src/farm/game/world.ts');
  const tree=ORCHARD_TREES[0];
  const target=new THREE.Vector3(tree.x+.8,1.1,tree.z);
  const desired=new THREE.Vector3(tree.x-.9,1.7,tree.z);
  const crown=new THREE.Sphere(new THREE.Vector3(tree.x,2.1,tree.z),1.35);
  assert.equal(crown.containsPoint(target),true);
  assert.equal(crown.containsPoint(desired),true);
  keepCameraClear(target,desired);
  assert.equal(crown.containsPoint(desired),false,'camera must exit the canopy, not stop inside it');
});


test('weather saves validate new preferences without discarding old progress',()=>{
  const profile=freshProfile();profile.discoveries=['apiary'];
  for(const weather of ['clear','breeze','rain']) {
    profile.preferences.weather=weather;
    assert.equal(parseProfile(JSON.stringify(profile)).preferences.weather,weather);
  }
  for(const weather of ['storm',null,{},42]) {
    profile.preferences.weather=weather;
    const restored=parseProfile(JSON.stringify(profile));
    assert.equal(restored.preferences.weather,'clear');assert.deepEqual(restored.discoveries,['apiary']);
  }
  delete profile.preferences.weather;
  assert.equal(parseProfile(JSON.stringify(profile)).preferences.weather,'clear');
});

test('waypoint compass uses map north and handles all eight directions and arrival',()=>{
  const {waypointBearing}=require('../src/farm/game/world.ts');
  for(const [x,z,label] of [[0,-10,'N'],[10,-10,'NE'],[10,0,'E'],[10,10,'SE'],[0,10,'S'],[-10,10,'SW'],[-10,0,'W'],[-10,-10,'NW']]) assert.equal(waypointBearing({x:0,z:0},{x,z}),label);
  assert.equal(waypointBearing({x:4,z:9},{x:4,z:9}),'Nearby');
});

test('hidden tabs stop rendering, clear held controls and detach lifecycle listeners',()=>{
  const {bindRenderVisibility}=require('../src/components/farm/scene/render-lifecycle.ts');
  const doc=new EventTarget();doc.hidden=false;const modes=[];let cleared=0;
  const dispose=bindRenderVisibility(doc,mode=>modes.push(mode),()=>cleared++);
  doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));
  doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(modes,['always','never','always']);assert.equal(cleared,3);
  dispose();doc.dispatchEvent(new Event('visibilitychange'));assert.equal(modes.length,3);
});


test('tour links select only known stops and cannot create progress or unsafe camera views',()=>{
  const {TOUR_STOPS,tourIndex,tourPath}=require('../src/farm/game/tour.ts');
  const profile=freshProfile(),before=JSON.stringify(profile);
  assert.equal(tourIndex(null),-1);assert.equal(tourIndex('unknown'),-1);
  for(const [i,stop] of TOUR_STOPS.entries()) {
    assert.equal(tourIndex(stop.id),i);
    assert.equal(tourPath(i),`/?tour=${stop.id}`);
    assert.ok(destination(stop.id));
    assert.ok(stop.eye.every(Number.isFinite)&&stop.target.every(Number.isFinite));
    assert.ok(stop.eye[1]>=7,'tour eyes clear low buildings');
    assert.ok(new THREE.Vector3(...stop.eye).distanceTo(new THREE.Vector3(...stop.target))>5);
    assert.ok(fs.existsSync(path.join('public',stop.image)));
  }
  assert.equal(tourPath(-90),tourPath(0));assert.equal(tourPath(NaN),tourPath(0));
  assert.equal(tourPath(999),tourPath(TOUR_STOPS.length-1));
  assert.equal(JSON.stringify(profile),before,'browsing a tour cannot grant discoveries or activities');
});

test('unsupported WebGL recovers before constructing Three without hiding other renderer errors',()=>{
  const {farmContext}=require('../src/components/farm/scene/webgl-context.ts');
  const calls=[],context={};
  const canvas={getContext(...args){calls.push(args);return context}};
  assert.equal(farmContext(canvas,true),context);
  assert.equal(calls[0][0],'webgl2');assert.equal(calls[0][1].antialias,false);
  farmContext(canvas,false);assert.equal(calls[1][1].antialias,true);
  assert.equal(farmContext({getContext(){return null}},false),null);
  assert.equal(farmContext({getContext(){throw Error('unsupported')}},false),null);
});
