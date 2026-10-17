import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../data/play.json', import.meta.url), 'utf8'));
const home = await readFile(new URL('../src/index.template.html', import.meta.url), 'utf8');
const playPage = await readFile(new URL('../src/play.template.html', import.meta.url), 'utf8');
const gamePage = await readFile(new URL('../src/game.template.html', import.meta.url), 'utf8');

test('Play is available from the site and is not an empty section', () => {
  assert.match(home, /href="\/play\/"/);
  assert.match(playPage, /{{GAMES}}/);
  assert.match(gamePage, /{{FUN}}/);
  assert.match(gamePage, /{{AUDIENCE}}/);
  assert.ok(data.games.length >= 1);
});
test('Heckmeck recommendation preserves the original observations', () => {
  const heckmeck = data.games.find(g => g.slug === 'heckmeck');
  assert.ok(heckmeck);
  assert.match(heckmeck.theme, /[Ww]orms/);
  assert.match(heckmeck.fun, /interaction between players/);
  assert.match(heckmeck.fun, /steal worms/);
  assert.match(heckmeck.fun, /[Ff]ortunes|secure/);
  assert.equal(heckmeck.amazonUrl, 'https://link.amazon/B0fw3e1Ua');
});
test('game slugs are distinct and all recommendations include experiential copy', () => {
  assert.equal(new Set(data.games.map(g => g.slug)).size, data.games.length);
  for (const game of data.games) {
    assert.match(game.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const key of ['name', 'strapline', 'summary', 'theme', 'fun', 'audience']) {
      assert.ok(game[key]?.trim(), game.slug + ' missing ' + key);
    }
    assert.ok(game.tags.length);
    if (game.amazonUrl) assert.equal(new URL(game.amazonUrl).protocol, 'https:');
  }
});
test('affiliate disclosures are adjacent to links in game template rendering', async () => {
  const builder = await readFile(new URL('../scripts/build.mjs', import.meta.url), 'utf8');
  assert.match(builder, /As an Amazon Associate I earn from qualifying purchases/);
  assert.match(builder, /rel="sponsored noopener noreferrer"/);
});
