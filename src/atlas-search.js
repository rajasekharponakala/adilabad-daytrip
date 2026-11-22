import { atlas } from './atlas.js';
import { hubs, interests } from './catalog.js';
import { fieldNotes } from './field-notes.js';
import { entries } from './layer-records.js';
import { layers } from './layer-definitions.js';
import { guideUrl } from './guide-links.js';

const layerThemes = {
  geology:['geology'], prehistory:['heritage'], history:['heritage'], biosphere:['nature','birds'],
  anthropology:['culture'], culinary:['culture'], astronomy:['science'], astrology:['culture'],
};
const culturalLayers = new Set(['anthropology','culinary','astrology']);
export const accessLabels = {
  discovery:'Discovery only', cultural:'Cultural reference', candidate:'Planner candidate',
  appointment:'Locally confirmed window required',
};

// Keep place IDs for existing saved lists. A layer note is its own record,
// even when it discusses the same site as a routed stop.
export const atlasRecords = [
  ...atlas.map(p => ({...p, kind:'Field guide', href:`./${guideUrl(p.id)}`,
    plannerHref:p.hub && ['candidate','appointment'].includes(p.access)
      ? `?hub=${encodeURIComponent(p.hub)}&stop=${encodeURIComponent(p.id)}#planner` : null})),
  ...entries.map(e => ({...e, id:`note-${e.id}`, kind:'Heritage note', note:e.summary,
    access:culturalLayers.has(e.layer) ? 'cultural' : 'discovery', tags:layerThemes[e.layer],
    href:`./layers/${e.layer}/#${e.id}`})),
];

const normalize = s => s.normalize('NFKC').toLocaleLowerCase('en-IN').replace(/['’]/gu,'')
  .replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim();
const index = atlasRecords.map(p => ({record:p, title:normalize(p.name), text:normalize([
  p.name, p.te, p.state, p.area, p.note, p.kind, `${p.kind}s`, accessLabels[p.access], hubs[p.hub],
  p.setting, p.plannerHref ? 'planner stops' : '',
  p.layer, layers[p.layer]?.name, ...p.tags.flatMap(t => [t,interests[t]]), ...(fieldNotes[p.id] ?? []),
].join(' '))}));

export function searchAtlas({query='',state='',theme=''} = {}) {
  const phrase = normalize(query), words = phrase.split(' ').filter(Boolean);
  const matches = index.filter(({record:p,text}) => (!state || state===p.state) &&
    (!theme || p.tags.includes(theme)) && words.every(w => text.includes(w)));
  // Keep the browse order on ties, but show a requested title before incidental mentions.
  if (words.length) {
    const score = title => title===phrase ? 3 : title.includes(phrase) ? 2 : words.some(w=>title.includes(w)) ? 1 : 0;
    matches.sort((a,b) => score(b.title)-score(a.title));
  }
  return matches.map(m => m.record);
}
