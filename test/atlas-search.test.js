import test from 'node:test';
import assert from 'node:assert/strict';
import { atlas } from '../src/atlas.js';
import { entries } from '../src/layer-records.js';
import { places } from '../src/catalog.js';
import { searchAtlas } from '../src/atlas-search.js';

test('every published title finds its exact guide or anchored layer note', () => {
  for (const p of atlas) {
    assert.ok(searchAtlas({query:p.name}).some(r => r.href===`./places/${p.id}/`),p.name);
  }
  for (const e of entries) {
    const r = searchAtlas({query:e.name,state:e.state}).find(r => r.href===`./layers/${e.layer}/#${e.id}`);
    assert.ok(r,e.name);
    assert.ok(!r.plannerHref,e.name);
  }
  const all = searchAtlas();
  assert.equal(new Set(all.map(r=>r.id)).size,atlas.length+entries.length);
  assert.equal(all.length,atlas.length+entries.length);
});

test('planner actions belong only to eligible guides and carry the exact stop and hub', () => {
  const actual = searchAtlas().filter(r=>r.plannerHref).map(r=>r.plannerHref);
  const eligible = places.filter(p=>['candidate','appointment'].includes(p.access));
  assert.deepEqual(actual.sort(),eligible.map(p=>`?hub=${p.hub}&stop=${p.id}#planner`).sort());
  assert.deepEqual(searchAtlas({query:'planner stops'}).map(r=>r.id).sort(),eligible.map(p=>p.id).sort());
});

test('search combines guide text, Telugu, layer names, geography and theme constraints', () => {
  const ids = params => searchAtlas(params).map(r=>r.id);
  assert.ok(ids({query:'  volcanic   CONE ',state:'Maharashtra',theme:'geology'}).includes('lonar'));
  assert.ok(ids({query:'ఆలయం',state:'Telangana'}).includes('jainath'));
  assert.ok(ids({query:'almanac calendar TRADITIONS',state:'Telangana',theme:'culture'}).includes('note-calendar-ugadi-reading'));
  assert.deepEqual(ids({query:'ugadi',state:'Odisha',theme:'culture'}),[]);
  assert.equal(ids({query:'Jainath Temple'})[0],'jainath');
});
