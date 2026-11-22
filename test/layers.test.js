import test from 'node:test';
import assert from 'node:assert/strict';
import {atlas,regions} from '../src/atlas.js';
import {layers} from '../src/layer-definitions.js';
import {entries,renderLayerPage,validateLayers} from '../scripts/render-layers.js';
import {renderPlace} from '../scripts/render-guides.js';

test('each of the eight layers has five or more unique sourced discovery notes',()=>{
  assert.equal(Object.keys(layers).length,8);
  assert.ok(Object.values(validateLayers()).every(count=>count>=5));
  assert.ok(entries.every(e=>regions.includes(e.state)),'coverage must count all published notes');
  assert.throws(()=>validateLayers([...entries,entries[0]]),/duplicate/);
  assert.throws(()=>validateLayers([{...entries[0],placeId:'missing-site'}]),/Invalid/);
});

test('linked notes are discoverable from their matching place guide',()=>{
  for(const entry of entries.filter(e=>e.placeId)) {
    assert.ok(atlas.find(p=>p.id===entry.placeId));
    assert.ok(renderPlace(entry.placeId).includes(`layers/${entry.layer}/#${entry.id}`));
  }
  assert.equal(renderLayerPage({id:'not-a-layer'}),null);
});
