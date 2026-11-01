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
const originalLoad = Module._load;
Module._load = function(request, ...rest) {
  const loaded = originalLoad.call(this, request, ...rest);
  return request === '@react-three/drei' ? { ...loaded, Html: () => null, useTexture: () => portraitTexture } : loaded;
};
global.IS_REACT_ACT_ENVIRONMENT = true;
const { AtlasLandscape } = require('../src/components/farm/scene/MiddleAtlas.tsx');
const { Visitor } = require('../src/components/farm/scene/Visitor.tsx');
const { GameWorld } = require('../src/components/farm/scene/GameWorld.tsx');
const { MODELS } = require('../src/components/farm/scene/models.tsx');
const { loadFarm, placePlots } = require('../src/farm/loadFarm.ts');
const { plotPosition } = require('../src/farm/world.ts');

test('expanded agricultural world constructs finite geometry with instanced planting', async () => {
  const renderer = await create(React.createElement(AtlasLandscape, { night: false }));
  const instances = renderer.scene.findAll(node => node.instance.isInstancedMesh);
  assert.deepEqual(instances.map(node => node.instance.count).sort((a, b) => a - b), [4, 48, 48, 240, 240]);
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
  t.diagnostic(`Core yard mesh count: ${renderer.scene.findAll(node => node.instance.isMesh).length}`);
  await renderer.advanceFrames(3, 1 / 60);
  await renderer.unmount();
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
