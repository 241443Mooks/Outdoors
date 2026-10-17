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
test('Cascadia recommendation prioritises building a beautiful ecosystem', () => {
  const cascadia = data.games.find(game => game.slug === 'cascadia');
  assert.ok(cascadia);
  assert.match(cascadia.theme, /ecosystem/);
  assert.match(cascadia.fun, /landscape grow/);
  assert.match(cascadia.fun, /scoring rules change/);
  assert.match(cascadia.fun, /several priorities/);
  assert.equal(cascadia.art, 'tiles');
  assert.ok(cascadia.tags.includes('1–4 players'));
  assert.equal(cascadia.amazonUrl, 'https://link.amazon/B06tRUIJR');
});

test('6 nimmt recommendation preserves the social judgement and changing strategy', () => {
  const game = data.games.find(game => game.slug === '6-nimmt');
  assert.ok(game);
  assert.equal(game.name, '6 nimmt!');
  assert.match(game.fun, /cards they might choose/);
  assert.match(game.fun, /there isn't one strategy that always works/);
  assert.match(game.fun, /terrible decisions/);
  assert.match(game.audience, /couple of hands/);
  assert.ok(game.tags.includes('2–10 players'));
  assert.equal(game.art, 'cards');
  assert.equal(game.amazonUrl, 'https://link.amazon/B05rwYzSQ');
});

test('Tenby recommendation preserves personal observations and distinct affiliate link', () => {
  const tenby = data.games.find(game => game.slug === 'tenby');
  assert.ok(tenby);
  assert.match(tenby.theme, /Welsh seaside town/);
  assert.match(tenby.fun, /wide table/);
  assert.match(tenby.fun, /at the mercy/);
  assert.match(tenby.fun, /difficult to master/);
  assert.ok(tenby.tags.includes('1–5 players'));
  assert.equal(tenby.art, 'cards');
  assert.equal(tenby.amazonUrl, 'https://link.amazon/B0isct9tj');
});

test('The Mind recommendation keeps the silence, relationships and shared focus central', () => {
  const game = data.games.find(game => game.slug === 'the-mind');
  assert.ok(game);
  assert.equal(game.name, 'The Mind');
  assert.match(game.theme, /ascending order/);
  assert.match(game.fun, /tense and intense/);
  assert.match(game.fun, /people you're really close to/);
  assert.match(game.fun, /shared rhythm/);
  assert.match(game.audience, /everyone is willing to give it their attention/);
  assert.ok(game.tags.includes('2–4 players'));
  assert.ok(game.tags.includes('Cooperative'));
  assert.equal(game.art, 'cards');
  assert.equal(game.amazonUrl, 'https://link.amazon/B08fIOBLp');
});

test('game slugs are distinct and all recommendations include experiential copy', () => {
  assert.equal(new Set(data.games.map(g => g.slug)).size, data.games.length);
  for (const game of data.games) {
    assert.match(game.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const key of ['name', 'strapline', 'summary', 'theme', 'fun', 'audience']) {
      assert.ok(game[key]?.trim(), game.slug + ' missing ' + key);
    }
    assert.ok(game.tags.length);
    assert.ok(['dice', 'cards', 'tiles', 'abstract'].includes(game.art));
    if (game.amazonUrl) assert.equal(new URL(game.amazonUrl).protocol, 'https:');
  }
});
test('affiliate disclosures are adjacent to links in game template rendering', async () => {
  const builder = await readFile(new URL('../scripts/build.mjs', import.meta.url), 'utf8');
  assert.match(builder, /As an Amazon Associate I earn from qualifying purchases/);
  assert.match(builder, /rel="sponsored noopener noreferrer"/);
});
