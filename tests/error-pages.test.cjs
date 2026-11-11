require('./register-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

/** Depth-first search of an unrendered element tree for the first element of a type. */
function findElement(node, type) {
  if (!React.isValidElement(node)) return null;
  if (node.type === type) return node;
  for (const child of React.Children.toArray(node.props.children)) {
    const found = findElement(child, type);
    if (found) return found;
  }
  return null;
}

test('404 page links to the farm, blog and contact, and is not indexable', () => {
  const { default: NotFound, metadata } = require('../src/app/not-found.tsx');
  const html = renderToStaticMarkup(React.createElement(NotFound));
  for (const href of ['/', '/blog', '/spot/mailbox']) assert.ok(html.includes(`href="${href}"`));
  assert.match(html, /<h1[^>]*>/);
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.ok(metadata.title);
});

test('error page offers Try again that calls reset, a home link and hides the error', () => {
  const { default: ErrorPage } = require('../src/app/error.tsx');
  const error = Object.assign(new Error('secret db password leaked'), { digest: 'abc' });
  let resets = 0;
  const tree = ErrorPage({ error, reset: () => resets++ });
  const html = renderToStaticMarkup(tree);
  assert.match(html, /<button[^>]*>Try again<\/button>/);
  assert.ok(html.includes('href="/"'));
  assert.doesNotMatch(html, /secret|abc/);
  findElement(tree, 'button').props.onClick();
  assert.equal(resets, 1);
});
