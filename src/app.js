import { interests, places, reviewed, starts } from './catalog.js';
import { adilabadToday, clock, minute, planTrip } from './planner.js';
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
for (const p of starts) form.elements.origin.append(Object.assign(el('option',p.name), {value:p.id}));
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
  const card = el('article',null,'card');
  const state = {candidate:'Planning estimate', appointment:'Needs local confirmation', discovery:'Discovery only'}[p.access];
  card.append(el('p', `${p.area} / ${state}`, 'eyebrow'), el('h3',p.name), teName(p),
    el('p',p.note), el('p',p.tags.map(x => interests[x]).join(' · '),'hint'), links(p));
  if (p.lat != null && p.access !== 'discovery') card.append(markerLink(p));
  $('catalog').append(card);
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

function stale() {
  if (!output.childElementCount) return;
  output.replaceChildren();
  status.textContent = 'Trip details changed. Build your itinerary again.';
}
form.addEventListener('input', event => {
  if (event.target === form.elements.date) {
    for (const field of $('confirmations').querySelectorAll('input')) field.value = '';
  }
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
    mode:fields.get('mode'), setting:fields.get('setting'), lunch:fields.has('lunch'), ranked:rank, confirmed, skip:excluded });
  if (result.error) { status.textContent = result.error; return; }
  if (excluded.length) {
    const reset = Object.assign(el('button','Restore skipped stops','secondary'), {type:'button'});
    reset.addEventListener('click', () => { excluded = []; generate(); });
    output.append(reset);
  }
  if (!result.plans.length) {
    status.textContent = 'No matching round trip fits these choices. Try a longer window, a different transport option, or fewer interests.';
    if (result.unavailable.length) output.append(el('p',`Needs a locally confirmed visit window: ${result.unavailable.join(', ')}.`,'hint'));
    return;
  }
  status.textContent = 'Planning estimate, not a live access check. Confirm gates, weather, and local access before leaving.';
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
      skip.setAttribute('aria-label',`Skip ${s.place.name} and replan`);
      skip.addEventListener('click', () => { excluded.push(s.place.id); generate(); });
      li.append(el('h3',`${j+1}. ${s.place.name}`),teName(s.place),el('p',`${clock(s.begin)}–${clock(s.end)} · ${s.place.tags.map(t=>interests[t]).join(' / ')}`,'visit'),travel,el('p',s.place.note),markerLink(s.place),skip);
      return [s.begin,li];
    });
    if (plan.lunch) entries.push([plan.lunch[0],el('li',`${clock(plan.lunch[0])}–${clock(plan.lunch[1])} · Lunch break (bring food or confirm a venue)`, 'break')]);
    entries.push([plan.back.end,el('li',`${clock(plan.back.end)} · Return to ${plan.start.name} (depart ${clock(plan.back.depart)}; allow ${plan.back.route.time} min)`,'break')]);
    timeline.append(...entries.sort((a,b)=>a[0]-b[0]).map(([,li])=>li));
    detail.replaceChildren(stats,routeMap(plan),timeline,el('p',`Routing snapshot: ${result.routesDate}. Place sources reviewed ${reviewed}; no field audit yet.`, 'hint'));
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
