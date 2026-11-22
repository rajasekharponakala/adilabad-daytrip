import test from 'node:test';
import assert from 'node:assert/strict';
import { atlas } from '../src/atlas.js';
import { fieldNotes } from '../src/field-notes.js';
import { labModels } from '../src/guide-links.js';
import { exhibits } from '../src/geo-lab-models.js';
import { renderGuideIndex,renderPlace } from '../scripts/render-guides.js';

test('each atlas guide has three unique editorial notes, imagery and source links',()=>{
  assert.deepEqual(new Set(Object.keys(fieldNotes)),new Set(atlas.map(p=>p.id)));
  const index=renderGuideIndex();
  assert.equal(new Set(Object.values(fieldNotes).flat()).size,atlas.length*3);
  for(const p of atlas) {
    const html=renderPlace(p.id);
    assert.ok(fieldNotes[p.id].length===3 && fieldNotes[p.id].every(note=>note.length>=65),p.id);
    assert.ok(index.includes(`../places/${p.id}/`),p.id);
    assert.match(html,/<h2>Why it matters<\/h2>.*<h2>What to look for<\/h2>.*<h2>Before you go<\/h2>/s,p.id);
    assert.match(html,/\.\.\/\.\.\/place-media\/.+\.webp/,p.id);
    assert.match(html,/<h2>Sources and further reading<\/h2>/,p.id);
    assert.equal(html.includes(`?model=${p.id}#geo-lab`),labModels.has(p.id),p.id);
    if(p.access==='discovery')assert.ok(!html.includes('Open the day planner'),p.id);
  }
  assert.equal(renderPlace('unknown'),null);
});

test('seven linked exhibits have three distinct finite 3D meshes with stage explanations',()=>{
  assert.equal(labModels.size,7);
  assert.deepEqual(new Set(Object.keys(exhibits)),labModels);
  for(const id of labModels) {
    const {mesh,stages}=exhibits[id];
    assert.equal(stages.length,3,id);
    const models=stages.map(([title,note],i)=>{
      assert.ok(title && note.length>40,id);
      const faces=mesh(i);
      assert.ok(faces.length>25,id);
      for(const {p,rgb} of faces) assert.ok(p.length===3 && p.every(v=>v.length===3 && v.every(Number.isFinite)) && rgb.length===3 && rgb.every(Number.isFinite),id);
      for(const axis of [0,1,2]) {
        const coordinates=faces.flatMap(f=>f.p.map(v=>v[axis]));
        assert.ok(Math.max(...coordinates)-Math.min(...coordinates)>.05,id);
      }
      return JSON.stringify(faces);
    });
    assert.equal(new Set(models).size,3,id);
  }
});
