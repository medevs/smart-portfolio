require('./register-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
Module._extensions['.ts'] = function (module, filename) {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    filename,
  );
};
const {
  ACTIVITIES,
  freshProgress,
  interact,
  nextActivity,
} = require('../src/farm/game/progress.ts');
const { destination, DESTINATIONS, ORCHARD_TREES } = require('../src/farm/game/world.ts');
const {
  freshProfile,
  parseProfile,
  readProfile,
  writeProfile,
} = require('../src/farm/game/save.ts');
const { safeSpawn, YARD_BUILDINGS } = require('../src/farm/game/collision.ts');
const {
  walkingMovement,
  resetWalkInput,
  walk,
} = require('../src/components/farm/scene/walk-state.ts');
const {
  gameClock,
  advanceWorld,
  animationDelta,
  cycleLighting,
} = require('../src/farm/game/clock.ts');

test('complete the ordered farm loop physically, with exact inventory and no duplicate rewards', () => {
  let progress = freshProgress();
  const expected = [
    [0, 0],
    [3, 0],
    [2, 0],
    [2, 3],
    [2, 0],
  ];
  ACTIVITIES.forEach((activity, i) => {
    assert.equal(nextActivity(progress).id, activity.id);
    let result;
    if (activity.id === 'orchard') {
      const { HARVEST_APPLES } = require('../src/farm/game/journey.ts');
      for (const apple of HARVEST_APPLES) {
        result = interact(progress, 'orchard', apple, true);
        assert.equal(result.changed, true);
        progress = result.progress;
      }
    } else result = interact(progress, activity.id, destination(activity.id), true);
    assert.equal(result.changed, true);
    progress = result.progress;
    assert.deepEqual([progress.water, progress.apples], expected[i]);
    const duplicate = interact(progress, activity.id, destination(activity.id), true);
    assert.equal(duplicate.changed, false);
    assert.equal(duplicate.progress, progress);
    const profile = { ...freshProfile(), progress };
    assert.deepEqual(parseProfile(JSON.stringify(profile)).progress, progress);
  });
  assert.equal(nextActivity(progress), null);
});
test('pause, distance and prerequisites prevent inventory changes', () => {
  const fresh = freshProgress();
  for (const [id, point, allowed] of [
    ['studio', { x: 20, z: 20 }, true],
    ['studio', destination('studio'), false],
    ['garden', destination('garden'), true],
    ['table', destination('table'), true],
  ]) {
    const result = interact(fresh, id, point, allowed);
    assert.equal(result.changed, false);
    assert.equal(result.progress, fresh);
  }
  assert.equal(interact(fresh, 'home', destination('home'), true).changed, false);
});
test('all map destinations are safe; buildings, trunks, well and edges are rejected', () => {
  for (const place of DESTINATIONS) assert.ok(safeSpawn(place), place.id);
  for (const block of YARD_BUILDINGS)
    assert.equal(safeSpawn({ x: block.position[0], z: block.position[2] }), false);
  for (const tree of ORCHARD_TREES) assert.equal(safeSpawn(tree), false);
  for (const point of [
    { x: NaN, z: 0 },
    { x: 44, z: 0 },
    { x: 0, z: Infinity },
    { x: -12.5, z: 3.4 },
  ])
    assert.equal(safeSpawn(point), false);
});
test('invalid, future, inconsistent and corrupt saves recover without blocking a visit', () => {
  for (const raw of [
    null,
    '{broken',
    '[]',
    'null',
    JSON.stringify({ ...freshProfile(), version: 2 }),
    JSON.stringify({ ...freshProfile(), progress: { completed: ['well'], water: 3, apples: 0 } }),
    JSON.stringify({
      ...freshProfile(),
      progress: { completed: ['well', 'studio'], water: 3, apples: 0 },
    }),
  ])
    assert.deepEqual(parseProfile(raw), freshProfile());
  const unsafe = {
    ...freshProfile(),
    position: { x: 0, z: -18 },
    preferences: { quality: 'fake', volume: 900 },
  };
  assert.deepEqual(parseProfile(JSON.stringify(unsafe)), freshProfile());
  const storage = {
    getItem() {
      throw Error('blocked');
    },
    setItem() {
      throw Error('quota');
    },
  };
  assert.equal(readProfile(storage).available, false);
  assert.equal(writeProfile(storage, freshProfile()), false);
});
test('valid saved settings and safe walking positions survive reload', () => {
  const profile = {
    ...freshProfile(),
    position: { x: 13, z: 22 },
    introduced: true,
    preferences: {
      quality: 'low',
      volume: 0.6,
      reducedMotion: true,
      daylight: true,
      weather: 'rain',
    },
  };
  let raw;
  const storage = {
    setItem(key, value) {
      raw = value;
    },
    getItem() {
      return raw;
    },
  };
  assert.equal(writeProfile(storage, profile), true);
  assert.deepEqual(readProfile(storage).profile, profile);
});
test('sprint keeps normalized diagonal speed and reset clears transient inputs', () => {
  const normal = walkingMovement(1, 0, 1 / 60),
    sprint = walkingMovement(1, 1, 1 / 60, true);
  assert.ok(Math.abs(Math.hypot(sprint.x, sprint.z) / Math.abs(normal.z) - 1.6) < 1e-10);
  walk.sprinting = true;
  walk.moving = 5;
  walk.toggleDrive = true;
  resetWalkInput();
  assert.equal(walk.sprinting, false);
  assert.equal(walk.moving, 0);
  assert.equal(walk.toggleDrive, false);
});
test('shared world clock freezes paused, hidden and reduced motion without catchup', () => {
  gameClock.seconds = 0;
  gameClock.paused = false;
  gameClock.reduced = false;
  assert.equal(advanceWorld(10), 0.05);
  assert.equal(advanceWorld(1, true), 0.05);
  gameClock.paused = true;
  assert.equal(advanceWorld(1), 0.05);
  assert.equal(animationDelta(1), 0);
  gameClock.paused = false;
  gameClock.reduced = true;
  assert.equal(advanceWorld(1), 0.05);
  gameClock.reduced = false;
  assert.equal(advanceWorld(0.02), 0.07);
  assert.deepEqual([0, 180, 270, 360].map(cycleLighting), ['day', 'sunset', 'night', 'day']);
});

test('three distinct reachable apples fill the basket; one branch cannot award twice', () => {
  const { HARVEST_APPLES, harvestApple } = require('../src/farm/game/journey.ts');
  let p = { completed: ['studio', 'well', 'garden'], water: 2, apples: 0 };
  for (const index of [2, 0, 1]) {
    assert.ok(safeSpawn(HARVEST_APPLES[index]), 'low branch is reachable beside its trunk');
    for (const allowed of [false, true]) {
      const result = harvestApple(p, { x: 0, z: 8 }, allowed);
      assert.equal(result.changed, false);
    }
    const result = harvestApple(p, HARVEST_APPLES[index], true);
    assert.equal(result.changed, true);
    p = result.progress;
    assert.equal(
      harvestApple(p, HARVEST_APPLES[index], true).changed,
      false,
      'same apple stays picked',
    );
    assert.deepEqual(
      parseProfile(JSON.stringify({ ...freshProfile(), progress: p })).progress,
      p,
      'partial harvest persists',
    );
  }
  assert.equal(p.apples, 3);
  assert.ok(p.completed.includes('orchard'));
  assert.equal(harvestApple(p, HARVEST_APPLES[0], true).changed, false);
});

test('basket loading needs physical proximity and a stopped rig; delivery needs unloading', () => {
  const { transferBasket, trailerLoadingPoint } = require('../src/farm/game/journey.ts');
  const full = {
    completed: ['studio', 'well', 'garden', 'orchard'],
    water: 2,
    apples: 3,
    picked: [0, 1, 2],
    basket: 'carried',
  };
  const trailer = { x: 0, z: 5.5, yaw: Math.PI / 2 },
    context = { trailer, loading: trailerLoadingPoint(trailer), speed: 0 };
  for (const [point, speed, allowed] of [
    [{ x: 20, z: 20 }, 0, true],
    [context.loading, 1, true],
    [context.loading, 0, false],
  ])
    assert.equal(transferBasket(full, point, { ...context, speed }, allowed).changed, false);
  assert.equal(
    transferBasket({ ...full, apples: 1, picked: [0] }, context.loading, context, true).changed,
    false,
    'finish harvesting before securing the basket',
  );
  let p = transferBasket(full, context.loading, context, true).progress;
  assert.equal(p.basket, 'trailer');
  assert.equal(
    interact(p, 'table', destination('table'), true).changed,
    false,
    'cannot deliver remote cargo',
  );
  const restored = parseProfile(JSON.stringify({ ...freshProfile(), progress: p })).progress;
  assert.equal(restored.basket, 'carried');
  assert.equal(restored.apples, 3, 'reload recovers every apple');
  const table = destination('table'),
    parked = { trailer: { ...table, yaw: 0 }, loading: { x: table.x, z: table.z - 1.5 }, speed: 0 };
  p = transferBasket(p, parked.loading, parked, true).progress;
  assert.equal(p.basket, 'carried');
  assert.equal(p.usedTrailer, true);
  const delivered = interact(p, 'table', table, true).progress;
  assert.equal(delivered.apples, 0);
  assert.equal(delivered.delivery, 'tractor');
  assert.deepEqual(
    parseProfile(JSON.stringify({ ...freshProfile(), progress: delivered })).progress,
    delivered,
  );
});

test('legacy journals migrate and malformed partial harvests cannot invent apples', () => {
  const base = { completed: ['studio', 'well', 'garden'], water: 2, apples: 1 };
  for (const patch of [
    {},
    { picked: [0, 0] },
    { picked: [4] },
    { picked: [0, 1] },
    { picked: [0], basket: 'floating' },
    { picked: [0], delivery: 'tractor' },
  ]) {
    assert.deepEqual(
      parseProfile(JSON.stringify({ ...freshProfile(), progress: { ...base, ...patch } })).progress,
      freshProgress(),
    );
  }
  const legacy = { completed: ['studio', 'well', 'garden', 'orchard'], water: 2, apples: 3 };
  assert.deepEqual(
    parseProfile(JSON.stringify({ ...freshProfile(), progress: legacy })).progress,
    legacy,
  );
  const done = { completed: ACTIVITIES.map((a) => a.id), water: 2, apples: 0 };
  assert.deepEqual(
    parseProfile(JSON.stringify({ ...freshProfile(), progress: done })).progress,
    done,
  );
});

test('farm dog turns before approaching, keeps its home leash and freezes with the clock', () => {
  const { animalPose, companionPose } = require('../src/components/farm/scene/object-motion.ts');
  let p = { ...animalPose(0), x: 0, z: 0, heading: Math.PI };
  const first = companionPose(p, 1, 0.05, { x: 4, z: 0 });
  assert.equal(first.x, 0, 'turn first instead of skating sideways');
  for (let i = 0; i < 400; i++) {
    p = companionPose(p, i * 0.05, 0.05, { x: 4, z: 0 });
    assert.ok(Math.hypot(p.x, p.z) <= 2.201);
  }
  assert.ok(p.x > 2, 'notices and approaches a nearby visitor');
  assert.equal(
    companionPose(p, 100, 0, { x: 0, z: 0 }),
    p,
    'paused/reduced clock does not move or turn dog',
  );
  for (let i = 0; i < 400; i++) p = companionPose(p, 20 + i * 0.05, 0.05, { x: 4, z: 0 }, true);
  assert.ok(Math.hypot(p.x, p.z) < 0.05, 'rain returns dog to its home patch');
});
