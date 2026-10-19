export const categories = { work: 'Work', play: 'Play', explore: 'Explore' };
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export function validateEntries(entries) {
  if (!Array.isArray(entries)) throw new Error('Memories must be an array');
  const ids = new Set();
  for (const entry of entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || ids.has(entry.id)) throw new Error('Invalid or duplicate memory ID');
    ids.add(entry.id);
    if (!Object.hasOwn(categories, entry.category)) throw new Error('Invalid memory category');
    if (!['example', 'published', 'draft'].includes(entry.status)) throw new Error('Invalid memory status');
    for (const field of ['title', 'place', 'date', 'summary']) if (typeof entry[field] !== 'string' || !entry[field].trim()) throw new Error('Missing memory ' + field);
    if (!Number.isFinite(entry.latitude) || Math.abs(entry.latitude) > 90 || !Number.isFinite(entry.longitude) || Math.abs(entry.longitude) > 180) throw new Error('Invalid memory coordinates');
    if (entry.category === 'work') {
      for (const key of ['situation', 'task', 'action', 'result']) if (typeof entry.story?.[key] !== 'string' || !entry.story[key].trim()) throw new Error('Missing work story ' + key);
    } else if (typeof entry.memory !== 'string' || !entry.memory.trim()) throw new Error('Missing memory text');
  }
}
export function renderMemories(entries) {
  validateEntries(entries);
  return entries.filter(entry => entry.status !== 'draft').map(entry => {
    const story = entry.category === 'work' ? Object.entries({situation:'The situation',task:'What needed doing',action:'What I did',result:'What changed'}).map(([key,label]) => '<div><h3>' + label + '</h3><p>' + esc(entry.story[key]) + '</p></div>').join('') : '<p>' + esc(entry.memory) + '</p>';
    return '<article class="memory-card" id="' + esc(entry.id) + '" data-memory data-category="' + esc(entry.category) + '" data-lat="' + entry.latitude + '" data-lon="' + entry.longitude + '" tabindex="-1"><p class="memory-meta"><span class="memory-category category-' + entry.category + '">' + categories[entry.category] + '</span> · ' + esc(entry.date) + '</p><h2>' + esc(entry.title) + '</h2><p class="memory-place">' + esc(entry.place) + '</p><p>' + esc(entry.summary) + '</p>' + (entry.status === 'example' ? '<p class="memory-example">Illustrative example · not a personal history entry</p>' : '') + '<details><summary>Open the story</summary><div class="memory-story">' + story + '</div></details></article>';
  }).join('\n');
}
