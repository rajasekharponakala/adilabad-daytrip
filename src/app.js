import { hubs, interests, places, reviewed, starts } from './catalog.js';
import { atlas, filterAtlas, regions } from './atlas.js';
import { adilabadToday, clock, minute, planTrip } from './planner.js';
import photos from './place-photos.json';
import './styles.css';

const $ = id => document.getElementById(id);
const form = $('trip'), status = $('status'), output = $('output');
const el = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
const teName = place => Object.assign(el('span', place.te, 'telugu'), { lang: 'te' });
const links = place => {
  const row = el('ul', null, 'sources');
  for (const [name,href] of place.sources) {
    const item = el('li');
    item.append(Object.assign(el('a',name), { href }));
    row.append(item);
  }
  return row;
};
const markerLink = place => Object.assign(el('a','View place pin on OpenStreetMap ↗'), {
  href: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`,
});
const rank = [], chips = new Map();
let excluded = [];
for (const [id,name] of Object.entries(hubs)) form.elements.hub.append(Object.assign(el('option',name), {value:id}));
function setHub(hub) {
  form.elements.hub.value = hub;
  form.elements.origin.replaceChildren(...starts.filter(p => p.hub === hub).map(p => Object.assign(el('option',p.name), {value:p.id})));
  for (const input of $('confirmations').querySelectorAll('input')) input.value = '';
  $('confirmation-details').hidden = hub !== 'adilabad';
  stale();
}
form.elements.hub.addEventListener('change', () => setHub(form.elements.hub.value));
form.elements.date.value = form.elements.date.min = adilabadToday();
for (const [id,name] of Object.entries(interests)) {
  const button = Object.assign(el('button',name,'chip'), {type:'button'});
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    if (rank.includes(id)) rank.splice(rank.indexOf(id), 1);
    else if (rank.length < 3) rank.push(id);
    else { $('rank').textContent = 'Remove an interest before adding a fourth.'; return; }
    for (const [key,btn] of chips) {
      const n = rank.indexOf(key)+1;
      btn.textContent = n ? `${n}. ${interests[key]}` : interests[key];
      btn.setAttribute('aria-pressed', String(Boolean(n)));
    }
    $('rank').textContent = rank.length ? `Order: ${rank.map(k => interests[k]).join(' → ')}` : 'Pick up to three, in order. No choices means an open mix.';
    stale();
  });
  chips.set(id,button);
  $('interests').append(button);
}
for (const p of places) {
  if (p.access !== 'appointment') continue;
  const box = el('fieldset',null,'appointment'), fields = el('div',null,'twocol');
  box.append(el('legend',p.name));
  for (const [name,label] of [['open','Confirmed from (IST)'],['close','Confirmed until (IST)']]) {
    const field = el('label',label);
    field.append(Object.assign(el('input'), {type:'time', name:`${p.id}-${name}`}));
    fields.append(field);
  }
  box.append(fields);
  $('confirmations').append(box);
}
setHub('adilabad');

for (const [value,label] of [[atlas.length,'places to explore'],[regions.length,'states & territories'],[Object.keys(hubs).length,'planning hubs']]) {
  const item = el('div',null,'coverage-stat');
  item.append(el('strong',value),el('span',label));
  $('coverage').append(item);
}
for (const state of regions) $('atlas-state').append(Object.assign(el('option',state),{value:state}));
const atlasThemes = new Map();
const knownPlaces = new Set(atlas.map(p => p.id));
const symbols = { geology:'◈', nature:'≈', culture:'✷', heritage:'◇', science:'✧', birds:'⌁', farm:'✳' };
const labModels = new Set(['lonar','deccan','st-marys']);
let labModule, lab, chosenModel;
async function openLab(model) {
  chosenModel = model ?? chosenModel ?? 'lonar';
  const labStatus = $('lab-status');
  if (lab) { lab.select(chosenModel); $('lab-title').focus({preventScroll:true}); return; }
  labStatus.textContent = 'Loading the 3D lab…';
  try {
    const { mountGeoLab } = await (labModule ??= import('./geo-lab.js'));
    if (!lab) lab = mountGeoLab($('lab-mount'), chosenModel);
    $('lab-launch').hidden = true;
    labStatus.textContent = '3D lab ready.';
    if (location.hash === '#geo-lab' || document.activeElement === $('load-lab') || document.activeElement === document.body) {
      $('lab-title').focus({preventScroll:true});
    }
  } catch (error) {
    console.error(error);
    labModule = undefined;
    labStatus.textContent = 'The 3D lab could not load. Try again.';
  }
}
$('load-lab').addEventListener('click',() => void openLab());
let theme = '', pageLimit = 6, savedOnly = false;
const saved = new Set();
try {
  const ids = JSON.parse(localStorage.getItem('fieldday-saved-v1') ?? '[]');
  if (Array.isArray(ids)) for (const id of ids) if (knownPlaces.has(id)) saved.add(id);
} catch { /* Browsing still works without local storage. */ }

function atlasCard(p) {
  const card = el('article',null,'card');
  card.id = `place-${p.id}`;
  card.tabIndex = -1;
  card.dataset.theme = p.tags[0];
  const label = {candidate:'In the planner', appointment:'Needs confirmation', discovery:'Discovery only'}[p.access];
  const flag = el('p',label,'flag');
  flag.dataset.access = p.access;
  const artwork = el('div',null,'card-art');
  const symbol = el('span',symbols[p.tags[0]],'card-symbol');
  symbol.setAttribute('aria-hidden','true');
  artwork.append(flag,symbol);
  const photo = photos[p.id];
  if (photo) {
    const image = Object.assign(el('img',null,'place-photo'),{ alt:photo.alt, loading:'lazy', decoding:'async', width:640, height:400 });
    image.addEventListener('load',() => artwork.classList.add('has-photo'),{once:true});
    image.addEventListener('error',() => { image.remove(); artwork.querySelector('.context-badge')?.remove(); },{once:true});
    artwork.prepend(image);
    if (photo.context) artwork.append(el('span','Context image','context-badge'));
    image.src = `${new URL(import.meta.env.BASE_URL,document.baseURI).href}place-media/${photo.file}`;
  }
  const body = el('div',null,'card-body');
  const eyebrow = el('p',p.state,'eyebrow');
  const title = el('h3',p.name);
  body.append(eyebrow,title);
  if (p.te) body.append(teName(p));
  const tags = el('ul',null,'tag-list');
  tags.append(...p.tags.map(t => el('li',interests[t])));
  const source = el('details',null,'source-details');
  source.append(el('summary','Sources and visit notes'),links(p));
  if (photo) {
    const credit = el('p',null,'photo-credit');
    credit.append(photo.context ? 'Context image: ' : 'Photo: ',Object.assign(el('a',photo.author),{href:photo.source}), ' · ',
      Object.assign(el('a',photo.license),{href:photo.licenseUrl}), ' · resized and cropped in display.');
    source.append(credit);
  }
  if (p.lat != null && p.access !== 'discovery') source.append(markerLink(p));
  const actions = el('div',null,'card-actions');
  const save = Object.assign(el('button',saved.has(p.id)?'Saved':'Save place','secondary'),{type:'button'});
  const labelSave = () => save.setAttribute('aria-label',`${saved.has(p.id)?'Saved':'Save place'}: ${p.name}`);
  labelSave();
  save.setAttribute('aria-pressed',String(saved.has(p.id)));
  save.addEventListener('click',() => {
    if (saved.has(p.id)) saved.delete(p.id); else saved.add(p.id);
    try { localStorage.setItem('fieldday-saved-v1', JSON.stringify([...saved])); } catch { /* Saves stay in this tab. */ }
    save.textContent = saved.has(p.id) ? 'Saved' : 'Save place';
    labelSave();
    save.setAttribute('aria-pressed',String(saved.has(p.id)));
    updateSaved();
    if (savedOnly) { renderAtlas(); $('saved-only').focus({preventScroll:true}); }
  });
  actions.append(save);
  if (labModels.has(p.id)) {
    const modelLink = Object.assign(el('a','Explore in 3D ↗'),{href:'#geo-lab'});
    modelLink.setAttribute('aria-label',`Explore in 3D: ${p.name}`);
    modelLink.addEventListener('click',() => void openLab(p.id));
    actions.append(modelLink);
  }
  if (p.hub && p.access !== 'discovery') {
    const go = Object.assign(el('a','Open planner ↗'),{href:'#planner'});
    go.addEventListener('click',() => setHub(p.hub));
    actions.append(go);
  }
  body.append(el('p',p.area,'card-area'),el('p',p.note,'card-note'),tags,source,actions);
  card.append(artwork,body);
  return card;
}
function updateSaved() {
  $('saved-only').textContent = `Saved places (${saved.size})`;
  $('saved-only').setAttribute('aria-pressed',String(savedOnly));
}
function renderAtlas() {
  const filtered = filterAtlas({query:$('atlas-query').value,state:$('atlas-state').value,theme}).filter(p => !savedOnly || saved.has(p.id));
  const shown = filtered.slice(0,pageLimit);
  $('atlas-count').textContent = `Showing ${shown.length} of ${filtered.length} ${savedOnly?'saved ':''}${filtered.length===1?'place':'places'}`;
  $('atlas-more').hidden = shown.length >= filtered.length;
  $('catalog').replaceChildren(...shown.map(atlasCard));
  if (!filtered.length) $('catalog').append(el('p',savedOnly ? 'No saved places match. Turn off Saved places or clear your filters.' : 'No places match yet. Try another search or a broader filter.','atlas-empty'));
  for (const [key,button] of atlasThemes) button.setAttribute('aria-pressed',String(theme===key));
  updateSaved();
}
for (const [id,name] of [['','All themes'],...Object.entries(interests)]) {
  const button = Object.assign(el('button',name,'chip'),{type:'button'});
  button.addEventListener('click',() => { theme=id; pageLimit=6; renderAtlas(); });
  atlasThemes.set(id,button);
  $('atlas-themes').append(button);
}
for (const [id,event] of [['atlas-query','input'],['atlas-state','change']]) $(id).addEventListener(event,() => { pageLimit=6; renderAtlas(); });
$('saved-only').addEventListener('click',() => { savedOnly=!savedOnly; pageLimit=6; renderAtlas(); });
$('atlas-more').addEventListener('click',() => {
  const current = pageLimit;
  pageLimit += 6;
  renderAtlas();
  $('catalog').children[current]?.focus({preventScroll:true});
});
$('lonar-link').addEventListener('click',event => {
  event.preventDefault();
  $('atlas-query').value=''; $('atlas-state').value=''; theme=''; savedOnly=false; pageLimit=6;
  renderAtlas();
  $('place-lonar').focus({preventScroll:true});
  $('place-lonar').scrollIntoView();
});
renderAtlas();
for (const b of form.querySelectorAll('[data-window]')) b.addEventListener('click',() => {
  const [from,until] = b.dataset.window.split(',');
  form.elements.from.value = from; form.elements.until.value = until;
  updatePresets(); stale();
});
function updatePresets() {
  const current = `${form.elements.from.value},${form.elements.until.value}`;
  for (const b of form.querySelectorAll('[data-window]')) b.setAttribute('aria-pressed',String(b.dataset.window===current));
}
updatePresets();

function stale() {
  $('empty-route').hidden = false;
  if (!output.childElementCount) return;
  output.replaceChildren();
  status.textContent = 'Trip details changed. Build your itinerary again.';
}
form.addEventListener('input', event => {
  if (event.target === form.elements.date) {
    for (const field of $('confirmations').querySelectorAll('input')) field.value = '';
  }
  updatePresets();
  stale();
});

function routeMap(plan) {
  const figure = el('figure', null,'route-map');
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  const attrs = (node, values) => { for (const [key,value] of Object.entries(values)) node.setAttribute(key,value); return node; };
  const layer = (tag,props) => svg.appendChild(attrs(document.createElementNS(svg.namespaceURI,tag),props));
  attrs(svg,{viewBox:'0 0 600 250',role:'img','aria-label':'Schematic of the planned round trip; numbered pins match the timeline'});
  const legs = [...plan.stops.map(s => s.route.line), plan.back.route.line];
  const places = [plan.start,...plan.stops.map(s => s.place)];
  const pins = places.map(p => [p.lon,p.lat]);
  const points = legs.flat().concat(pins);
  const x = points.map(p => p[0]), y = points.map(p => p[1]);
  const xmin = Math.min(...x), xmax = Math.max(...x), ymin = Math.min(...y), ymax = Math.max(...y);
  const ratio = Math.cos(((ymin+ymax)/2)*Math.PI/180);
  const scale = Math.min(530/Math.max(.0001,(xmax-xmin)*ratio),185/Math.max(.0001,ymax-ymin));
  const project = ([lon,lat]) => [300+(lon-(xmin+xmax)/2)*ratio*scale,125-(lat-(ymin+ymax)/2)*scale];
  for (const coordinates of legs) layer('polyline',{points: coordinates.map(point => project(point).join(',')).join(' '), fill:'none',stroke:'#648367','stroke-width':4,'stroke-linejoin':'round','stroke-linecap':'round'});
  pins.forEach((p,i) => {
    const [cx,cy] = project(p);
    layer('circle',{cx,cy,r:12,fill:i ? '#a43c22' : '#17362c',stroke:'white','stroke-width':2});
    layer('text',{x:cx,y:cy+4,'text-anchor':'middle',fill:'white','font-size':12,'font-weight':700}).textContent = i || 'S';
  });
  figure.append(svg,el('figcaption','Route sketch · S = start/return · not turn-by-turn navigation. Map data © OpenStreetMap contributors.'));
  return figure;
}

function generate(focus = true) {
  const fields = new FormData(form);
  const confirmed = {};
  output.replaceChildren();
  $('empty-route').hidden = false;
  if (focus) $('results').focus();
  for (const p of places.filter(p => p.access === 'appointment')) {
    const open = fields.get(`${p.id}-open`), close = fields.get(`${p.id}-close`);
    if (!open && !close) continue;
    if (!(minute(close) > minute(open))) {
      status.textContent = `Enter both confirmed times for ${p.name}, with the end after the start.`;
      return;
    }
    confirmed[p.id] = [open,close];
  }
  const result = planTrip({ origin:fields.get('origin'), date:fields.get('date'), from:fields.get('from'), until:fields.get('until'),
    mode:fields.get('mode'), setting:fields.get('setting'), pace:fields.get('pace'), lunch:fields.has('lunch'), ranked:rank, confirmed, skip:excluded });
  if (result.error) { status.textContent = result.error; return; }
  if (excluded.length) {
    const reset = Object.assign(el('button','Restore skipped stops','secondary'), {type:'button'});
    reset.addEventListener('click', () => { excluded = []; generate(); });
    output.append(reset);
  }
  if (!result.plans.length) {
    status.textContent = 'No matching round trip fits these choices. Try a longer window, a different transport option, or fewer interests.';
    if (result.unavailable.length) output.append(el('p',`Needs a locally confirmed visit window: ${result.unavailable.join(', ')}.`,'hint'));
    if (rank.length) {
      const browse = Object.assign(el('a',`Browse ${interests[rank[0]]} in the atlas ↗`),{href:'#places'});
      browse.addEventListener('click',()=>{
        $('atlas-query').value=''; $('atlas-state').value=''; theme=rank[0]; savedOnly=false; pageLimit=6; renderAtlas();
      });
      output.append(browse);
    }
    return;
  }
  status.textContent = 'Planning estimate, not a live access check. Confirm gates, weather, and local access before leaving.';
  $('empty-route').hidden = true;
  if (result.unavailable.length) output.append(el('p',`Not scheduled without local confirmation: ${result.unavailable.join(', ')}.`,'hint'));
  const selector = el('div',null,'choices'), detail = el('div');
  output.append(selector, detail);
  const buttons = [];
  const render = i => {
    buttons.forEach((b,j) => b.setAttribute('aria-pressed', String(i===j)));
    const plan = result.plans[i], mode = fields.get('mode');
    const stats = el('p',`${plan.stops.length} ${plan.stops.length===1?'stop':'stops'} · ${(plan.metres/1000).toFixed(1)} km round trip · back at ${clock(plan.back.end)} IST`,'stats');
    const timeline = el('ol',null,'timeline');
    const entries = plan.stops.map((s,j) => {
      const li = el('li');
      const travel = el('p',`Leave previous point ${clock(s.depart)} · allow ${s.route.time} min ${mode==='foot'?'on foot':'by road'}${s.begin > s.arrival ? ` · arrive ${clock(s.arrival)}, then wait` : ''}`,'hint');
      const skip = Object.assign(el('button','Skip stop & replan','secondary'), {type:'button'});
      skip.setAttribute('aria-label',`Skip stop & replan: ${s.place.name}`);
      skip.addEventListener('click', () => { excluded.push(s.place.id); generate(); });
      li.append(el('h3',`${j+1}. ${s.place.name}`),teName(s.place),el('p',`${clock(s.begin)}–${clock(s.end)} · ${s.place.tags.map(t=>interests[t]).join(' / ')}`,'visit'),travel,el('p',s.place.note),markerLink(s.place),skip);
      return [s.begin,li];
    });
    if (plan.lunch) entries.push([plan.lunch[0],el('li',`${clock(plan.lunch[0])}–${clock(plan.lunch[1])} · Lunch break (bring food or confirm a venue)`, 'break')]);
    entries.push([plan.back.end,el('li',`${clock(plan.back.end)} · Return to ${plan.start.name} (depart ${clock(plan.back.depart)}; allow ${plan.back.route.time} min)`,'break')]);
    timeline.append(...entries.sort((a,b)=>a[0]-b[0]).map(([,li])=>li));
    const meta = el('p',`${hubs[plan.start.hub]} · ${fields.get('date')} · ${mode==='foot'?'On foot':'By car'} · IST`,'hint');
    const print = Object.assign(el('button','Print or save as PDF','secondary print-route'),{type:'button'});
    print.addEventListener('click',() => window.print());
    detail.replaceChildren(meta,stats,routeMap(plan),timeline,el('p',`Routing snapshot: ${result.routesDate}. Place sources reviewed ${reviewed}; no field audit yet.`, 'hint'),print);
  };
  if (result.plans.length > 1) result.plans.forEach((_,i) => {
    const button = Object.assign(el('button', i ? 'Alternative' : 'Recommended','chip'), {type:'button'});
    button.addEventListener('click',()=>render(i));
    buttons.push(button);
    selector.append(button);
  });
  render(0);
}
form.addEventListener('submit', event => { event.preventDefault(); excluded = []; generate(); });
