import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const data = JSON.parse(await readFile(new URL('../data/play.json', import.meta.url), 'utf8'));
const home = await readFile(new URL('../src/index.template.html', import.meta.url), 'utf8');
const playPage = await readFile(new URL('../src/play.template.html', import.meta.url), 'utf8');
const gamePage = await readFile(new URL('../src/game.template.html', import.meta.url), 'utf8');

test('Play is available from the site and is not an empty section', () => {
  assert.match(home, /href="\/play\/"/);
  assert.match(playPage, /{{GAMES}}/);
  assert.match(playPage, /{{PLAYFILTERS}}/);
  assert.match(playPage, /src="{{SCRIPT}}"/);
  assert.match(gamePage, /{{TYPE}}/);
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

test('Bärenpark recommendation preserves space optimisation, choices and monorail context', () => {
  const game = data.games.find(game => game.slug === 'barenpark');
  assert.ok(game);
  assert.equal(game.name, 'Bärenpark');
  assert.equal(game.type, 'board');
  assert.equal(game.art, 'tiles');
  assert.match(game.theme, /different kinds of bears/);
  assert.match(game.fun, /irregular shapes/);
  assert.match(game.fun, /limited space/);
  assert.match(game.fun, /which pieces you can take next/);
  assert.match(game.fun, /other people tackle the same problem/);
  assert.match(game.fun, /Bad News Bears expansion adds a monorail/);
  assert.ok(game.tags.includes('2–4 players'));
  assert.equal(game.amazonUrl, 'https://link.amazon/B0dU9YJQY');
});

test('OK Play recommendation preserves the accessible tactile play and six-player distinction', () => {
  const game = data.games.find(game => game.slug === 'ok-play');
  assert.ok(game);
  assert.equal(game.name, 'OK Play');
  assert.equal(game.type, 'board');
  assert.equal(game.art, 'tiles');
  assert.match(game.theme, /Connect Four without the board/);
  assert.match(game.fun, /tactile/);
  assert.match(game.fun, /start moving pieces around/);
  assert.match(game.fun, /With six people/);
  assert.match(game.fun, /attacking, defending/);
  assert.match(game.audience, /harder-to-find OK Play Duo/);
  assert.ok(game.tags.includes('2–4 players'));
  assert.equal(game.amazonUrl, 'https://link.amazon/B0dyq0yOw');
});

test('licensed photo metadata is complete, attributed and restricted to reviewed games', () => {
  const withImages = data.games.filter(game => Boolean(game.image));
  assert.deepEqual(withImages.map(game => game.slug), ['6-nimmt']);
  const photo = withImages[0].image;
  assert.match(photo.alt, /numbered 6 nimmt!/);
  assert.equal(photo.photographer, 'Muu-karhu');
  assert.equal(photo.license, 'CC BY-SA 3.0');
  assert.match(photo.source, /commons.wikimedia.org/);
  assert.match(photo.changes, /without cropping/);
  for (const game of withImages) {
    for (const key of ['url', 'alt', 'photographer', 'source', 'license', 'licenseUrl', 'changes']) {
      assert.ok(game.image[key]?.trim(), key + ' missing for ' + game.slug);
    }
    for (const key of ['url', 'source', 'licenseUrl']) {
      assert.equal(new URL(game.image[key]).protocol, 'https:');
    }
  }
});

test('Play classification is explicit, singular, and covers the expected physical formats', () => {
  assert.deepEqual(Object.fromEntries(data.games.map(({slug,type}) => [slug,type])), {
    heckmeck: 'dice',
    cascadia: 'board',
    '6-nimmt': 'card',
    tenby: 'card',
    'the-mind': 'card',
    barenpark: 'board',
    'ok-play': 'board'
  });
  assert.deepEqual(new Set(data.games.map(game => game.type)), new Set(['board', 'dice', 'card']));
});

test('Play filters work by type, support direct links and leave Outside untouched', async () => {
  const script = await readFile(new URL('../src/script.js', import.meta.url), 'utf8');
  const buttons = ['all', 'board', 'dice', 'card'].map(type => ({
    dataset: {playFilter:type},
    attributes: {},
    listeners: {},
    setAttribute(key, val) { this.attributes[key] = val; },
    addEventListener(name, fn) { this.listeners[name] = fn; }
  }));
  const cards = data.games.map(game => ({dataset: {gameType: game.type}, hidden: false}));
  const status = {textContent: ''};
  let current = new URL('https://smooks.co.uk/play/?type=card');
  const sandbox = {
    document: {
      querySelectorAll(selector) {
        if (selector === '[data-play-filter]') return buttons;
        if (selector === '[data-play-card]') return cards;
        return [];
      },
      getElementById(id) { return id === 'play-filter-status' ? status : null; }
    },
    URL, URLSearchParams,
    window: {
      get location() {return current;},
      history: {replaceState(_state,_title,url) {current = new URL(String(url));}}
    }
  };
  vm.runInNewContext(script, sandbox);
  assert.deepEqual(cards.map(c => c.hidden), [true,true,false,false,false,true,true]);
  assert.equal(buttons[3].attributes['aria-pressed'], 'true');
  assert.equal(status.textContent, 'Showing 3 card games.');
  buttons[2].listeners.click();
  assert.deepEqual(cards.map(c => c.hidden), [false,true,true,true,true,true,true]);
  assert.equal(status.textContent, 'Showing 1 dice game.');
  assert.equal(current.searchParams.get('type'), 'dice');
  buttons[1].listeners.click();
  assert.deepEqual(cards.map(c => c.hidden), [true,false,true,true,true,false,false]);
  assert.equal(status.textContent, 'Showing 3 board games.');
  assert.equal(current.searchParams.get('type'), 'board');
  buttons[0].listeners.click();
  assert.ok(cards.every(c => !c.hidden));
  assert.equal(current.searchParams.has('type'), false);
  assert.equal(status.textContent, 'Showing all 7 games.');
});

test('game slugs are distinct and all recommendations include experiential copy', () => {
  assert.equal(new Set(data.games.map(g => g.slug)).size, data.games.length);
  for (const game of data.games) {
    assert.match(game.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const key of ['name', 'strapline', 'summary', 'theme', 'fun', 'audience']) {
      assert.ok(game[key]?.trim(), game.slug + ' missing ' + key);
    }
    assert.ok(game.tags.length);
    assert.ok(['board','dice','card'].includes(game.type));
    assert.ok(['dice', 'cards', 'tiles', 'abstract'].includes(game.art));
    if (game.amazonUrl) assert.equal(new URL(game.amazonUrl).protocol, 'https:');
  }
});
test('affiliate disclosures are adjacent to links in game template rendering', async () => {
  const builder = await readFile(new URL('../scripts/build.mjs', import.meta.url), 'utf8');
  assert.match(builder, /As an Amazon Associate I earn from qualifying purchases/);
  assert.match(builder, /rel="sponsored noopener noreferrer"/);
});
