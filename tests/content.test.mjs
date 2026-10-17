import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const data = JSON.parse(await readFile(new URL('../data/resources.json', import.meta.url), 'utf8'));
const home = await readFile(new URL('../src/index.template.html', import.meta.url), 'utf8');
const outside = await readFile(new URL('../src/outside.template.html', import.meta.url), 'utf8');

test('published content remains complete', () => {
  assert.equal(data.cards.length, 16);
  assert.equal(data.beforeYouGo.length, 4);
  assert.equal(data.filters.length, 9);
  assert.equal(data.cards.reduce((sum, card) => sum + card.links.length, 0), 80);
});
test('all resource category links on homepage work with real filters', () => {
  const categoryLinks = [...home.matchAll(/\/outside\/\?category=([A-Za-z]+)/g)].map(m => m[1]);
  assert.deepEqual(categoryLinks, ['Routes', 'Conditions', 'Skills', 'Camp']);
  for (const tag of categoryLinks) assert.ok(data.filters.includes(tag));
});
test('no dead future-section navigation', () => {
  assert.ok(home.includes('href="/outside/"'));
  assert.ok(outside.includes('href="/"'));
  assert.ok(!home.includes('href="/projects/"'));
  assert.ok(!home.includes('href="/notes/"'));
  assert.match(home, /Explore\. Learn\./);
});
test('the Outdoors page retains original safety and links placeholders', () => {
  assert.ok(outside.includes('{{CARDS}}'));
  assert.ok(outside.includes('{{FILTERS}}'));
  const ids = new Set(data.cards.map(card => card.id));
  assert.equal(ids.size, 16);
  for (const card of data.cards) {
    assert.ok(card.title && card.description && card.links.length);
    for (const tag of card.tags) assert.ok(data.filters.includes(tag));
  }
  const caution = data.cards.find(card => card.title === 'Wild food')?.caution;
  assert.match(caution ?? '', /Never eat a wild plant/);
});
test('all external links use HTTPS', () => {
  for (const link of [...data.beforeYouGo, ...data.cards.flatMap(card => card.links)]) {
    assert.ok(link.label.trim());
    assert.equal(new URL(link.url).protocol, 'https:');
  }
});
