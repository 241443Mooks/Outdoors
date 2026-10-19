import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateEntries, renderMemories } from '../scripts/memory-map.mjs';
import { groupPoints, MAP_OPTIONS } from '../src/memory-map.js';
const data = JSON.parse(await readFile(new URL('../data/memories.json',import.meta.url),'utf8'));

test('memory examples are labelled and contain no imported personal histories',()=>{
  validateEntries(data.entries);
  assert.equal(data.entries.length,3);
  assert.deepEqual(new Set(data.entries.map(e=>e.category)),new Set(['work','play','explore']));
  assert.ok(data.entries.every(e=>e.status==='example'));
  assert.equal((renderMemories(data.entries).match(/Illustrative example/g)||[]).length,3);
});
test('draft stories are excluded and all user-provided copy is escaped',()=>{
  const entry={...data.entries[0],title:'<script>alert(1)</script>',story:{...data.entries[0].story,result:'<img src=x onerror=alert(1)>'}};
  const html=renderMemories([entry]);
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('&lt;img'));
  assert.ok(!html.includes('<script>'));assert.equal(renderMemories([{...entry,status:'draft'}]),'');
});
test('bad coordinates, duplicate IDs, unknown status and incomplete work stories fail the build',()=>{
  for(const changed of [{latitude:91},{longitude:-181},{latitude:'53'},{status:'ready'},{category:'unknown'},{story:{}}])assert.throws(()=>validateEntries([{...data.entries[0],...changed}]));
  assert.throws(()=>validateEntries([data.entries[0],data.entries[0]]));
});
test('close pins group at world scale and separate when zoom increases',()=>{
  const a={x:100,y:100},b={x:110,y:110};
  assert.equal(groupPoints([a,b]).length,1);
  assert.equal(groupPoints([a,{x:200,y:200}]).length,2);
  assert.equal(groupPoints([{x:100,y:100},{x:100,y:100}])[0].items.length,2);
});
test('map zoom is capped at city scale and normal page scroll remains available',()=>{
  assert.equal(MAP_OPTIONS.maxZoom,11);assert.equal(MAP_OPTIONS.minZoom,1);
  assert.equal(MAP_OPTIONS.scrollWheelZoom,false);assert.equal(MAP_OPTIONS.bounceAtZoomLimits,false);
});
test('local Leaflet assets match official release integrity hashes',async()=>{
  for(const [file,expected] of [['leaflet.js','20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='],['leaflet.css','p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=']]){
    const bytes=await readFile(new URL('../public/vendor/leaflet-1.9.4/'+file,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('base64'),expected);
  }
});
