const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/farm/loadFarm.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {}, require: () => ({}) };
vm.runInNewContext(compiled, context);
const { findSpot } = context.exports;
const granary = { plot: { id: 'mentorclone' }, item: { id: 'mentorclone', landmark: 'silo' } };

test('the legacy granary sponsorship link opens the MentorClone granary', () => {
  assert.equal(findSpot([granary], 'silo'), granary);
});
test('direct product and plot links remain valid and unknown spots remain absent', () => {
  assert.equal(findSpot([granary], 'mentorclone'), granary);
  assert.equal(findSpot([granary], 'unknown'), null);
});
