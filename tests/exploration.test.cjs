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
