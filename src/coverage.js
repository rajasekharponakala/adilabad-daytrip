import { layers } from './layer-definitions.js';

/** A source review for one theme never certifies other themes in the region. */
export function reviewCell(state,layer,entries,reviews) {
  const notes=entries.filter(e=>e.state===state&&e.layer===layer);
  const checked=reviews.filter(r=>r.state===state&&r.layers.includes(layer));
  return {notes,checked,status:notes.length?'Published':checked.length?'Reviewed; no published note':'No recorded review'};
}

export function validateReviewLog(reviews,regions) {
  const seen=new Set();
  for(const r of reviews) {
    if(seen.has(r.state)||!regions.includes(r.state)||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!r.outcome?.trim()||!r.next?.trim()||
       !r.layers?.length||!r.layers.every(l=>Object.hasOwn(layers,l))||!r.sources?.length||!r.sources.every(([label,url])=>label&&new URL(url).protocol==='https:')) throw Error(`Invalid regional review: ${r.state}`);
    seen.add(r.state);
  }
}
