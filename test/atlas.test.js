import test from 'node:test';
import assert from 'node:assert/strict';
import { atlas, filterAtlas, regions } from '../src/atlas.js';
import { interests } from '../src/catalog.js';

const expected = ('Andaman and Nicobar Islands|Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chandigarh|Chhattisgarh|Dadra and Nagar Haveli and Daman and Diu|Delhi|Goa|Gujarat|Haryana|Himachal Pradesh|Jammu and Kashmir|Jharkhand|Karnataka|Kerala|Ladakh|Lakshadweep|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Puducherry|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal').split('|');

test('all 28 states and 8 union territories are represented without duplicate records',()=>{
  assert.deepEqual(new Set(regions),new Set(expected));
  assert.equal(new Set(atlas.map(p=>p.id)).size,atlas.length);
  assert.ok(atlas.every(p=>p.sources.length&&p.sources.every(([name,url])=>name&&new URL(url).protocol==='https:')&&p.tags.every(t=>interests[t])));
});

test('search handles focus themes, locations, Telugu names and empty results',()=>{
  assert.deepEqual(filterAtlas({query:' CRATER  Maharashtra ',theme:'geology'}).map(p=>p.id),['lonar']);
  assert.deepEqual(filterAtlas({query:'జైనాథ్'}).map(p=>p.id),['jainath']);
  assert.deepEqual(filterAtlas({state:'Odisha',theme:'birds'}).map(p=>p.id),['chilika']);
  assert.equal(filterAtlas({state:'Odisha',theme:'heritage'}).length,0);
});
