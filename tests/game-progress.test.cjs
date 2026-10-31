const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest);
};
Module._extensions['.ts'] = function(module, filename) {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
};
const { ACTIVITIES, freshProgress, interact, nextActivity } = require('../src/farm/game/progress.ts');
const { destination, DESTINATIONS, ORCHARD_TREES } = require('../src/farm/game/world.ts');
const { freshProfile, parseProfile, readProfile, writeProfile } = require('../src/farm/game/save.ts');
const { safeSpawn, YARD_BUILDINGS } = require('../src/components/farm/scene/yard-boundaries.ts');
const { walkingMovement, resetWalkInput, walk } = require('../src/components/farm/scene/walk-state.ts');
const { gameClock, advanceWorld, animationDelta, cycleLighting } = require('../src/farm/game/clock.ts');

test('complete the ordered farm loop physically, with exact inventory and no duplicate rewards', () => {
  let progress = freshProgress();
  const expected = [[0,0],[3,0],[2,0],[2,3],[2,0]];
  ACTIVITIES.forEach((activity, i) => {
    assert.equal(nextActivity(progress).id, activity.id);
    const result = interact(progress, activity.id, destination(activity.id), true);
    assert.equal(result.changed, true);
    progress = result.progress;
    assert.deepEqual([progress.water, progress.apples], expected[i]);
    const duplicate = interact(progress, activity.id, destination(activity.id), true);
    assert.equal(duplicate.changed, false); assert.equal(duplicate.progress, progress);
    const profile = { ...freshProfile(), progress };
    assert.deepEqual(parseProfile(JSON.stringify(profile)).progress, progress);
  });
  assert.equal(nextActivity(progress), null);
});
test('pause, distance and prerequisites prevent inventory changes', () => {
  const fresh = freshProgress();
  for (const [id, point, allowed] of [['studio',{x:20,z:20},true],['studio',destination('studio'),false],['garden',destination('garden'),true],['table',destination('table'),true]]) {
    const result = interact(fresh,id,point,allowed);
    assert.equal(result.changed,false); assert.equal(result.progress,fresh);
  }
  assert.equal(interact(fresh,'home',destination('home'),true).changed,false);
});
test('all map destinations are safe; buildings, trunks, well and edges are rejected', () => {
  for (const place of DESTINATIONS) assert.ok(safeSpawn(place), place.id);
  for (const block of YARD_BUILDINGS) assert.equal(safeSpawn({x:block.position[0],z:block.position[2]}),false);
  for (const tree of ORCHARD_TREES) assert.equal(safeSpawn(tree),false);
  for (const point of [{x:NaN,z:0},{x:44,z:0},{x:0,z:Infinity},{x:-12.5,z:3.4}]) assert.equal(safeSpawn(point),false);
});
test('invalid, future, inconsistent and corrupt saves recover without blocking a visit', () => {
  for (const raw of [null,'{broken','[]','null',JSON.stringify({...freshProfile(),version:2}),JSON.stringify({...freshProfile(),progress:{completed:['well'],water:3,apples:0}}),JSON.stringify({...freshProfile(),progress:{completed:['well','studio'],water:3,apples:0}})]) assert.deepEqual(parseProfile(raw),freshProfile());
  const unsafe = {...freshProfile(),position:{x:0,z:-18},preferences:{quality:'fake',volume:900}};
  assert.deepEqual(parseProfile(JSON.stringify(unsafe)),freshProfile());
  const storage = {getItem(){throw Error('blocked')},setItem(){throw Error('quota')}};
  assert.equal(readProfile(storage).available,false); assert.equal(writeProfile(storage,freshProfile()),false);
});
test('valid saved settings and safe walking positions survive reload', () => {
  const profile = {...freshProfile(),position:{x:13,z:22},introduced:true,preferences:{quality:'low',volume:.6,reducedMotion:true,daylight:true}};
  let raw; const storage={setItem(key,value){raw=value},getItem(){return raw}};
  assert.equal(writeProfile(storage,profile),true); assert.deepEqual(readProfile(storage).profile,profile);
});
test('sprint keeps normalized diagonal speed and reset clears transient inputs', () => {
  const normal=walkingMovement(1,0,1/60), sprint=walkingMovement(1,1,1/60,true);
  assert.ok(Math.abs(Math.hypot(sprint.x,sprint.z)/Math.abs(normal.z)-1.65)<1e-10);
  walk.sprinting=true;walk.moving=5;walk.toggleDrive=true;resetWalkInput();
  assert.equal(walk.sprinting,false);assert.equal(walk.moving,0);assert.equal(walk.toggleDrive,false);
});
test('shared world clock freezes paused, hidden and reduced motion without catchup', () => {
  gameClock.seconds=0;gameClock.paused=false;gameClock.reduced=false;
  assert.equal(advanceWorld(10),.05);
  assert.equal(advanceWorld(1,true),.05);
  gameClock.paused=true;assert.equal(advanceWorld(1),.05);assert.equal(animationDelta(1),0);
  gameClock.paused=false;gameClock.reduced=true;assert.equal(advanceWorld(1),.05);
  gameClock.reduced=false;assert.equal(advanceWorld(.02),.07);
  assert.deepEqual([0,180,270,360].map(cycleLighting),['day','sunset','night','day']);
});
