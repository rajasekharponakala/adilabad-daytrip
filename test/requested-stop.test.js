import test from 'node:test';
import assert from 'node:assert/strict';
import { minute, planTrip } from '../src/planner.js';

const trip = {origin:'station', date:'2026-12-16', from:'09:00', until:'17:00', setting:'any', mode:'car', lunch:true};
const run = change => planTrip({...trip,...change});

test('each offered route includes the requested stop, even when interests favour another place', () => {
  for (const [origin,stop,ranked] of [['station','jainath',['nature']], ['blrm','lalbagh',['science']]]) {
    const {plans} = run({origin,stop,ranked});
    assert.equal(plans.length,2);
    for (const plan of plans) {
      assert.equal(plan.start.id,origin);
      assert.ok(plan.stops.some(s => s.place.id === stop));
      assert.ok(plan.back.end <= minute(trip.until));
    }
  }
});

test('a priority never overrides access, route or time limits, and failures explain the next step', () => {
  for (const [input,reason] of [
    [{stop:'cubbon',origin:'blrm',date:'2026-12-08'},/closed/],
    [{stop:'jainath',until:'09:50'},/doesn't fit/],
    [{stop:'jainath',mode:'foot'},/walk|transport/],
    [{stop:'gandhi',setting:'indoor'},/setting/],
    [{stop:'lalbagh'},/Bengaluru planning hub/],
    [{stop:'pochera'},/discovery only/],
    [{stop:'no-such-stop'},/not in the route planner/],
    [{stop:'kala'},/confirmation/],
    [{stop:'kala',confirmed:{kala:['10:00','10:10']}},/doesn't fit/],
  ]) {
    const {plans,requestedIssue} = run(input);
    assert.deepEqual(plans,[],input.stop);
    assert.match(requestedIssue,reason,input.stop);
  }
  const {plans} = run({stop:'kala',confirmed:{kala:['10:00','11:00']}});
  assert.ok(plans.length);
  for (const p of plans) assert.equal(p.stops.find(s=>s.place.id==='kala').end,minute('11:00'));
});
