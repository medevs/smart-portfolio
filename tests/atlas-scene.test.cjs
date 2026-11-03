const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
// Three's renderer teardown requires the browser animation host even in the GPU-free test renderer.
global.requestAnimationFrame = callback => setTimeout(callback, 16);
global.cancelAnimationFrame = clearTimeout;
global.self = globalThis;
const THREE = require('three');
const { create } = require('@react-three/test-renderer');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest);
};
for (const extension of ['.ts', '.tsx']) Module._extensions[extension] = function(module, filename) {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
};
// This renderer checks the actual Three scene graph without a GPU. HTML labels
// are covered by browser checks, so omit their separate React DOM portals here.
const portraitTexture = new THREE.Texture({src:"/images/profile.jpeg"});
const scanFixtures=new Map();
const pendingScan=new Promise(()=>{});
const originalLoad = Module._load;
Module._load = function(request, ...rest) {
  const loaded = originalLoad.call(this, request, ...rest);
  return request === '@react-three/drei' ? { ...loaded, Html: () => null, useTexture: () => portraitTexture, useGLTF: url=>{const scene=scanFixtures.get(url);if(!scene)throw pendingScan;return {scene};} } : loaded;
};
global.IS_REACT_ACT_ENVIRONMENT = true;
const { AtlasLandscape } = require('../src/components/farm/scene/MiddleAtlas.tsx');
const { Visitor } = require('../src/components/farm/scene/Visitor.tsx');
const { GameWorld } = require('../src/components/farm/scene/GameWorld.tsx');
const { MODELS } = require('../src/components/farm/scene/models.tsx');
const { loadFarm, placePlots } = require('../src/farm/loadFarm.ts');
const { plotPosition } = require('../src/farm/world.ts');

test('existing scanned basket and watering can decode to grounded, unmodified real geometry',async()=>{
  const {GLTFLoader}=require('three/examples/jsm/loaders/GLTFLoader.js');
  const {MeshoptDecoder}=require('three/examples/jsm/libs/meshopt_decoder.module.js');
  const {groundedModel}=require('../src/components/farm/scene/prop-geometry.ts');
  for(const file of ['wicker_basket_01','watering_can_metal_01']){
    const loader=new GLTFLoader();loader.setMeshoptDecoder(MeshoptDecoder);
    // Decode actual meshopt geometry. GPU WebP decoding is replaced only for this CPU check.
    loader.register(()=>({name:'EXT_texture_webp',loadTexture:()=>Promise.resolve(new THREE.Texture())}));
    const bytes=fs.readFileSync(`public/farm/models/${file}.glb`);
    const asset=await new Promise((resolve,reject)=>loader.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'',resolve,reject));
    const before=new THREE.Box3().setFromObject(asset.scene);
    const object=groundedModel(asset.scene,.23),box=new THREE.Box3().setFromObject(object),size=box.getSize(new THREE.Vector3()),centre=box.getCenter(new THREE.Vector3());
    assert.ok(Math.abs(size.y-.23)<1e-5);assert.ok(Math.abs(box.min.y)<1e-5);assert.ok(Math.hypot(centre.x,centre.z)<1e-5);
    assert.ok(new THREE.Box3().setFromObject(asset.scene).equals(before),'cached source is never translated or scaled');
    let vertices=0;object.traverse(node=>{if(node.isMesh){vertices+=node.geometry.attributes.position.count;for(const n of node.geometry.attributes.position.array)assert.ok(Number.isFinite(n));assert.ok(node.material.map,'local scan retains material maps');}});
    assert.ok(vertices>5000,'uses the detailed existing scan, not a primitive stand-in');
    scanFixtures.set(`/farm/models/${file}.glb`,asset.scene);
  }
});

test('expanded agricultural world constructs finite geometry with instanced planting', async () => {
  const renderer = await create(React.createElement(AtlasLandscape, { night: false }));
  const instances = renderer.scene.findAll(node => node.instance.isInstancedMesh);
  for (const [name,count] of [['orchard-trunk',48],['orchard-canopy',48],['orchard-apple',240],['orchard-crop',240],['orchard-wall',4]]) assert.equal(renderer.scene.findByProps({name}).instance.count,count);
  assert.ok(instances.some(node=>node.instance.name==='limestone-courses'),'buildings have staggered stonework');
  const bounds = new THREE.Box3().setFromObject(renderer.scene.instance);
  assert.ok(bounds.min.x < -30 && bounds.max.z > 29, 'orchard extends beyond the original yard');
  const meshes = renderer.scene.findAll(node => node.instance.isMesh);
  for (const node of meshes) {
    const geometry = node.instance.geometry;
    for (const value of geometry.attributes.position.array) assert.ok(Number.isFinite(value));
    for (const value of node.instance.matrixWorld.elements) assert.ok(Number.isFinite(value));
  }
  await renderer.unmount();
});

test('every existing farm item still mounts a 3D model at its stable plot', async t => {
  const farm = await loadFarm();
  const placed = placePlots(farm);
  for (const entry of placed) assert.equal(typeof MODELS[entry.item.sprite], 'function', entry.item.sprite);
  const renderer = await create(React.createElement('group', null, placed.map(entry => React.createElement('group', {
    key: entry.plot.id, name: entry.plot.id, position: plotPosition(entry.plot, farm.grid)
  }, React.createElement(MODELS[entry.item.sprite], { night: false, cols: entry.plot.cols, rows: entry.plot.rows })))));
  for (const id of ['about', 'reelstyles', 'mentorclone', 'talkthedoc', 'tractor', 'donkey']) {
    const node = renderer.scene.findByProps({ name: id });
    assert.ok(node.instance.children.length > 0, `${id} has real 3D geometry`);
  }
  assert.ok(renderer.scene.findAll(node => node.instance.isMesh).length < 800, 'catalogue detail stays inside the yard mesh budget');
  t.diagnostic(`Core yard mesh count: ${renderer.scene.findAll(node => node.instance.isMesh).length}`);
  await renderer.advanceFrames(3, 1 / 60);
  await renderer.unmount();
  const catalogue=await create(React.createElement('group',null,Object.entries(MODELS).map(([key,Model])=>React.createElement(Model,{key,night:false}))));
  for(const node of catalogue.scene.findAll(n=>n.instance.isMesh))for(const value of node.instance.geometry.attributes.position.array)assert.ok(Number.isFinite(value));
  assert.equal(Object.keys(MODELS).length,31);await catalogue.unmount();
});

test('real Rapier collisions keep walking and driving inside the visible land', async () => {
  const RAPIER = require('@dimforge/rapier3d-compat');
  await RAPIER.init();
  const { GROUND_HALF, YARD_LIMIT, YARD_WALLS } = require('../src/components/farm/scene/yard-boundaries.ts');
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.createCollider(RAPIER.ColliderDesc.cuboid(GROUND_HALF, .3, GROUND_HALF).setTranslation(0, -.3, 0));
  for (const wall of YARD_WALLS) world.createCollider(RAPIER.ColliderDesc.cuboid(...wall.args).setTranslation(...wall.position));
  const person = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(YARD_LIMIT - 1, 1, 0));
  const capsule = world.createCollider(RAPIER.ColliderDesc.capsule(.38, .28), person);
  const controller = world.createCharacterController(.04);
  for (let i = 0; i < 90; i++) {
    controller.computeColliderMovement(capsule, { x: .1, y: -.03, z: 0 });
    const move = controller.computedMovement(), here = person.translation();
    person.setNextKinematicTranslation({ x: here.x + move.x, y: here.y + move.y, z: here.z + move.z });
    world.step();
  }
  assert.ok(person.translation().x < YARD_LIMIT && person.translation().x > YARD_LIMIT - .5);
  assert.ok(person.translation().y > .6, 'character remains supported by the ground');
  const tractor = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, .5, YARD_LIMIT - 2).lockRotations());
  world.createCollider(RAPIER.ColliderDesc.cuboid(.5, .4, .85), tractor);
  for (let i = 0; i < 120; i++) {
    tractor.setLinvel({ x: 0, y: tractor.linvel().y, z: 7 }, true);
    world.step();
  }
  assert.ok(tractor.translation().z < YARD_LIMIT && tractor.translation().z > YARD_LIMIT - 1.4);
  assert.ok(tractor.translation().y > .3);
  world.free();
});


test('visitor and completed activity results construct actual finite Three geometry', async () => {
  const renderer = await create(React.createElement('group', null,
    React.createElement(Visitor), React.createElement(GameWorld, {progress:{completed:['studio','well','garden','orchard','table'],water:2,apples:0},waypoint:'garden'})));
  for (const name of ['watering-can','watered-garden','shared-apples']) assert.ok(renderer.scene.findByProps({name}).instance.children.length);
  for (const node of renderer.scene.findAll(node=>node.instance.isMesh)) {
    for (const n of node.instance.geometry.attributes.position.array) assert.ok(Number.isFinite(n));
  }
  await renderer.advanceFrames(3,1/60);await renderer.unmount();
});


test('maker avatar maps the existing portrait onto finite curved face geometry',async()=>{
  const renderer = await create(React.createElement(Visitor));
  const face=renderer.scene.findByProps({name:'maker-portrait-face'}).instance;
  assert.equal(face.material.map.image.src, '/images/profile.jpeg');
  assert.equal(face.material.map.colorSpace, THREE.SRGBColorSpace);
  assert.ok(face.geometry.attributes.position.count>300);
  for(const value of face.geometry.attributes.uv.array) assert.ok(Number.isFinite(value)&&value>=0&&value<=1);
  assert.ok(fs.statSync('public/images/profile.jpeg').size>0);
  assert.ok(renderer.scene.findByProps({name:'maker-head'}).instance.children.length>20);
  await renderer.unmount();
});


test('farm details animate from the shared clock and stay still when it is paused',async()=>{
  const { FarmLife }=require('../src/components/farm/scene/FarmLife.tsx');
  const { gameClock, advanceWorld }=require('../src/farm/game/clock.ts');
  const saved={...gameClock};
  Object.assign(gameClock,{seconds:0,paused:false,reduced:false});
  const renderer=await create(React.createElement(FarmLife));
  try {
    await renderer.advanceFrames(1,1/60);
    const water=renderer.scene.findByProps({name:'flowing-seguia'}).instance;
    const bee=renderer.scene.findByProps({name:'orchard-bees'}).instance;
    const matrix=new THREE.Matrix4(); water.getMatrixAt(0,matrix);
    const initial=matrix.elements[14];
    assert.equal(water.count,18); assert.equal(bee.count,8);
    assert.equal(water.children.length,0,'water uses one instanced draw instead of 18 meshes');
    advanceWorld(.05);await renderer.advanceFrames(1,1/60);
    water.getMatrixAt(0,matrix); assert.notEqual(matrix.elements[14],initial);
    gameClock.paused=true;bee.getMatrixAt(0,matrix);const still=matrix.clone();
    advanceWorld(1);await renderer.advanceFrames(1,1/60);bee.getMatrixAt(0,matrix);assert.ok(matrix.equals(still));
    for(const node of renderer.scene.findAll(n=>n.instance.isMesh)) for(const value of node.instance.geometry.attributes.position.array) assert.ok(Number.isFinite(value));
  } finally { await renderer.unmount();Object.assign(gameClock,saved); }
});


test('very close obstruction views hide the avatar instead of filling the camera with its torso',async()=>{
  const {walk}=require('../src/components/farm/scene/walk-state.ts');
  const saved={px:walk.px,pz:walk.pz,driving:walk.driving};
  Object.assign(walk,{px:0,pz:8,driving:false});
  const camera=new THREE.PerspectiveCamera(45,1,.1,240);camera.position.set(0,1.1,8.3);
  const renderer=await create(React.createElement(Visitor),{camera});
  try {
    await renderer.advanceFrames(1,1/60);assert.equal(renderer.scene.findByProps({name:'maker-visitor'}).instance.visible,false);
    camera.position.set(0,3.2,14.2);await renderer.advanceFrames(1,1/60);assert.equal(renderer.scene.findByProps({name:'maker-visitor'}).instance.visible,true);
  } finally {await renderer.unmount();Object.assign(walk,saved);}
});


test('rain is bounded, quality-scaled, paused with the shared clock and shelters bees',async()=>{
  const {Rain}=require('../src/components/farm/scene/Weather.tsx');
  const {FarmLife}=require('../src/components/farm/scene/FarmLife.tsx');
  const {gameClock,advanceWorld}=require('../src/farm/game/clock.ts');
  const saved={...gameClock};Object.assign(gameClock,{seconds:0,paused:false,reduced:false});
  const renderer=await create(React.createElement('group',null,React.createElement(Rain,{low:true}),React.createElement(FarmLife,{rain:true})));
  try {
    await renderer.advanceFrames(1,1/60);
    const rain=renderer.scene.findByProps({name:'gentle-rain'}).instance;
    assert.equal(rain.geometry.attributes.position.count,240);
    assert.equal(renderer.scene.findByProps({name:'orchard-bees'}).instance.visible,false);
    const initial=Array.from(rain.geometry.attributes.position.array);
    advanceWorld(.05);await renderer.advanceFrames(1,1/60);
    assert.notDeepEqual(Array.from(rain.geometry.attributes.position.array),initial);
    gameClock.reduced=true;const frozen=Array.from(rain.geometry.attributes.position.array);
    advanceWorld(1);await renderer.advanceFrames(1,1/60);
    assert.deepEqual(Array.from(rain.geometry.attributes.position.array),frozen);
    for(const value of frozen) assert.ok(Number.isFinite(value));
    await renderer.update(React.createElement(Rain,{low:false}));await renderer.advanceFrames(1,1/60);
    assert.equal(renderer.scene.findByProps({name:'gentle-rain'}).instance.geometry.attributes.position.count,840);
  } finally {await renderer.unmount();Object.assign(gameClock,saved);}
});


test('natural foliage uses finite branched geometry with a bounded shared orchard canopy',()=>{
  const {cedarGeometry,appleGeometry,foothillGeometry}=require('../src/components/farm/scene/natural-geometry.ts');
  const cedar=cedarGeometry(),apple=appleGeometry(),again=appleGeometry();
  const lowCedar=cedarGeometry(71,true),lowApple=appleGeometry(96,true);
  assert.ok(lowCedar.foliage.attributes.position.count<cedar.foliage.attributes.position.count/2);
  assert.ok(lowApple.foliage.attributes.position.count<apple.foliage.attributes.position.count/2);
  lowCedar.wood.dispose();lowCedar.foliage.dispose();lowApple.wood.dispose();lowApple.foliage.dispose();
  assert.deepEqual(apple.foliage.attributes.position.array,again.foliage.attributes.position.array,'stable comparison across reloads');
  assert.ok(cedar.foliage.attributes.position.count>10000);
  assert.ok(cedar.foliage.attributes.position.count/3<10000,'foliage stays inside a bounded geometry budget');
  const sphere=new THREE.Sphere(new THREE.Vector3(0,2.1,0),1.35),p=new THREE.Vector3();
  for(let i=0;i<apple.foliage.attributes.position.count;i++) {
    p.fromBufferAttribute(apple.foliage.attributes.position,i);
    assert.ok(sphere.containsPoint(p),'leaves stay inside existing camera obstruction envelope');
  }
  const ground=foothillGeometry();
  for(let i=0;i<ground.attributes.position.count;i++) {
    p.fromBufferAttribute(ground.attributes.position,i);
    if(Math.max(Math.abs(p.x),Math.abs(p.z))<=45) assert.ok(p.y<-.1,'distant hills cannot rise into physical walking area');
  }
  for(const g of [cedar.wood,cedar.foliage,apple.wood,apple.foliage,ground]) {
    for(const name of ['position','normal','color']) for(const n of g.attributes[name].array) assert.ok(Number.isFinite(n));
    g.dispose();
  }
});

test('well bucket and rope read the same collected-water state without a perpetual motor',async()=>{
  const {Well}=require('../src/components/farm/scene/scenery.tsx');
  const renderer=await create(React.createElement(Well,{waterCollected:false}));
  const first=renderer.scene.findByProps({name:'well-bucket'}).instance.position.y;
  await renderer.update(React.createElement(Well,{waterCollected:true}));
  assert.ok(renderer.scene.findByProps({name:'well-bucket'}).instance.position.y>first);
  await renderer.advanceFrames(60,1/60);
  assert.equal(renderer.scene.findByProps({name:'well-bucket'}).instance.position.y,1.2);
  await renderer.unmount();
});


test('animal behaviour cycles continuously within its pen and shelters from rain',()=>{
  const {animalPose}=require('../src/components/farm/scene/object-motion.ts');
  for(const [seconds,state] of [[3,'graze'],[14,'walk'],[23,'rest']]) assert.equal(animalPose(seconds).state,state);
  assert.equal(animalPose(14,0,true).state,'shelter');
  assert.equal(animalPose(14,0,true).gait,0);
  for(let t=0;t<56;t+=.05){const p=animalPose(t);assert.ok(Math.abs(p.x)<=.42&&p.z>=0&&p.z<=.48);for(const v of Object.values(p))if(typeof v==='number')assert.ok(Number.isFinite(v));}
  for(const t of [10,19,28]){const a=animalPose(t-.0001),b=animalPose(t+.0001);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<.001);assert.ok(Math.abs(a.head-b.head)<.001);}
});

test('actual animal joints use the shared clock and freeze with pause or reduced motion',async()=>{
  const {gameClock,advanceWorld}=require('../src/farm/game/clock.ts');const saved={...gameClock};
  Object.assign(gameClock,{seconds:12,paused:false,reduced:false});
  const renderer=await create(React.createElement(MODELS.cow,{night:false}));
  try{
    await renderer.advanceFrames(1,1/60);const leg=renderer.scene.findByProps({name:'animal-leg-0'}).instance;
    const first=leg.rotation.z;advanceWorld(.05);await renderer.advanceFrames(1,1/60);assert.notEqual(leg.rotation.z,first);
    for(const flag of ['paused','reduced']){gameClock[flag]=true;const frozen=leg.rotation.z;advanceWorld(1);await renderer.advanceFrames(3,1/60);assert.equal(leg.rotation.z,frozen);gameClock[flag]=false;}
  }finally{await renderer.unmount();Object.assign(gameClock,saved);}
});

test('tractor wheels follow signed ground travel with independent tyre radii and pause sync',async()=>{
  const {vehicleVisual}=require('../src/components/farm/scene/object-motion.ts');
  const origin={x:0,z:0,yaw:0,rear:0,front:0,steer:0};
  const forward=vehicleVisual(origin,{x:0,z:.4,yaw:0},false);assert.equal(forward.rear,-1);assert.ok(Math.abs(forward.front+.4/.245)<1e-8);
  const back=vehicleVisual(forward,{x:0,z:0,yaw:0},false);assert.ok(Math.abs(back.rear)<1e-8);
  assert.equal(vehicleVisual(forward,{x:0,z:.8,yaw:.2},true).rear,forward.rear);
  assert.equal(vehicleVisual(forward,{x:0,z:10,yaw:0},false).rear,forward.rear);
  assert.ok(Math.abs(vehicleVisual(origin,{x:0,z:.2,yaw:.2},false).steer)<=.48);
  const {walk}=require('../src/components/farm/scene/walk-state.ts');const saved={...walk};const {gameClock}=require('../src/farm/game/clock.ts');const clock={...gameClock};
  Object.assign(walk,{tx:0,tz:0,vehicleYaw:0,driving:false});gameClock.paused=false;
  const renderer=await create(React.createElement(MODELS.tractor,{night:false}));
  try{await renderer.advanceFrames(3,1/60);const wheel=renderer.scene.findByProps({name:'tractor-rear-wheel-0'}).instance;assert.equal(wheel.rotation.z,0);
    walk.tz=.4;await renderer.advanceFrames(1,1/60);assert.ok(Math.abs(wheel.rotation.z+1)<1e-8);
    gameClock.paused=true;walk.tz=.8;await renderer.advanceFrames(1,1/60);assert.ok(Math.abs(wheel.rotation.z+1)<1e-8);
    gameClock.paused=false;await renderer.advanceFrames(1,1/60);assert.ok(Math.abs(wheel.rotation.z+1)<1e-8);
    walk.driving=true;await renderer.advanceFrames(1,1/60);assert.equal(renderer.scene.findByProps({name:'tractor-driver'}).instance.visible,true);
  }finally{await renderer.unmount();Object.assign(walk,saved);Object.assign(gameClock,clock);}
});

test('crop quality reduces instances and watered soil reflects completed activity',async()=>{
  const {NaturalDetail}=require('../src/components/farm/scene/MiddleAtlas.tsx');
  const tree=(low,watered)=>React.createElement(NaturalDetail.Provider,{value:low},React.createElement(MODELS.crops,{night:false,cols:3,rows:1,watered}));
  const renderer=await create(tree(false,false));
  try{await renderer.advanceFrames(1,1/60);const full=renderer.scene.findAll(n=>n.instance.isInstancedMesh)[0].instance.count;
    const dry=renderer.scene.findByProps({name:'leafy-kitchen-beds'}).instance.children[0].material.color.clone();
    await renderer.update(tree(true,true));await renderer.advanceFrames(1,1/60);
    const plants=renderer.scene.findAll(n=>n.instance.isInstancedMesh)[0].instance;
    assert.ok(plants.count<full);
    const a=new THREE.Matrix4(),b=new THREE.Matrix4();plants.getMatrixAt(0,a);plants.getMatrixAt(plants.count-1,b);assert.notEqual(a.elements[12],b.elements[12],'quality changes initialize planting even with a frozen clock');
    assert.ok(!renderer.scene.findByProps({name:'leafy-kitchen-beds'}).instance.children[0].material.color.equals(dry));
  }finally{await renderer.unmount();}
});

test('harvest removes real apples, puts a basket in hands or trailer and sets the shared table',async()=>{
  const {HARVEST_APPLES,harvestApple}=require('../src/farm/game/journey.ts');
  const {JourneyProgress}=require('../src/components/farm/scene/journey-state.tsx');
  const {gameClock}=require('../src/farm/game/clock.ts');const clock={...gameClock};gameClock.paused=false;
  let progress={completed:['studio','well','garden'],water:2,apples:0};
  const tree=()=>React.createElement(JourneyProgress.Provider,{value:progress},React.createElement('group',null,React.createElement(GameWorld,{progress,waypoint:null}),React.createElement(Visitor)));
  const renderer=await create(tree());
  try {
    assert.equal(renderer.scene.findAll(n=>n.instance.name.startsWith('pickable-apple-')).length,3);
    progress=harvestApple(progress,HARVEST_APPLES[0],true).progress;await renderer.update(tree());await renderer.advanceFrames(1,1/60);
    assert.equal(renderer.scene.findAll(n=>n.instance.name.startsWith('pickable-apple-')).length,2);
    assert.ok(renderer.scene.findByProps({name:'carried-apple-basket'}).instance.children.length);
    progress={...progress,basket:'trailer'};await renderer.update(tree());await renderer.advanceFrames(1,1/60);
    assert.equal(renderer.scene.findAll(n=>n.instance.name==='carried-apple-basket').length,0);
    assert.ok(renderer.scene.findByProps({name:'trailer-apple-basket'}).instance.children.length);
    progress={completed:['studio','well','garden','orchard','table'],water:2,apples:0,picked:[0,1,2],basket:'carried',delivery:'tractor'};
    await renderer.update(tree());await renderer.advanceFrames(1,1/60);
    assert.equal(renderer.scene.findAll(n=>n.instance.name.startsWith('pickable-apple-')).length,0);
    assert.equal(renderer.scene.findAll(n=>n.instance.name==='trailer-apple-basket').length,0);
    assert.ok(renderer.scene.findByProps({name:'harvest-table-setting'}).instance.children.length);
    assert.ok(renderer.scene.findByProps({name:'shared-apples'}).instance.children.length);
    const steam=renderer.scene.findByProps({name:'shared-tea-steam'}).instance,matrix=new THREE.Matrix4();steam.getMatrixAt(0,matrix);const frozen=matrix.clone();
    gameClock.paused=true;await renderer.advanceFrames(3,1/60);steam.getMatrixAt(0,matrix);assert.ok(matrix.equals(frozen));
    for(const node of renderer.scene.findAll(n=>n.instance.isMesh))for(const value of node.instance.geometry.attributes.position.array)assert.ok(Number.isFinite(value));
  }finally{await renderer.unmount();Object.assign(gameClock,clock);}
});

test('apples and weathered metal have deterministic finite shape/colour detail and tread uses paired angled lugs',async()=>{
  const {appleFruitGeometry}=require('../src/components/farm/scene/RealisticDetails.tsx');
  const {agedMetalGeometry,paintRoughness}=require('../src/components/farm/scene/surface-geometry.ts');
  const apple=appleFruitGeometry(),again=appleFruitGeometry(),metal=agedMetalGeometry([.8,.35,.45],'#9b5e48');
  assert.deepEqual(apple.attributes.position.array,again.attributes.position.array);
  apple.computeBoundingBox();assert.ok(apple.boundingBox.max.y<.9,'top is dimpled rather than spherical');
  for(const geometry of [apple,again,metal])for(const name of ['position','normal','color'])for(const value of geometry.attributes[name].array)assert.ok(Number.isFinite(value));
  assert.ok(new Set(Array.from(metal.attributes.color.array).map(n=>n.toFixed(3))).size>20,'paint/edge/oxide variation is present');
  assert.equal(paintRoughness.image.width,128);assert.equal(paintRoughness.image.data.length,128*128*4);
  const renderer=await create(React.createElement(MODELS.tractor,{night:false}));
  try{
    const lugs=renderer.scene.findAll(n=>n.instance.isInstancedMesh&&[36,52].includes(n.instance.count));assert.equal(lugs.length,4);
    const a=new THREE.Matrix4(),b=new THREE.Matrix4();lugs[0].instance.getMatrixAt(0,a);lugs[0].instance.getMatrixAt(1,b);
    assert.ok(a.elements[14]*b.elements[14]<0,'chevrons occupy both halves of the tyre');assert.notEqual(a.elements[2],b.elements[2],'the lugs slant in opposite directions');
  }finally{await renderer.unmount();apple.dispose();again.dispose();metal.dispose();}
});

test('the maker has one visible body on foot or in the tractor, with no stationary studio duplicate',async()=>{
  const {walk}=require('../src/components/farm/scene/walk-state.ts'),saved={...walk};
  const {MODELS}=require('../src/components/farm/scene/models.tsx');
  const camera=new THREE.PerspectiveCamera(45,1,.1,240);camera.position.set(0,3.2,14.2);
  Object.assign(walk,{px:0,pz:8,driving:false});
  const renderer=await create(React.createElement(React.Fragment,null,React.createElement(AtlasLandscape,{night:false}),React.createElement(Visitor),React.createElement(MODELS.tractor,{night:false})),{camera});
  const visibleHeads=()=>renderer.scene.findAll(n=>n.instance.name==='maker-head').filter(n=>{for(let object=n.instance;object;object=object.parent)if(!object.visible)return false;return true;}).length;
  try{
    assert.equal(renderer.scene.findAll(n=>n.instance.name==='makers-workbench').length,1,'studio furniture remains');
    for(const driving of [false,true,false]){walk.driving=driving;await renderer.advanceFrames(2,1/60);assert.equal(visibleHeads(),1,`exactly one visible maker when driving=${driving}`);}
  }finally{await renderer.unmount();Object.assign(walk,saved);}
});
