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
  assert.match(html, /aria-label="Farm menu"/);
  assert.match(html, /aria-haspopup="dialog">Menu<\/button>/);
  assert.doesNotMatch(html, /world-projects|hud-actions|Walk near a place to interact/);
  assert.ok(html.includes('Opening the 3D farm'));
  assert.doesNotMatch(html, /atlas-homestead.webp/);
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


test('quiet walking HUD offers only useful actions and keeps tractor exit available', () => {
  const { GameOverlay } = require('../src/components/farm/game/GameOverlay.tsx');
  const { freshProfile } = require('../src/farm/game/save.ts');
  const { walk } = require('../src/components/farm/scene/walk-state.ts');
  const noop = () => {};
  const game = { profile: freshProfile(), panel: null, paused: false, storageAvailable: true, message: '', waypoint: null, setPanel: noop, close: noop, act: noop };
  const render = () => renderToStaticMarkup(React.createElement(GameOverlay, { game, ready: true, exploring: true, onExplore: noop, light: 'day', onLight: noop, onToggleExplore: noop, onProduct: noop, onHelp: noop, raised: '$0' }));
  const idle = render();
  assert.match(idle, /Open journal: 0 of 5 activities completed/);
  assert.doesNotMatch(idle, /Drive tractor|Exit tractor|Walk near a place|game-minimap/);
  assert.match(idle, /aria-haspopup="dialog">Menu/);
  const wasDriving = walk.driving;
  try {
    walk.driving = true;
    const driving = render();
    assert.match(driving, /Exit tractor/);
    assert.doesNotMatch(driving, /game-touch-action/);
  } finally { walk.driving = wasDriving; }
});


test('tour chapters render meaningful accessible content, honest vision, credits and safe controls without WebGL',()=>{
  const {TourStory}=require('../src/components/farm/game/TourStory.tsx');
  const {TOUR_STOPS}=require('../src/farm/game/tour.ts');const noop=()=>{};
  for(let index=0;index<TOUR_STOPS.length;index++) {
    const html=renderToStaticMarkup(React.createElement(TourStory,{index,onStep:noop,onWaypoint:noop,onWalk:noop,onHelp:noop,ready:false}));
    assert.ok(html.includes(TOUR_STOPS[index].title));
    assert.match(html,/aria-label="Tour chapters"/);assert.match(html,/aria-current="step"/);
    assert.match(html,/disabled="">Walk here/);
    assert.ok(html.includes(`href="/?tour=${TOUR_STOPS[index].id}"`));
    assert.ok(html.includes(TOUR_STOPS[index].credit));
    if(index===4) assert.match(html,/future concepts, not open bookings/);
  }
});
