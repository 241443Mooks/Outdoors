import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const home = await readFile(new URL('../dist/index.html', import.meta.url),'utf8');
const outside = await readFile(new URL('../dist/outside/index.html', import.meta.url),'utf8');
assert.match(home, /<h1[^>]*>Explore\. Learn\./);
assert.match(home, /href="\/outside\/"/);
assert.match(outside, /Showing all 16 resource cards/);
assert.equal([...outside.matchAll(/data-card data-tags=/g)].length,16);
assert.equal([...outside.matchAll(/class="link-list"/g)].length,16);
assert.ok(!/\{\{[A-Z]+\}\}/.test(home + outside));
const verifyAsset = async (sourceName, stem, extension, pages) => {
  const content = await readFile(new URL('../src/' + sourceName, import.meta.url));
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
  const assetPath = '/' + stem + '.' + hash + '.' + extension;
  for (const page of pages) {
    assert.ok(page.includes(extension === 'css' ? 'href="' + assetPath + '"' : 'src="' + assetPath + '"'),
      'Generated HTML must reference the current version of ' + sourceName);
  }
  assert.deepEqual(await readFile(new URL('../dist' + assetPath, import.meta.url)), content,
    'The versioned asset must contain exactly the hashed source bytes');
};
await verifyAsset('styles.css', 'styles', 'css', [home, outside]);
await verifyAsset('script.js', 'script', 'js', [outside]);
const assets = await readdir(new URL('../dist/', import.meta.url));
assert.equal(assets.filter(name => /^styles\.[a-f0-9]{12}\.css$/.test(name)).length, 1);
assert.equal(assets.filter(name => /^script\.[a-f0-9]{12}\.js$/.test(name)).length, 1);
assert.ok(!assets.includes('styles.css'), 'Unversioned stylesheet should not be published');
assert.ok(!assets.includes('script.js'), 'Unversioned script should not be published');
console.log('Homepage, directory, 16 cards and content-hashed assets verified.');
