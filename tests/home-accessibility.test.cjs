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

test('catalog link names retain the visible phrase for speech navigation', async () => {
  const { default: ListPage } = require('../src/app/list/page.tsx');
  const html = renderToStaticMarkup(await ListPage());
  const links = [...html.matchAll(/aria-label="(Open on the farm:[^"]+)"/g)];
  assert.ok(links.length > 4);
  assert.ok(links.every(match => match[1].startsWith('Open on the farm: ')));
  assert.match(html, /aria-hidden="true">↗<\/span>/);
});

test('small catalog text has at least 4.5:1 contrast against its actual background', () => {
  const css = fs.readFileSync('src/app/list/list.css', 'utf8');
  const colorIn = selector => {
    const rule = css.slice(css.indexOf(selector));
    return rule.slice(0, rule.indexOf('}')).match(/(?:^|[;{])\s*color:\s*(#[0-9a-f]{6})/i)[1];
  };
  const luminance = hex => {
    const values = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
      .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  };
  for (const [selector, background] of [['.farm-directory .directory-kicker', '#f2efe5'], ['.farm-directory .card-list h3 span', '#faf8f0']]) {
    const ratio = (luminance(background) + .05) / (luminance(colorIn(selector)) + .05);
    assert.ok(ratio >= 4.5, `${selector}: ${ratio.toFixed(2)}:1`);
  }
});

test('closing project and support dialogs returns focus to the entrance that opened each one', () => {
  const { createDialogFocusReturn } = require('../src/components/farm/dialog-focus.ts');
  let active = null;
  const focused = [];
  const entrance = name => ({ isConnected: true, focus: options => focused.push([name, options]) });
  const project = entrance('ReelStyles');
  const support = entrance('Help build');
  const handlers = createDialogFocusReturn(() => active);
  for (const target of [project, support]) {
    active = target;
    handlers.onOpenAutoFocus();
    active = entrance('Close');
    const close = new Event('closeAutoFocus', { cancelable: true });
    handlers.onCloseAutoFocus(close);
    assert.equal(close.defaultPrevented, true);
  }
  assert.deepEqual(focused, [['ReelStyles', { preventScroll: true }], ['Help build', { preventScroll: true }]]);
  active = entrance('removed entrance');
  handlers.onOpenAutoFocus();
  active.isConnected = false;
  const detached = new Event('closeAutoFocus', { cancelable: true });
  handlers.onCloseAutoFocus(detached);
  assert.equal(detached.defaultPrevented, false);
  active = null; // Deep links have no entrance; leave Radix's default behavior intact.
  handlers.onOpenAutoFocus();
  handlers.onCloseAutoFocus(new Event('closeAutoFocus', { cancelable: true }));
  assert.equal(focused.length, 2);
});
