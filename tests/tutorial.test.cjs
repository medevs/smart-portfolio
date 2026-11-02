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

const {freshPractice,practiceStep,LESSONS}=require('../src/farm/game/tutorial.ts');
const {freshProgress}=require('../src/farm/game/progress.ts');
const {HARVEST_APPLES}=require('../src/farm/game/journey.ts');
const {destination}=require('../src/farm/game/world.ts');
const context={trailer:{x:0,z:5.5},loading:{x:-3.75,z:5.5},speed:0};

test('guided visit explains navigation, real ordered tasks, each apple and optional foot delivery',()=>{
  const original=freshProgress();let practice=freshPractice();
  assert.equal(practiceStep(practice,original,context).id,'move');practice={...practice,moved:true};
  assert.equal(practiceStep(practice,original,context).id,'look');practice.looked=true;
  assert.equal(practiceStep(practice,original,context).id,'studio');assert.deepEqual(original,freshProgress(),'guidance cannot award tasks');
  let progress={completed:['studio'],water:0,apples:0};
  assert.equal(practiceStep(practice,progress,context).id,'well');
  progress={...progress,completed:['studio','well'],water:3};assert.equal(practiceStep(practice,progress,context).id,'garden');
  progress={...progress,completed:['studio','well','garden'],water:2,picked:[0],apples:1};
  let step=practiceStep(practice,progress,context);assert.equal(step.id,'pick');assert.deepEqual(step.target,HARVEST_APPLES[1]);assert.match(step.title,/1\/3/);
  progress={...progress,completed:[...progress.completed,'orchard'],picked:[0,1,2],apples:3,basket:'carried'};
  assert.equal(practiceStep(practice,progress,context).id,'load');
  assert.equal(practiceStep({...practice,route:'walk'},progress,context).id,'table');
  progress={...progress,completed:[...progress.completed,'table'],apples:0};assert.equal(practiceStep(practice,progress,context).id,'done');
});

test('trailer tutorial distinguishes driving, braking, unloading and final table interaction',()=>{
  const practice={moved:true,looked:true,loaded:true,route:'tractor'};
  const progress={completed:['studio','well','garden','orchard'],water:2,apples:3,basket:'trailer'};
  assert.equal(practiceStep(practice,progress,context).id,'drive');
  const nearby={...context,trailer:destination('table'),loading:{x:-3,z:23.2},speed:1};
  assert.equal(practiceStep(practice,progress,nearby).id,'brake');
  const stopped={...nearby,speed:0};const unload=practiceStep(practice,progress,stopped);
  assert.equal(unload.id,'unload');assert.deepEqual(unload.target,stopped.loading);
  assert.equal(practiceStep(practice,{...progress,basket:'carried'},stopped).id,'table');
  assert.equal(progress.apples,3,'reading directions cannot unload inventory');
});

test('every lesson supplies keyboard and touch instructions and a complete navigation/delivery path',()=>{
  assert.equal(LESSONS.length,7);
  for(const lesson of LESSONS){assert.ok(lesson.keys.length>5);assert.ok(lesson.touch.length>5);assert.ok(lesson.body.length>90);}
  const text=LESSONS.map(l=>l.body).join(' ');
  for(const phrase of ['Escape','pinch','waypoint','low branches','stopped','back','Reverse','unload','optional'])assert.ok(text.includes(phrase),phrase);
});
