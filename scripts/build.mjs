import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = file => path.join(root, file);
const data = JSON.parse(await readFile(fromRoot('data/resources.json'), 'utf8'));
const escapeHtml = value => String(value).replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const link = (item, className = '') =>
  '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer"' +
  (className ? ' class="' + className + '"' : '') + '>' +
  '<span><strong>' + escapeHtml(item.label) + '</strong>' +
  (item.description ? '<small>' + escapeHtml(item.description) + '</small>' : '') + '</span>' +
  '<span class="external-icon" aria-hidden="true">↗</span>' +
  '<span class="visually-hidden"> opens in a new tab</span></a>';

const filters = data.filters.map((name, index) =>
  '<li><button type="button" class="filter-button" data-filter="' + escapeHtml(name) +
  '" aria-pressed="' + String(index === 0) + '">' + escapeHtml(name) +
  '</button></li>').join('\n');

const before = data.beforeYouGo.map(item =>
  '<li>' + link(item, 'before-link') + '</li>').join('\n');

const cards = data.cards.map((card, index) =>
  '<article class="resource-card accent-' + escapeHtml(card.accent) +
  '" id="' + escapeHtml(card.id) + '" data-card data-tags="' +
  escapeHtml(card.tags.join(' ')) + '" aria-labelledby="' +
  escapeHtml(card.id) + '-title">' +
  '<div class="resource-card__head">' +
  '<span class="map-number" aria-hidden="true">' + String(index + 1).padStart(2, '0') + '</span>' +
  '<h3 id="' + escapeHtml(card.id) + '-title">' + escapeHtml(card.title) + '</h3>' +
  '<p>' + escapeHtml(card.description) + '</p></div>' +
  (card.caution ? '<p class="caution">' + escapeHtml(card.caution) + '</p>' : '') +
  '<ul class="link-list">' + card.links.map(item =>
    '<li>' + link(item) + '</li>').join('\n') + '</ul>' +
  '</article>').join('\n');

const linkCount = data.cards.reduce((sum, card) => sum + card.links.length, 0);
const assets = await Promise.all([
  { input: 'styles.css', stem: 'styles', extension: 'css', token: 'CSS' },
  { input: 'script.js', stem: 'script', extension: 'js', token: 'SCRIPT' }
].map(async ({ input, stem, extension, token }) => {
  const bytes = await readFile(fromRoot('src/' + input));
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  return { token, fileName: stem + '.' + hash + '.' + extension, bytes };
}));
const assetUrls = Object.fromEntries(assets.map(asset => [asset.token, '/' + asset.fileName]));

const placeholders = {
  ...assetUrls,
  COUNT: String(data.cards.length),
  LINKCOUNT: String(linkCount),
  FILTERS: filters,
  BEFORE: before,
  CARDS: cards,
  FOOTER: escapeHtml(data.footer)
};

const render = async name => {
  const template = await readFile(fromRoot('src/' + name + '.template.html'), 'utf8');
  const html = template.replace(/\{\{([A-Z]+)\}\}/g,
    (token, key) => Object.hasOwn(placeholders, key) ? placeholders[key] : token);
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error('Unresolved template placeholder in ' + name);
  return html;
};
await rm(fromRoot('dist'), { recursive: true, force: true });
await mkdir(fromRoot('dist/outside'), { recursive: true });
await writeFile(fromRoot('dist/index.html'), await render('index'));
await writeFile(fromRoot('dist/outside/index.html'), await render('outside'));
for (const asset of assets) {
  await writeFile(fromRoot('dist/' + asset.fileName), asset.bytes);
}
await cp(fromRoot('public'), fromRoot('dist'), { recursive: true });
console.log('Built personal homepage + Outside directory (' + data.cards.length +
  ' resource cards, ' + linkCount + ' links).');
