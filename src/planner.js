import { interests, places, starts } from './catalog.js';
import routes from './routes.json' with { type: 'json' };

export function minute(text) {
  return typeof text === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(text)
    ? Number(text.slice(0, 2)) * 60 + Number(text.slice(3)) : NaN;
}

export function clock(n) {
  return `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
}

export function adilabadToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function planTrip(input, bundle = routes) {
  const start = starts.find(s => s.id === input.origin);
  const mode = input.mode === 'car' || input.mode === 'foot' ? input.mode : null;
  const from = minute(input.from), until = minute(input.until);
  const day = input.date;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(day) && new Date(`${day}T00:00:00Z`);
  if (!start || !mode || !parsed || Number.isNaN(+parsed) || parsed.toISOString().slice(0,10) !== day || !(until > from)) {
    return { error: 'Choose a valid date, starting point, transport, and a return time after your start time.', plans: [] };
  }
  const ranked = [...new Set((input.ranked ?? []).filter(x => Object.hasOwn(interests,x)))].slice(0,3);
  const skip = new Set(input.skip ?? []);
  const data = bundle.edges[mode];
  const distanceLimit = mode === 'foot' ? 7000 : Infinity;
  const candidates = [], unavailable = [];
  const lunch = input.lunch && from <= 12*60+30 && until >= 14*60 ? [12*60+30, 13*60+10] : null;
  const leg = (a,b) => {
    const edge = data?.[`${a}:${b}`];
    if (!edge || edge.snap > 300) return null;
    const time = mode === 'car' ? Math.ceil(edge.s/60*1.25 + 8) : Math.ceil(edge.s/60*1.15 + 4);
    return { ...edge, time };
  };
  for (const place of places) {
    if (skip.has(place.id) || place.access === 'discovery' || (input.setting !== 'any' && input.setting !== place.setting)) continue;
    const quality = ranked.length === 0 ? 2 : Math.max(0, ...place.tags.map(t => ranked.includes(t) ? 6 - ranked.indexOf(t)*2 : 0));
    if (!quality) continue;
    const win = (place.access === 'appointment' ? input.confirmed?.[place.id] : place.window)?.map(minute);
    if (!win || !(win[1] > win[0])) {
      if (place.access === 'appointment') unavailable.push(place.name);
      continue;
    }
    if (!leg(start.id, place.id) || !leg(place.id, start.id)) continue;
    candidates.push({ place, win, quality });
  }
  const scored = [];
  function avoidLunch(at, duration) {
    return lunch && at < lunch[1] && at + duration > lunch[0] ? lunch[1] : at;
  }
  function visit(previous, now, stops, metres, travel, score) {
    if (stops.length) {
      const back = leg(previous, start.id);
      if (back) {
        const depart = avoidLunch(now, back.time);
        const end = depart + back.time;
        if (end <= until && metres + back.m <= distanceLimit) {
          scored.push({ start, stops, back: { depart, end, route: back }, lunch: lunch && lunch[0] < end ? lunch : null,
            metres: metres + back.m, travel: travel + back.time, score: score - (travel + back.time)/85 });
        }
      }
    }
    if (stops.length >= 3) return;
    for (const c of candidates) {
      if (stops.some(s => s.place === c.place)) continue;
      const route = leg(previous, c.place.id);
      if (!route || metres + route.m > distanceLimit) continue;
      const depart = avoidLunch(now, route.time);
      const arrival = depart + route.time;
      const begin = avoidLunch(Math.max(arrival, c.win[0]), c.place.minutes);
      const end = begin + c.place.minutes;
      if (end > until || end > c.win[1]) continue;
      visit(c.place.id, end, [...stops, { place: c.place, depart, arrival, begin, end, route }],
        metres + route.m, travel + route.time, score + c.quality - (begin - arrival)/90);
    }
  }
  visit(start.id, from, [], 0, 0, 0);
  scored.sort((a,b) => b.score - a.score || a.back.end - b.back.end);
  const key = plan => plan.stops.map(s => s.place.id).sort().join(',');
  const best = scored[0], alt = best && scored.find(p => key(p) !== key(best));
  return { plans: best ? [best, alt].filter(Boolean) : [], unavailable, routesDate: bundle.date };
}
