import assert from 'node:assert/strict';
import test from 'node:test';
import {regions} from '../src/atlas.js';
import {reviewCell,validateReviewLog} from '../src/coverage.js';
import {entries} from '../src/layer-records.js';
import {regionReviews} from '../src/region-reviews.js';

test('nationwide release accounts for each jurisdiction and the newly reviewed regions',()=>{
  validateReviewLog(regionReviews,regions);
  assert.equal(new Set(regionReviews.map(r=>r.state)).size,17);
  assert.deepEqual(new Set(entries.map(e=>e.state)),new Set(regions));
  for(const r of regionReviews) assert.ok(r.layers.some(key=>reviewCell(r.state,key,entries,regionReviews).notes.length));
});

test('reviewing one theme does not imply that the rest of the region was reviewed',()=>{
  const reviews=[{state:'Goa',layers:['geology']}];
  assert.equal(reviewCell('Goa','geology',[],reviews).status,'Reviewed; no published note');
  assert.equal(reviewCell('Goa','prehistory',[],reviews).status,'No recorded review');
  assert.equal(reviewCell('Goa','geology',[{state:'Goa',layer:'geology'}],reviews).status,'Published');
});
