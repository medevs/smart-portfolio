const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest);
};
for (const extension of ['.ts', '.tsx']) Module._extensions[extension] = function(module, filename) {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, resolveJsonModule: true }
  }).outputText;
  module._compile(compiled, filename);
};
Module._extensions['.css'] = () => {};
const { FarmExperience } = require('../src/components/farm/FarmExperience.tsx');
const { loadFarm } = require('../src/farm/loadFarm.ts');

test('keyboard skip opens the real catalog and duplicate off-screen links are not focusable', async () => {
  const html = renderToStaticMarkup(React.createElement(FarmExperience, { farm: await loadFarm() }));
  assert.match(html, /class="skip-link" href="\/list"/);
  assert.match(html, /<nav id="farm-links" hidden=""/);
  assert.ok(html.includes('Explore the work'));
});

test('the visible catalog prioritizes the main work and preserves sponsor and community routes', async () => {
  const { default: ListPage } = require('../src/app/list/page.tsx');
  const html = renderToStaticMarkup(await ListPage());
  assert.match(html, /<h1>Explore the farm\.<\/h1>/);
  assert.match(html, /<h3>ReelStyles/);
  assert.ok(html.indexOf('<h3>ReelStyles') < html.indexOf('<h3>Granary tower'));
  for (const route of ['/spot/reelstyles', '/spot/mentorclone', '/spot/talkthedoc', '/spot/silo', '/gather', '/open']) assert.ok(html.includes(`href="${route}"`));
  assert.doesNotMatch(html, /The barn is ReelStyles|TODO:/);
});
