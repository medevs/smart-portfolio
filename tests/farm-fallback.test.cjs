const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const filename = path.resolve('src/components/farm/FarmFallback.tsx');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
}).outputText;
const moduleUnderTest = new Module(filename, module);
moduleUnderTest.filename = filename;
moduleUnderTest.paths = Module._nodeModulePaths(path.dirname(filename));
moduleUnderTest._compile(compiled, filename);
const { FarmFallback } = moduleUnderTest.exports;

test('the fallback shows a preview, a description and next steps', () => {
  const html = renderToStaticMarkup(React.createElement(FarmFallback));
  assert.match(html, /atlas-homestead\.webp/);
  assert.match(html, /alt="An imagined Middle Atlas homestead/);
  assert.match(html, /width="640"/);
  assert.match(html, /height="360"/);
  assert.doesNotMatch(html, /loading="lazy"/);
  assert.match(html, /playable 3D farm/);
  assert.match(html, /role="status"/);
  assert.match(html, /<h2[^>]*>The 3D farm couldn’t start/);
  assert.match(html, /href="\/list"/);
  assert.match(html, /href="\/impressum"/);
});

test('boundary, scene failure and WebGL context failure all reach the fallback', () => {
  const experience = fs.readFileSync('src/components/farm/FarmExperience.tsx', 'utf8');
  const root = fs.readFileSync('src/components/farm/scene/SceneRoot.tsx', 'utf8');
  // Error boundary renders it directly.
  assert.match(experience, /if \(this\.state\.failed\)\s*return <FarmFallback \/>/);
  // Every scene failure funnels into failScene, which switches to the failed view that renders it.
  assert.match(experience, /onFailure=\{failScene\}/);
  assert.match(experience, /\{sceneFailed && \([\s\S]*?<FarmPanorama/);
  // The panorama already carries the list and contact links, so the card is not stacked over it.
  assert.doesNotMatch(
    experience,
    /\{sceneFailed && \([\s\S]*?<FarmFallback \/>[\s\S]*?\)\}\s*\{sceneRequested/,
  );
  const panorama = fs.readFileSync('src/components/farm/FarmPanorama.tsx', 'utf8');
  assert.match(panorama, /href="\/list"/);
  assert.match(panorama, /href="\/impressum"/);
  // A missing WebGL context calls onFailure, as does the scene error boundary.
  assert.match(root, /farmContext\([\s\S]*?current\.current\.onFailure\(\)/);
  assert.match(root, /this\.props\.onFailure\(\)/);
});
