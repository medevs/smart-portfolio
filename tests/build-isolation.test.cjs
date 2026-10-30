const assert = require('node:assert/strict');
const { test } = require('node:test');
const scripts = require('../package.json').scripts;
const vercel = require('../vercel.json');

function commandsReachableFrom(command, seen = new Set()) {
  const commands = [command];
  for (const match of command.matchAll(/npm run ([\w:-]+)/g)) {
    const name = match[1];
    if (seen.has(name)) continue;
    seen.add(name);
    assert.equal(typeof scripts[name], 'string', `Missing npm script: ${name}`);
    commands.push(...commandsReachableFrom(scripts[name], seen));
  }
  return commands;
}

test('local and deployed build chains never reach the database-writing indexer', () => {
  for (const entry of ['npm run build', vercel.buildCommand]) {
    const commands = commandsReachableFrom(entry);
    assert.ok(commands.some(command => command.includes('next build')));
    assert.doesNotMatch(commands.join('\n'), /scripts\/generate\.ts|npm run generate|ts-node/);
  }
});

test('knowledge indexing remains an explicit command', () => {
  assert.match(scripts.generate, /scripts\/generate\.ts/);
});
