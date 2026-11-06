require('./register-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { seoConfig } = require('../src/config/seo.ts');
const { loadFarm, placePlots, findSpot } = require('../src/farm/loadFarm.ts');
const { buildSpotMetadata } = require('../src/seo/spot.ts');
const sitemap = require('../src/app/sitemap.ts').default;

const prefix = `${seoConfig.siteUrl}/spot/`;

test('sitemap lists spot pages once each, monthly at priority 0.5', async () => {
  const spots = (await sitemap()).filter((entry) => entry.url.startsWith(prefix));
  assert.ok(spots.length > 0);
  assert.equal(new Set(spots.map((entry) => entry.url)).size, spots.length);
  for (const entry of spots) {
    assert.equal(entry.changeFrequency, 'monthly');
    assert.equal(entry.priority, 0.5);
  }
});

test('every sitemap spot url resolves to a spot, so none returns 404', async () => {
  const placed = placePlots(await loadFarm());
  const spots = (await sitemap()).filter((entry) => entry.url.startsWith(prefix));
  for (const entry of spots) {
    const id = decodeURIComponent(entry.url.slice(prefix.length));
    assert.ok(findSpot(placed, id), `${entry.url} would 404`);
  }
});

test('spot metadata has a canonical on the configured site url, shared with openGraph', () => {
  const meta = buildSpotMetadata('mentorclone', 'MentorClone');
  assert.equal(meta.alternates.canonical, `${seoConfig.siteUrl}/spot/mentorclone`);
  assert.equal(meta.openGraph.url, meta.alternates.canonical);
  assert.equal(meta.title, 'MentorClone');
});
