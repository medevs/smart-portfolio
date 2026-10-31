const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
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
const originalLoad = Module._load;
Module._load = function(request, ...rest) {
  const loaded = originalLoad.call(this, request, ...rest);
  return request === '@react-three/drei' ? { ...loaded, Html: () => null } : loaded;
};
global.IS_REACT_ACT_ENVIRONMENT = true;
const { AtlasLandscape } = require('../src/components/farm/scene/MiddleAtlas.tsx');
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
  world.createCollider(RAPIER.ColliderDesc.cuboid(.85, .4, .5), tractor);
  for (let i = 0; i < 120; i++) {
    tractor.setLinvel({ x: 0, y: tractor.linvel().y, z: 7 }, true);
    world.step();
  }
  assert.ok(tractor.translation().z < YARD_LIMIT && tractor.translation().z > YARD_LIMIT - 1);
  assert.ok(tractor.translation().y > .3);
  world.free();
});
