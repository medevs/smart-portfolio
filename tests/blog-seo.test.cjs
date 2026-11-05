const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/seo/blogPost.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = {
  exports: {},
  require: () => ({ seoConfig: { siteUrl: 'https://example.test', siteName: 'site' } }),
};
vm.runInNewContext(compiled, context);
const { buildBlogPostMetadata, buildBlogPostingJsonLd } = context.exports;
const post = {
  id: 'hello',
  title: 'Hello </script><b>',
  description: 'About hello',
  date: '2025-03-01',
  author: 'medevsmaker',
};

test('metadata for a real post has canonical, article Open Graph and Twitter card', () => {
  const meta = buildBlogPostMetadata(post);
  assert.equal(meta.alternates.canonical, 'https://example.test/blog/hello');
  assert.equal(meta.openGraph.type, 'article');
  assert.equal(meta.openGraph.url, 'https://example.test/blog/hello');
  assert.equal(meta.openGraph.publishedTime, '2025-03-01T00:00:00.000Z');
  assert.equal(JSON.stringify(meta.openGraph.images), '["/opengraph-image"]');
  assert.equal(meta.twitter.card, 'summary_large_image');
  assert.equal(meta.twitter.title, post.title);
  assert.equal(meta.twitter.description, post.description);
});

test('a missing post keeps the Post Not Found title and is not indexed', () => {
  const meta = buildBlogPostMetadata(null);
  assert.equal(meta.title, 'Post Not Found');
  assert.equal(JSON.stringify(meta.robots), '{"index":false}');
  assert.equal(meta.alternates, undefined);
});

test('BlogPosting JSON-LD has the required fields and escapes </script>', () => {
  const json = buildBlogPostingJsonLd(post);
  assert.ok(!json.includes('<'));
  assert.ok(json.includes('\\u003c/script>'));
  const data = JSON.parse(json);
  assert.equal(data['@type'], 'BlogPosting');
  assert.equal(data.headline, post.title);
  assert.equal(data.description, post.description);
  assert.equal(data.datePublished, '2025-03-01T00:00:00.000Z');
  assert.equal(data.author.name, 'medevsmaker');
  assert.equal(data.url, 'https://example.test/blog/hello');
  assert.equal(data.mainEntityOfPage['@id'], 'https://example.test/blog/hello');
});
