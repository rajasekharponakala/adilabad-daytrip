import test from 'node:test';
import assert from 'node:assert/strict';
import {minute, planTrip} from '../src/planner.js';
import {places, starts} from '../src/catalog.js';
import bundle from '../src/routes.json' with { type: 'json' };

const input = { origin:'station', date:'2026-11-22', from:'09:00', until:'17:00', mode:'car', setting:'any', lunch:true };
const run = (change = {}, routes) => planTrip({...input,...change}, routes);
const ids = p => p.stops.map(s => s.place.id);

test('validates actual date, return time, transport and origin', () => {
  for (const change of [{date:'2026-02-30'}, {until:'09:00'}, {from:'24:00'}, {mode:'bike'}, {origin:'fake'}]) assert.ok(run(change).error);
});

test('default round trip uses both planning stops, excludes unconfirmed and discovery stops', () => {
  const {plans, unavailable} = run();
  assert.deepEqual(new Set(ids(plans[0])), new Set(['gandhi','jainath']));
  assert.deepEqual(unavailable, ['Kala Ashram']);
  assert.ok(plans[0].back.end <= minute(input.until));
  assert.notDeepEqual(new Set(ids(plans[0])), new Set(ids(plans[1])));
});

test('late start and tight window never drop the return leg', () => {
  assert.equal(run({from:'15:50',until:'16:20'}).plans.length,0);
  const {plans} = run({from:'15:50',until:'17:10'});
  assert.deepEqual(ids(plans[0]),['gandhi']);
});

test('indoor route requires a confirmation and respects it in both directions', () => {
  assert.equal(run({setting:'indoor'}).plans.length,0);
  const [p] = run({setting:'indoor',confirmed:{kala:['11:15','12:20']}}).plans;
  assert.deepEqual(ids(p),['kala']);
  assert.equal(p.stops[0].begin,minute('11:15'));
  assert.equal(p.stops[0].end,minute('12:15'));
  assert.equal(run({setting:'indoor',confirmed:{kala:['11:15','12:10']}}).plans.length,0);
});

test('lunch is not double-booked with travel or a visit', () => {
  const [p] = run({from:'12:20',until:'17:00'}).plans;
  assert.deepEqual(p.lunch,[750,790]);
  for (const [a,b] of p.stops.flatMap(s => [[s.depart,s.arrival],[s.begin,s.end]]).concat([[p.back.depart,p.back.end]])) assert.ok(b <= 750 || a >= 790);
  assert.equal(run({from:'12:20',lunch:false}).plans[0].lunch,null);
});

test('walking cap and route availability are hard constraints', () => {
  for (const p of run({mode:'foot',confirmed:{kala:['09:30','16:30']}}).plans) {
    assert.ok(!ids(p).includes('jainath'));
    assert.ok(p.metres <= 7000);
  }
  const partial = structuredClone(bundle);
  delete partial.edges.car['jainath:station'];
  assert.equal(run({ranked:['heritage']}, partial).plans.length,0);
  partial.edges.car['station:gandhi'].snap = 301;
  assert.equal(run({},partial).plans.length,0);
});

test('interest filters and explicit skips do not silently substitute unrelated stops', () => {
  assert.deepEqual(ids(run({ranked:['heritage']}).plans[0]),['jainath']);
  assert.equal(run({ranked:['geology']}).plans.length,0);
  assert.deepEqual(ids(run({skip:['jainath']}).plans[0]),['gandhi']);
});

test('every catalog record is sourced; routed edges use known nodes and finite geometry', () => {
  const nodes = new Map([...starts,...places].map(p => [p.id,p]));
  assert.equal(new Set(places.map(p => p.id)).size, places.length);
  for (const p of nodes.values()) assert.ok(p.sources.length && p.sources.every(([,url]) => url.startsWith('https://')));
  for (const mode of ['car','foot']) for (const [pair,x] of Object.entries(bundle.edges[mode])) {
    for (const id of pair.split(':')) { assert.ok(nodes.has(id)); assert.notEqual(nodes.get(id).access,'discovery'); }
    assert.ok(x.m > 0 && x.s > 0 && x.snap <= 300 && x.line.length >= 2);
    const [a,b] = pair.split(':').map(id=>nodes.get(id));
    assert.equal(a.hub,b.hub);
    for (const [[lon,lat],p] of [[x.line[0],a],[x.line.at(-1),b]]) assert.ok(Math.hypot(lon-p.lon,lat-p.lat) < .004);
    assert.ok(x.line.every(([lon,lat])=>Number.isFinite(lon)&&Number.isFinite(lat)));
  }
});

test('Bengaluru stays in its hub and still offers indoor access independently of park closures', () => {
  const change = {origin:'blrm',date:'2026-11-23'}; // Monday
  assert.ok(run(change).plans.length);
  assert.ok(run(change).plans.every(p=>p.stops.every(s=>s.place.hub==='bengaluru'&&s.place.id!=='cubbon')));
  assert.ok(run({...change,date:'2026-12-08'}).plans.every(p=>!ids(p).includes('cubbon'))); // second Tuesday
  assert.ok(ids(run({...change,date:'2026-12-15'}).plans[0]).includes('cubbon'));
  assert.deepEqual(ids(run({...change,setting:'indoor',mode:'foot'}).plans[0]),['vismuseum']);
});

test('easy pace limits walking distance and stop count, with a longer walking allowance', () => {
  assert.equal(run({mode:'foot',pace:'easy'}).plans.length,0);
  const local = {origin:'blrm',date:'2026-12-15',mode:'foot'};
  const easy = run({...local,pace:'easy'}).plans[0], regular = run(local).plans[0];
  assert.ok(easy.metres <= 4000 && easy.stops.length <= 2);
  assert.ok(easy.stops[0].route.time > regular.stops.find(s=>s.place.id===easy.stops[0].place.id).route.time || easy.travel > regular.travel);
});
