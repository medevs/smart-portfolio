require('./register-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { items } = require('../src/farm/items.ts');
const { visibleLinks } = require('../src/farm/links.ts');

const placeholder = /todo|not in the site yet/i;

test('no farm item shows placeholder copy in its pitch or visible links', () => {
  for (const item of items) {
    assert.doesNotMatch(item.pitch ?? '', placeholder, `${item.id} pitch`);
    for (const link of visibleLinks(item.links)) {
      assert.doesNotMatch(link.label, placeholder, `${item.id} link ${link.label}`);
      assert.ok(link.href, `${item.id} link ${link.label} has no href`);
    }
  }
});

test('visibleLinks drops todo and empty-href links and keeps real ones', () => {
  const real = { label: 'Site', href: 'https://example.com' };
  const result = visibleLinks([
    { label: 'Pending', href: 'https://example.com/x', todo: true },
    { label: 'Empty', href: '' },
    { label: 'Blank', href: '  ' },
    real,
  ]);
  assert.deepEqual(result, [real]);
  assert.deepEqual(visibleLinks(undefined), []);
});
