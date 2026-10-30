const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const filename = path.resolve('src/components/farm/FarmPanorama.tsx');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
}).outputText;
const moduleUnderTest = new Module(filename, module);
moduleUnderTest.filename = filename;
moduleUnderTest.paths = Module._nodeModulePaths(path.dirname(filename));
moduleUnderTest._compile(compiled, filename);
const { FarmPanorama } = moduleUnderTest.exports;
const render = (props = {}) => renderToStaticMarkup(React.createElement(FarmPanorama, {
  onSelect() {}, onExplore() {}, loading: false, unavailable: false, ...props
}));

test('the first render has a real landscape and all product entrances without waiting for WebGL', () => {
  const html = render();
  assert.match(html, /atlas-homestead.webp/);
  for (const name of ['ReelStyles', 'MentorClone', 'TalkTheDoc', 'medevsmaker']) assert.ok(html.includes(name));
  assert.doesNotMatch(html, /Raising the farm|4 %/);
});

test('unsupported 3D keeps the landscape and product controls visible', () => {
  const html = render({ unavailable: true });
  assert.match(html, /3D isn’t available on this device/);
  assert.match(html, /atlas-homestead.webp/);
  assert.match(html, /Explore the work/);
});

test('loading never replaces the farm with a blocking screen', () => {
  const html = render({ loading: true });
  assert.match(html, /Opening the 3D world/);
  assert.match(html, /atlas-homestead.webp/);
  assert.match(html, /ReelStyles/);
});

test('future visitor and meetup entrances lead to the vision page', () => {
  const html = render();
  assert.match(html, /href="\/gather#meetups"/);
  assert.match(html, /href="\/gather#visiting"/);
  assert.match(html, /Imagined farm/);
});
