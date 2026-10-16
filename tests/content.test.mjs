import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const data = JSON.parse(await readFile(new URL('../data/resources.json', import.meta.url), 'utf8'));

test('published catalogue snapshot is complete', () => {
  assert.equal(data.cards.length, 16);
  assert.equal(data.beforeYouGo.length, 4);
  assert.equal(data.filters.length, 9);
  assert.equal(data.cards.reduce((n, c) => n + c.links.length, 0), 80);
});
test('every card has a unique anchor and valid category filter', () => {
  assert.equal(new Set(data.cards.map(c => c.id)).size, data.cards.length);
  const filters = new Set(data.filters);
  assert.equal(data.filters[0], 'All');
  for (const card of data.cards) {
    assert.ok(card.title && card.description && card.links.length);
    for (const tag of card.tags) assert.ok(filters.has(tag), tag);
  }
});
test('all external links have valid HTTPS destinations and accessible titles', () => {
  for (const link of [...data.beforeYouGo, ...data.cards.flatMap(c => c.links)]) {
    assert.ok(link.label.trim());
    assert.equal(new URL(link.url).protocol, 'https:');
  }
});
test('foraging warning is preserved', () => {
  const food = data.cards.find(c => c.title === 'Wild food');
  assert.match(food?.caution ?? '', /Never eat a wild plant/);
});
