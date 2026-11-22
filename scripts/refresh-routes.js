import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { places, starts } from '../src/catalog.js';

// Batch fetch only as a maintainer task. The published app makes no routing API calls.
const nodes = [...starts, ...places.filter(p => p.access !== 'discovery')];
const edges = { car: {}, foot: {} };
for (const mode of ['car', 'foot']) {
  for (const a of nodes) for (const b of nodes) {
    if (a === b || (starts.includes(a) && starts.includes(b)) || (mode === 'foot' && [a.id, b.id].includes('jainath'))) continue;
    const url = `https://routing.openstreetmap.de/routed-${mode}/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=simplified&geometries=geojson&radiuses=300;300`;
    const data = JSON.parse(execFileSync('curl', ['-sSL', '--max-time', '20', '--retry', '2', url], { encoding: 'utf8' }));
    if (!data.routes?.[0] && ['NoRoute', 'NoSegment'].includes(data.code)) {
      console.warn(`No ${mode} route for ${a.id} → ${b.id}: ${data.code}`);
      continue;
    }
    const r = data.routes?.[0];
    if (data.code !== 'Ok' || !r?.geometry?.coordinates?.length) throw new Error(`Invalid routing response for ${url}`);
    edges[mode][`${a.id}:${b.id}`] = {
      m: Math.ceil(r.distance), s: Math.ceil(r.duration),
      snap: Math.ceil(Math.max(...data.waypoints.map(w => w.distance))),
      line: r.geometry.coordinates.map(point => point.map(x => +x.toFixed(5))),
    };
    console.log(`${mode} ${a.id}:${b.id}: ${(r.distance/1000).toFixed(1)} km / ${Math.ceil(r.duration/60)} min before buffers`);
    await new Promise(resolve => setTimeout(resolve, 1050));
  }
}
const bundle = { date: new Date().toISOString().slice(0, 10), provider: 'FOSSGIS OSRM / OpenStreetMap', edges };
writeFileSync(new URL('../src/routes.json', import.meta.url), JSON.stringify(bundle, null, 0)+'\n');
