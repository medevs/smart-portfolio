const assert = require('node:assert/strict');
const { test } = require('node:test');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/components/farm/scene/walk-state.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { walkingMovement, walk, resetWalkInput } = context.exports;

test('forward, backward and strafe keep the same direction for sustained input', () => {
  for (const [forward, strafe, axis, sign] of [
    [1, 0, 'z', -1],
    [-1, 0, 'z', 1],
    [0, 1, 'x', 1],
    [0, -1, 'x', -1],
  ]) {
    let x = 0,
      z = 0;
    for (let frame = 0; frame < 60; frame++) {
      const move = walkingMovement(forward, strafe, 1 / 60);
      walk.yaw = Math.atan2(move.x, move.z);
      x += move.x;
      z += move.z;
      assert.ok(move[axis] * sign > 0);
    }
    assert.ok(Math.abs(Math.hypot(x, z) - 4.5) < 1e-9);
  }
});
test('diagonal input has the same walking speed as a single direction', () => {
  const diagonal = walkingMovement(1, 1, 1 / 60);
  const straight = walkingMovement(1, 0, 1 / 60);
  assert.ok(
    Math.abs(Math.hypot(diagonal.x, diagonal.z) - Math.hypot(straight.x, straight.z)) < 1e-9,
  );
});
test('a delayed frame cannot teleport the visitor', () => {
  assert.ok(Math.abs(walkingMovement(1, 0, 8).z) <= 0.225 + 1e-9);
});
test('focus loss clears movement and queued driving without moving the parked tractor', () => {
  walk.stickX = 1;
  walk.stickY = -1;
  walk.toggleDrive = true;
  walk.tx = 9;
  walk.px = 3;
  walk.routeRequest = { x: 20, z: 20, label: 'Queued route' };
  resetWalkInput();
  assert.equal(walk.routeRequest, null);
  assert.equal(walk.stickX, 0);
  assert.equal(walk.stickY, 0);
  assert.equal(walk.toggleDrive, false);
  assert.equal(walk.tx, 9);
  assert.equal(walk.px, 3);
});

test('movement follows the camera view without feeding avatar facing back into steering', () => {
  const north = walkingMovement(1, 0, 1 / 60, false, 0);
  const west = walkingMovement(1, 0, 1 / 60, false, Math.PI / 2);
  assert.ok(
    west.x < -0.05 && Math.abs(west.z) < 1e-8,
    'forward points away from an east-side camera',
  );
  assert.ok(Math.abs(Math.hypot(north.x, north.z) - Math.hypot(west.x, west.z)) < 1e-8);
  const first = walkingMovement(1, 0.5, 1 / 60, false, Math.PI / 3);
  for (let i = 0; i < 60; i++) {
    walk.yaw += 0.1;
    const move = walkingMovement(1, 0.5, 1 / 60, false, Math.PI / 3);
    assert.equal(move.x, first.x);
    assert.equal(move.z, first.z);
  }
});

test('analog movement is gradual, radial and respects pause and arrow overlap', () => {
  const { movementInput } = context.exports;
  resetWalkInput();
  walk.paused = false;
  walk.stickY = -0.08;
  assert.equal(movementInput().forward, 0);
  walk.stickY = -0.56;
  const slow = movementInput().forward;
  walk.stickY = -1;
  assert.ok(slow > 0 && slow < movementInput().forward);
  walk.stickX = 1;
  const diagonal = movementInput();
  assert.ok(Math.hypot(diagonal.forward, diagonal.strafe) <= 1.000001);
  resetWalkInput();
  walk.keys.w = true;
  walk.keys.arrowup = true;
  walk.keys.w = false;
  assert.equal(movementInput().forward, 1);
  walk.paused = true;
  assert.equal(movementInput().forward, 0);
  assert.equal(walk.keys.arrowup, false);
  walk.paused = false;
});

test('touch pad starts at rest, clamps drag and releases without cancelling sprint', () => {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync('src/components/farm/game/pad-controls.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    { exports },
  );
  const host = new EventTarget(),
    doc = Object.assign(new EventTarget(), { defaultView: host, hidden: false });
  const captured = new Set();
  const element = Object.assign(new EventTarget(), {
    ownerDocument: doc,
    style: { setProperty() {} },
    setAttribute() {},
    removeAttribute() {},
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    setPointerCapture: (id) => captured.add(id),
    hasPointerCapture: (id) => captured.has(id),
    releasePointerCapture: (id) => captured.delete(id),
  });
  let takeovers = 0;
  const stick = { stickX: 0, stickY: 0, sprinting: true };
  const dispose = exports.bindMovementPad(element, stick, () => takeovers++);
  const pointer = (type, id, x, y) => {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { pointerId: id, button: 0, clientX: x, clientY: y });
    element.dispatchEvent(event);
  };
  pointer('pointerdown', 1, 12, 12);
  assert.equal(stick.stickY, 0);
  pointer('pointerdown', 2, 12, 200);
  pointer('pointermove', 2, 12, 200);
  assert.equal(stick.stickY, 0);
  assert.equal(takeovers, 1, 'only the controlling finger takes over walking');
  pointer('pointermove', 1, 12, -7);
  assert.equal(stick.stickY, -0.5);
  pointer('pointermove', 1, 200, -200);
  assert.ok(Math.abs(Math.hypot(stick.stickX, stick.stickY) - 1) < 1e-9);
  pointer('pointerup', 1, 200, -200);
  assert.equal(stick.stickY, 0);
  assert.equal(stick.sprinting, true);
  assert.equal(captured.size, 0);
  pointer('pointerdown', 3, 10, 10);
  pointer('pointermove', 3, 10, -20);
  host.dispatchEvent(new Event('blur'));
  assert.equal(stick.stickY, 0);
  pointer('pointerdown', 4, 10, 10);
  pointer('pointermove', 4, 10, -20);
  doc.hidden = true;
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(stick.stickY, 0);
  dispose();
  pointer('pointerdown', 5, 10, 10);
  pointer('pointermove', 5, 10, -20);
  assert.equal(stick.stickY, 0);
});
