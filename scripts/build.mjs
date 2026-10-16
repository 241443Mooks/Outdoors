import { readFile, writeFile, mkdir, cp, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = (file) => path.join(root, file);
const data = JSON.parse(await readFile(fromRoot('data/resources.json'), 'utf8'));
const template = await readFile(fromRoot('src/index.template.html'), 'utf8');
const escapeHtml = (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const link = (item, className = '') => '<a href="' + escapeHtml(item.url) +
  '" target="_blank" rel="noopener noreferrer"' + (className ? ' class="' + className + '"' : '') + '>' +
  '<span><strong>' + escapeHtml(item.label) + '</strong>' +
  (item.description ? '<small>' + escapeHtml(item.description) + '</small>' : '') + '</span>' +
  '<span class="external-icon" aria-hidden="true">↗</span>' +
  '<span class="visually-hidden"> opens in a new tab</span></a>';
const filters = data.filters.map((filter, index) =>
  '<li><button class="filter-button" type="button" data-filter="' + escapeHtml(filter) +
  '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '">' +
  escapeHtml(filter) + '</button></li>').join('\n');
const before = data.beforeYouGo.map(item =>
  '<li>' + link(item, 'before-link') + '</li>').join('\n');
const cards = data.cards.map((card, index) =>
  '<article id="' + escapeHtml(card.id) +
  '" class="resource-card accent-' + escapeHtml(card.accent) + '"' +
  ' data-card data-tags="' + escapeHtml(card.tags.join(' ')) +
  '" aria-labelledby="' + escapeHtml(card.id) + '-title">' +
  '<div class="resource-card__head">' +
  '<span class="map-number" aria-hidden="true">' + String(index + 1).padStart(2, '0') + '</span>' +
  '<h3 id="' + escapeHtml(card.id) + '-title">' + escapeHtml(card.title) + '</h3>' +
  '<p>' + escapeHtml(card.description) + '</p></div>' +
  (card.caution ? '<p class="caution">' + escapeHtml(card.caution) + '</p>' : '') +
  '<ul class="link-list">' + card.links.map(item => '<li>' + link(item) + '</li>').join('\n') + '</ul>' +
  '</article>').join('\n');
const replacements = {
  HEADLINE: data.headline, DESCRIPTION: data.description, FOOTER: data.footer,
  COUNT: String(data.cards.length), FILTERS: filters, BEFORE: before, CARDS: cards
};
const page = template.replace(/\{\{([A-Z]+)\}\}/g, (whole, key) =>
  Object.hasOwn(replacements, key) ? replacements[key] : whole);
await mkdir(fromRoot('dist'), { recursive: true });
await writeFile(fromRoot('dist/index.html'), page);
await copyFile(fromRoot('src/styles.css'), fromRoot('dist/styles.css'));
await copyFile(fromRoot('src/script.js'), fromRoot('dist/script.js'));
await cp(fromRoot('public'), fromRoot('dist'), { recursive: true });
console.log('Built ' + data.cards.length + ' cards with ' +
  data.cards.reduce((n, card) => n + card.links.length, 0) + ' resource links.');
