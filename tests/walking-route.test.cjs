require('./register-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs'),
  Module = require('node:module'),
  ts = require('typescript');
Module._extensions['.ts'] = function (module, filename) {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText,
    filename,
  );
};
const {
  findWalkingRoute,
  walkingSegmentClear,
} = require('../src/components/farm/scene/walking-route.ts');
const { safeSpawn } = require('../src/farm/game/collision.ts');
const { DESTINATIONS, distance } = require('../src/farm/game/world.ts');
const { HARVEST_APPLES } = require('../src/farm/game/journey.ts');
function check(from, to, obstacles = []) {
  const route = findWalkingRoute(from, to, obstacles);
  assert.ok(route?.length, `route from ${JSON.stringify(from)} to ${JSON.stringify(to)}`);
  assert.ok(distance(route.at(-1), to) < 1e-8);
  for (const target of route) {
    const steps = Math.max(1, Math.ceil(distance(from, target) / 0.05));
    for (let i = 0; i <= steps; i++) {
      const p = {
        x: from.x + ((target.x - from.x) * i) / steps,
        z: from.z + ((target.z - from.z) * i) / steps,
      };
      assert.ok(safeSpawn(p), `route crossed an obstacle at ${JSON.stringify(p)}`);
      for (const obstacle of obstacles) assert.ok(distance(p, obstacle) > obstacle.radius - 0.01);
    }
    from = target;
  }
  return route;
}
test('all destination pairs have continuously clear routes, including buildings and orchard rows', () => {
  for (const from of DESTINATIONS) for (const to of DESTINATIONS) check(from, to);
  for (const apple of HARVEST_APPLES) check({ x: 13, z: 22 }, apple);
});
test('routes avoid parked vehicles and reject unreachable, unsafe and non-finite targets', () => {
  const obstacles = [
    { x: 0, z: 5.5, radius: 1.35 },
    { x: -2.25, z: 5.5, radius: 1.35 },
  ];
  check({ x: 0, z: 8 }, { x: 0, z: 2 }, obstacles);
  for (const target of [
    { x: 0, z: -18 },
    { x: 99, z: 0 },
    { x: NaN, z: 0 },
  ])
    assert.equal(findWalkingRoute({ x: 0, z: 8 }, target), null);
  assert.equal(findWalkingRoute({ x: 0, z: 8 }, { x: 0, z: 2 }, [{ x: 0, z: 2, radius: 1 }]), null);
});
test('walking route planning is deterministic and keeps source and target objects intact', () => {
  const from = Object.freeze({ x: 0, z: 8 }),
    to = Object.freeze({ x: 0, z: -12.8 });
  assert.deepEqual(findWalkingRoute(from, to), findWalkingRoute(from, to));
  assert.deepEqual(from, { x: 0, z: 8 });
  assert.deepEqual(to, { x: 0, z: -12.8 });
});

test('smoothing cannot cut the narrow corner that a sampled line check missed', () => {
  const from = { x: -3, z: -4 },
    to = { x: -2, z: -5 };
  assert.equal(walkingSegmentClear(from, to), false);
  assert.ok(check(from, to).length > 1);
});

test('starting beside a vehicle steps outward before routing around it', () => {
  const obstacle = { x: 0, z: 5.5, radius: 1.35 },
    from = { x: 0.9, z: 5.5 },
    to = { x: -4, z: 5.5 };
  const route = findWalkingRoute(from, to, [obstacle]);
  assert.ok(route?.length > 1);
  assert.ok(route[0].x > from.x, 'leave the conservative footprint on the starting side');
  check(route[0], to, [obstacle]);
});
