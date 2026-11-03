const assert = require('node:assert/strict');
const { test } = require('node:test');
require('./register-ts.cjs');
const { getPostData, getAllPostIds, getSortedPostsData } = require('../utils/markdown.ts');
const { remarkHeadingIds } = require('../src/lib/markdown-headings.ts');
const { replaceKnowledgeIndex } = require('../src/lib/knowledge-index.ts');
const { createAmbienceEngine } = require('../src/components/farm/game/ambience-engine.ts');
const { textStream } = require('../src/lib/text-stream.ts');

test('blog unknown IDs and path traversal return absence, and static routes use flat App Router params', async () => {
  for (const id of ['audit-post-does-not-exist', '../README', '..%2fREADME', '%', '', 'a/b'])
    assert.equal(await getPostData(id), null);
  const ids = await getAllPostIds();
  assert.ok(ids.length >= 5);
  for (const params of ids) {
    assert.deepEqual(Object.keys(params), ['id']);
    assert.ok((await getPostData(params.id)).title);
  }
  const posts = await getSortedPostsData();
  assert.ok(posts.every((post) => Array.isArray(post.tags) && !('content' in post)));
  assert.deepEqual(
    posts.map((post) => post.date),
    posts
      .map((post) => post.date)
      .sort()
      .reverse(),
  );
});

test('headings get stable unique server-rendered anchors for duplicates, Unicode and empty titles', () => {
  const titles = ['Same', 'Same', 'Same-2', 'Café', '中文', '!!!'];
  const tree = {
    type: 'root',
    children: titles.map((value) => ({ type: 'heading', children: [{ type: 'text', value }] })),
  };
  remarkHeadingIds()(tree);
  const ids = tree.children.map((node) => node.data.hProperties.id);
  assert.deepEqual(ids, ['same', 'same-2', 'same-2-2', 'cafe', '中文', 'section']);
  remarkHeadingIds()(tree);
  assert.deepEqual(
    tree.children.map((node) => node.data.hProperties.id),
    ids,
  );
});

test('sponsorship endpoint never acknowledges a queue entry without storage', async () => {
  const { POST } = require('../src/app/api/sponsor/route.ts');
  const response = await POST(
    new Request('https://example.test/api/sponsor', {
      method: 'POST',
      body: JSON.stringify({ name: 'Visitor', spotId: 'plot' }),
    }),
  );
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.id, undefined);
  assert.notEqual(body.status, 'queued');
});

test('a failed or unverifiable index write never removes the previous knowledge index', async () => {
  let removed = false;
  const base = {
    documents: ['new'],
    snapshot: async () => ['old'],
    remove: async () => {
      removed = true;
    },
  };
  await assert.rejects(
    replaceKnowledgeIndex({
      ...base,
      add: async () => {
        throw Error('Provider failed');
      },
    }),
  );
  await assert.rejects(replaceKnowledgeIndex({ ...base, add: async () => [] }));
  await assert.rejects(replaceKnowledgeIndex({ ...base, documents: [], add: async () => [] }));
  assert.equal(removed, false);
  const operations = [];
  await replaceKnowledgeIndex({
    documents: ['new'],
    snapshot: async () => ['old'],
    add: async () => {
      operations.push('write');
      return ['new-id'];
    },
    remove: async (ids) => {
      operations.push('remove');
      assert.deepEqual(ids, ['old']);
    },
  });
  assert.deepEqual(operations, ['write', 'remove']);
});

function audioFixture() {
  let resume;
  const calls = { closed: 0, started: 0, stopped: 0, level: 0 };
  const connect = () => ({ connect });
  const context = {
    state: 'running',
    sampleRate: 1,
    currentTime: 0,
    destination: {},
    resume: () =>
      new Promise((resolve) => {
        resume = resolve;
      }),
    close: async () => {
      calls.closed++;
    },
    createBuffer: () => ({ getChannelData: () => new Float32Array(4) }),
    createBufferSource: () => ({
      connect,
      start() {
        calls.started++;
      },
      stop() {
        calls.stopped++;
      },
    }),
    createBiquadFilter: () => ({ frequency: { value: 0 }, connect }),
    createGain: () => ({
      gain: {
        value: 0,
        setTargetAtTime(value) {
          calls.level = value;
        },
      },
      connect,
    }),
  };
  return { context, calls, resume: () => resume() };
}

test('cancelling pending audio closes its context and prevents a late source from starting', async () => {
  const fixture = audioFixture(),
    engine = createAmbienceEngine(() => fixture.context);
  const pending = engine.start();
  engine.stop();
  fixture.resume();
  assert.equal(await pending, 'cancelled');
  assert.equal(fixture.calls.closed, 1);
  assert.equal(fixture.calls.started, 0);
  assert.equal(engine.active, false);
});

test('playing audio accepts pause/volume updates and releases its source once', async () => {
  const fixture = audioFixture(),
    engine = createAmbienceEngine(() => fixture.context);
  const pending = engine.start();
  fixture.resume();
  assert.equal(await pending, 'started');
  engine.setLevel(0.04);
  assert.equal(fixture.calls.level, 0.04);
  engine.setLevel(0);
  assert.equal(fixture.calls.level, 0);
  engine.stop();
  engine.stop();
  assert.equal(fixture.calls.started, 1);
  assert.equal(fixture.calls.stopped, 1);
  assert.equal(fixture.calls.closed, 1);
});

test('stream cancellation aborts upstream work and releases the iterator', async () => {
  const abort = new AbortController();
  let released = false;
  const source = {
    [Symbol.asyncIterator]: () => ({
      next: async () => ({ value: 'Hello 🌲', done: false }),
      return: async () => {
        released = true;
        return { done: true };
      },
    }),
  };
  const reader = textStream(source, abort).getReader();
  assert.equal(new TextDecoder().decode((await reader.read()).value), 'Hello 🌲');
  await reader.cancel();
  assert.equal(abort.signal.aborted, true);
  assert.equal(released, true);
});

test('streaming preserves text and appends its follow-up once', async () => {
  async function* source() {
    yield 'Hello ';
    yield '🌲';
  }
  assert.equal(
    await new Response(textStream(source(), new AbortController(), ' Follow-up.')).text(),
    'Hello 🌲 Follow-up.',
  );
});

test('farm validation covers sponsor placements, plot spans, counters and nonfinite ledger entries', async () => {
  const { loadFarm, assertFarm } = require('../src/farm/loadFarm.ts');
  const farm = await loadFarm();
  assert.doesNotThrow(() => assertFarm(farm));
  const invalid = (mutate) => {
    const data = structuredClone(farm);
    mutate(data);
    assert.throws(() => assertFarm(data));
  };
  invalid((data) => {
    data.plots[0].cols = data.grid.cols + 1;
  });
  invalid((data) => {
    data.plots[0].row = 0.5;
  });
  invalid((data) => {
    data.sponsors.plotsSold = -1;
  });
  invalid((data) => {
    data.sponsors.placed.push({ ...data.plots[0], sponsor: { name: 'Visitor' } });
  });
  invalid((data) => {
    data.sponsors.placed.push({
      id: 'new',
      itemId: 'missing',
      col: 0,
      row: 0,
      sponsor: { name: 'Visitor' },
    });
  });
  invalid((data) => {
    data.fund.entries.push({ amount: NaN });
  });
});

test('money retains cents and invalid landmark counters cannot produce an infinite price', () => {
  const { formatMoney, landmarkPrice } = require('../src/config/shop.ts');
  assert.equal(formatMoney(49.25), '$49.25');
  assert.equal(formatMoney(49), '$49');
  assert.equal(landmarkPrice(2), 1000);
  for (const n of [NaN, Infinity, -1, 0.5, 1000]) assert.throws(() => landmarkPrice(n));
});

test('sponsorship availability renders without a fake submission or payment control', async () => {
  const React = require('react'),
    { renderToStaticMarkup } = require('react-dom/server');
  const { SponsorshipNotice } = require('../src/components/farm/SponsorshipNotice.tsx');
  const { offerings } = require('../src/config/shop.ts'),
    { loadFarm } = require('../src/farm/loadFarm.ts');
  const html = renderToStaticMarkup(
    React.createElement(SponsorshipNotice, {
      offering: offerings[0],
      sponsors: (await loadFarm()).sponsors,
    }),
  );
  assert.match(html, /not available yet/);
  assert.match(html, /href="\/impressum"/);
  assert.doesNotMatch(html, /<form|<input|Submit for approval|paypal\.com/);
});

test('Markdown renders heading anchors and one valid code block directly in server HTML', () => {
  const React = require('react'),
    { renderToStaticMarkup } = require('react-dom/server');
  const Markdown = require('../src/components/MarkdownContent.tsx').default;
  const html = renderToStaticMarkup(
    React.createElement(Markdown, { content: '# Repeat\n\n## Repeat\n\n```\nhello\n```' }),
  );
  assert.match(html, /id="repeat"/);
  assert.match(html, /id="repeat-2"/);
  assert.equal((html.match(/<pre(?:\s|>)/g) ?? []).length, 1);
  assert.match(html, /data-article-content/);
});

test('the chat endpoint reports missing configuration without invoking a provider', async () => {
  const key = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const { POST } = require('../src/app/api/chat/route.ts');
    const response = await POST(
      new Request('https://example.test/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
      }),
    );
    assert.equal(response.status, 503);
  } finally {
    if (key !== undefined) process.env.OPENAI_API_KEY = key;
  }
});

test('article category links filter real posts and unknown categories fall back to all', async () => {
  const React = require('react'),
    { renderToStaticMarkup } = require('react-dom/server');
  const BlogPage = require('../src/app/blog/page.tsx').default;
  const html = renderToStaticMarkup(
    await BlogPage({ searchParams: Promise.resolve({ category: 'Web Development' }) }),
  );
  assert.match(html, /href="\/blog\/laravel-react-crash-course"/);
  assert.doesNotMatch(html, /href="\/blog\/building-ai-agents-nextjs-langchain"/);
  assert.match(html, /aria-current="page"/);
  const all = renderToStaticMarkup(
    await BlogPage({ searchParams: Promise.resolve({ category: 'unknown' }) }),
  );
  assert.match(all, /href="\/blog\/building-ai-agents-nextjs-langchain"/);
});

test('unknown and malformed spot URLs signal a 404 instead of double-decoding or rendering an empty farm', async () => {
  const SpotPage = require('../src/app/spot/[id]/page.tsx').default;
  for (const id of ['unknown-audit-spot', '%']) {
    await assert.rejects(SpotPage({ params: Promise.resolve({ id }) }), (error) =>
      String(error.digest).endsWith(';404'),
    );
  }
});

test('knowledge indexing cannot silently fall back to an anonymous database key', async () => {
  const keys = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.SUPABASE_URL = 'https://portfolio.test';
  process.env.SUPABASE_ANON_KEY = 'reader-fixture';
  delete process.env.SUPABASE_SECRET_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const { getIndexingStore } = require('../src/lib/supabase.ts');
    await assert.rejects(getIndexingStore(), /server-only/);
  } finally {
    for (const key of keys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});

test('a slow stream reader does not drain the upstream producer eagerly', async () => {
  let reads = 0;
  const source = {
    [Symbol.asyncIterator]: () => ({
      next: async () => ({ value: String(++reads), done: false }),
      return: async () => ({ done: true }),
    }),
  };
  const stream = textStream(source, new AbortController());
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(reads <= 1);
  const reader = stream.getReader();
  await reader.read();
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(reads <= 2);
  await reader.cancel();
});
