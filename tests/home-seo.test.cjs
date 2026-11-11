require('./register-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { seoConfig } = require('../src/config/seo.ts');
const { socialLinks } = require('../src/config/social.ts');
const page = require('../src/app/page.tsx');

const render = async () => renderToStaticMarkup(await page.default());
const graphOf = (html) => {
  const raw = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1];
  return JSON.parse(raw)['@graph'];
};

test('home metadata declares a canonical and matching Open Graph url', () => {
  assert.equal(page.metadata.alternates.canonical, '/');
  assert.equal(page.metadata.openGraph.url, '/');
  assert.equal(page.metadata.openGraph.siteName, seoConfig.siteName);
  assert.equal(page.metadata.openGraph.type, 'website');
  assert.equal(page.metadata.openGraph.locale, seoConfig.openGraph.locale);
});

test('home JSON-LD is a graph with WebSite and ProfessionalService from config', async () => {
  const graph = graphOf(await render());
  const site = graph.find((n) => n['@type'] === 'WebSite');
  const service = graph.find((n) => n['@type'] === 'ProfessionalService');
  assert.equal(site.url, seoConfig.siteUrl);
  assert.equal(service.name, 'medevsmaker');
  assert.equal(service.url, seoConfig.siteUrl);
  assert.match(service.description, /interactive 3D farm walkthroughs/);
  assert.deepEqual(
    service.sameAs,
    socialLinks.map((l) => l.url),
  );
});

test('page.tsx does not hardcode the site host', () => {
  assert.doesNotMatch(fs.readFileSync('src/app/page.tsx', 'utf8'), /https?:\/\/medevsmaker/);
});

test('server HTML has sr-only crawlable links, one sentence and a single h1', async () => {
  const html = await render();
  const nav = html.match(/<nav class="sr-only"[^>]*>.*?<\/nav>/)[0];
  for (const route of ['/list', '/blog', '/references', '/open', '/gather'])
    assert.ok(nav.includes(`<a href="${route}">`), route);
  assert.match(nav, /interactive 3D farm walkthroughs/);
  assert.equal(nav.includes('/work/3d-walkthroughs'), fs.existsSync('src/app/work'));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
});
