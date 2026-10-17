import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = file => path.join(root, file);
const data = JSON.parse(await readFile(fromRoot('data/resources.json'), 'utf8'));
const play = JSON.parse(await readFile(fromRoot('data/play.json'), 'utf8'));
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

// Game recommendations are kept as data so that adding a game does not require
// editing page HTML. Titles and notes are escaped before being inserted.
const knownSlugs = new Set();
for (const game of play.games) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug) || knownSlugs.has(game.slug)) {
    throw new Error('Invalid or repeated game slug: ' + game.slug);
  }
  knownSlugs.add(game.slug);
  for (const key of ['name', 'strapline', 'summary', 'theme', 'fun', 'audience']) {
    if (typeof game[key] !== 'string' || !game[key].trim()) {
      throw new Error('Missing game ' + key + ' for ' + game.slug);
    }
  }
  if (!Array.isArray(game.tags) || !game.tags.length) throw new Error('Missing tags for ' + game.slug);
  if (game.art !== 'dice') throw new Error('Unknown game art treatment for ' + game.slug);
  if (game.amazonUrl) {
    const target = new URL(game.amazonUrl);
    if (target.protocol !== 'https:') throw new Error('Affiliate links require HTTPS');
  }
}
const gameTags = game => game.tags.map(tag => '<span class="game-tag">' + escapeHtml(tag) + '</span>').join('');
const gameArt = '<span aria-hidden="true">⚄</span><span aria-hidden="true">⚂</span><span aria-hidden="true">⚅</span>';
const gameCards = play.games.map(game =>
  '<article class="play-card"><a class="play-card__link" href="/play/' + escapeHtml(game.slug) + '/">' +
  '<div class="play-card__art" aria-hidden="true">' + gameArt + '</div>' +
  '<div class="play-card__body"><span class="play-card__label">Board game</span>' +
  '<strong class="play-card__heading">' + escapeHtml(game.name) + '</strong>' +
  '<p>' + escapeHtml(game.summary) + '</p>' +
  '<span class="play-card__more">A closer look ↗</span></div></a></article>'
).join('\n');
const amazonLink = game => game.amazonUrl
  ? '<p class="affiliate-notice">Affiliate link. As an Amazon Associate I earn from qualifying purchases.</p>' +
    '<a class="button button--forest" href="' + escapeHtml(game.amazonUrl) +
    '" target="_blank" rel="sponsored noopener noreferrer">View on Amazon <span aria-hidden="true">↗</span></a>'
  : '';

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
  FOOTER: escapeHtml(data.footer),
  GAMECOUNT: String(play.games.length) + (play.games.length === 1 ? ' game' : ' games'),
  GAMES: gameCards
};

const render = async (name, pageValues = {}) => {
  const template = await readFile(fromRoot('src/' + name + '.template.html'), 'utf8');
  const values = { ...placeholders, ...pageValues };
  const html = template.replace(/\{\{([A-Z]+)\}\}/g,
    (token, key) => Object.hasOwn(values, key) ? values[key] : token);
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error('Unresolved template placeholder in ' + name);
  return html;
};
await rm(fromRoot('dist'), { recursive: true, force: true });
await mkdir(fromRoot('dist/outside'), { recursive: true });
await mkdir(fromRoot('dist/play'), { recursive: true });
await writeFile(fromRoot('dist/index.html'), await render('index'));
await writeFile(fromRoot('dist/outside/index.html'), await render('outside'));
await writeFile(fromRoot('dist/play/index.html'), await render('play'));
for (const game of play.games) {
  const folder = fromRoot('dist/play/' + game.slug);
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, 'index.html'), await render('game', {
    NAME: escapeHtml(game.name),
    SLUG: escapeHtml(game.slug),
    STRAPLINE: escapeHtml(game.strapline),
    SUMMARY: escapeHtml(game.summary),
    TAGS: gameTags(game),
    ART: escapeHtml(game.art),
    THEME: escapeHtml(game.theme),
    FUN: escapeHtml(game.fun),
    AUDIENCE: escapeHtml(game.audience),
    BUYLINK: amazonLink(game)
  }));
}
for (const asset of assets) {
  await writeFile(fromRoot('dist/' + asset.fileName), asset.bytes);
}
await cp(fromRoot('public'), fromRoot('dist'), { recursive: true });
console.log('Built homepage, Outside (' + data.cards.length + ' cards, ' + linkCount +
  ' links) and Play (' + play.games.length + ' games).');
