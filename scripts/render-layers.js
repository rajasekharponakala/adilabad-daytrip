import { layers } from '../src/layer-definitions.js';
import { atlas, regions } from '../src/atlas.js';
import { earthEntries } from '../src/layers-earth.js';
import { peopleEntries } from '../src/layers-people.js';

export const entries = [...earthEntries,...peopleEntries];
const sites = new Map(atlas.map(p=>[p.id,p]));
export function validateLayers(records = entries) {
  const ids=new Set(), counts=Object.fromEntries(Object.keys(layers).map(id=>[id,0]));
  for(const {id,name,state,area,layer,summary,sources,placeId} of records) {
    if(typeof id!=='string'||!/^[a-z0-9-]+$/.test(id)||ids.has(id)||!Object.hasOwn(layers,layer)||![name,state,area,summary].every(s=>typeof s==='string'&&s.trim())||
       !sources?.length||!sources.every(([label,url])=>label&&new URL(url).protocol==='https:')||(placeId&&!sites.has(placeId))) throw Error(`Invalid or duplicate layer entry: ${id}`);
    ids.add(id); counts[layer]++;
  }
  return counts;
}

export function renderLayerPage({id,layout,anchor,escape}) {
  const root=id?'../../':'../';
  if(id&&!Object.hasOwn(layers,id)) return null;
  const links=Object.entries(layers).map(([key,layer])=>`<li>${anchor(root+`layers/${key}/`,`${layer.name} (${entries.filter(p=>p.layer===key).length})`)}</li>`).join('');
  const directory=`<nav class="layer-nav" aria-label="Heritage layers"><ul class="tags">${links}</ul></nav>`;
  const context='<p class="status">Discovery only · not an itinerary or access guarantee</p>';
  const coverage=()=>`<section><h2>Coverage by state and union territory</h2><p>Counts are published notes, not known sites. A zero flags an editorial gap; it does not mean a region lacks that heritage.</p><div class="coverage-scroll" role="region" aria-label="Coverage table" tabindex="0"><table><caption>Published layer notes by region</caption><thead><tr><th scope="col">Region</th>${Object.values(layers).map(l=>`<th scope="col">${escape(l.name)}</th>`).join('')}</tr></thead><tbody>${regions.map(region=>`<tr><th scope="row">${escape(region)}</th>${Object.keys(layers).map(key=>`<td>${entries.filter(p=>p.state===region&&p.layer===key).length}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  if(!id) return layout({root,title:'Heritage layers',description:'Eight ways to read India’s landscapes and heritage.',inner:`
    <nav class="crumb" aria-label="Breadcrumb">${anchor('../#places','India atlas')} / Heritage layers</nav>
    <h1>Explore heritage layers</h1><p class="intro">Choose a way to read the landscape: rocks, early human evidence, history, habitats, living cultures, food, the observed sky, or calendar traditions.</p>
    <p>${entries.length} sourced discovery notes across ${Object.keys(layers).length} layers. This is a growing editorial collection, not a census of every site.</p>${context}
    <div class="directory layer-grid">${Object.entries(layers).map(([key,layer])=>`<section><p class="kicker" aria-hidden="true">${layer.icon}</p><h2>${anchor(`${key}/`,layer.name)}</h2><p>${escape(layer.description)}</p></section>`).join('')}</div>${coverage()}`});
  const layer=layers[id];
  const selected=entries.filter(p=>p.layer===id).sort((a,b)=>a.state.localeCompare(b.state,'en-IN')||a.name.localeCompare(b.name,'en-IN'));
  return layout({root,title:layer.name,description:layer.description,inner:`
    <nav class="crumb" aria-label="Breadcrumb">${anchor('../','All heritage layers')} / ${escape(layer.name)}</nav>
    <h1>${escape(layer.name)}</h1><p class="intro">${escape(layer.description)}</p>${context}${directory}
    <div class="directory layer-grid">${selected.map(p=>`<article id="${escape(p.id)}"><p class="kicker">${escape(p.state)} · ${escape(p.area)}</p><h2>${escape(p.name)}</h2><p>${escape(p.summary)}</p>
    ${p.placeId?`<p>${anchor(`${root}places/${p.placeId}/`,`Read the ${sites.get(p.placeId).name} field guide ↗`)}</p>`:''}
    <details><summary>Sources</summary><ul>${p.sources.map(([label,url])=>`<li>${anchor(url,label)}</li>`).join('')}</ul></details></article>`).join('')}</div>`});
}
