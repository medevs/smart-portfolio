const assert = require('node:assert/strict');
const { test } = require('node:test');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/components/farm/scene/walk-state.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { walkingMovement, walk, resetWalkInput } = context.exports;

test('forward, backward and strafe keep the same direction for sustained input', () => {
  for (const [forward, strafe, axis, sign] of [[1,0,'z',-1],[-1,0,'z',1],[0,1,'x',1],[0,-1,'x',-1]]) {
    let x = 0, z = 0;
    for (let frame = 0; frame < 60; frame++) {
      const move = walkingMovement(forward, strafe, 1/60);
      walk.yaw = Math.atan2(move.x, move.z);
      x += move.x; z += move.z;
      assert.ok(move[axis] * sign > 0);
    }
    assert.ok(Math.abs(Math.hypot(x, z) - 3.6) < 1e-9);
  }
});
test('diagonal input has the same walking speed as a single direction', () => {
  const diagonal = walkingMovement(1, 1, 1/60);
  const straight = walkingMovement(1, 0, 1/60);
  assert.ok(Math.abs(Math.hypot(diagonal.x, diagonal.z) - Math.hypot(straight.x, straight.z)) < 1e-9);
});
test('a delayed frame cannot teleport the visitor', () => {
  assert.ok(Math.abs(walkingMovement(1, 0, 8).z) <= 0.18 + 1e-9);
});
test('focus loss clears movement and queued driving without moving the parked tractor', () => {
  walk.stickX = 1; walk.stickY = -1; walk.toggleDrive = true; walk.tx = 9; walk.px = 3;
  resetWalkInput();
  assert.equal(walk.stickX, 0); assert.equal(walk.stickY, 0); assert.equal(walk.toggleDrive, false);
  assert.equal(walk.tx, 9); assert.equal(walk.px, 3);
});
