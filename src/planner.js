import { hubs, interests, places, starts } from './catalog.js';
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
  const easy = input.pace === 'easy';
  const distanceLimit = mode === 'foot' ? (easy ? 4000 : 7000) : Infinity;
  const candidates = [], unavailable = [];
  const requested = places.find(p => p.id === input.stop);
  const blocked = message => ({ plans: [], unavailable: [], requestedIssue: message });
  if (input.stop != null) {
    if (!requested) return blocked('This requested stop is not in the route planner. Remove the priority to plan other stops.');
    if (requested.access === 'discovery') return blocked(`${requested.name} is discovery only. A round trip cannot be planned there.`);
    if (requested.hub !== start.hub) return blocked(`${requested.name} is in the ${hubs[requested.hub]} planning hub. Change hubs or remove the priority.`);
    if (skip.has(requested.id)) return blocked(`${requested.name} is marked to skip. Restore skipped stops or remove the priority.`);
    if (input.setting !== 'any' && input.setting !== requested.setting) return blocked(`${requested.name} does not match your setting. Choose “Indoors or outdoors” to include it.`);
  }
  const lunch = input.lunch && from <= 12*60+30 && until >= 14*60 ? [12*60+30, 13*60+10] : null;
  const leg = (a,b) => {
    const edge = data?.[`${a}:${b}`];
    if (!edge || edge.snap > 300) return null;
    const time = mode === 'car' ? Math.ceil(edge.s/60*1.35 + 10) : Math.ceil(edge.s/60*(easy ? 1.35 : 1.15) + 4);
    return { ...edge, time };
  };
  for (const place of places) {
    if (place.hub !== start.hub || skip.has(place.id) || place.access === 'discovery' || (input.setting !== 'any' && input.setting !== place.setting)) continue;
    const weekday = parsed.getUTCDay();
    if (place.closedDays?.includes(weekday) || (place.secondTuesday && weekday === 2 && parsed.getUTCDate() >= 8 && parsed.getUTCDate() <= 14)) {
      if (place === requested) return blocked(`${place.name} is listed as closed on this date. Choose another trip date.`);
      continue;
    }
    const quality = ranked.length === 0 ? 2 : Math.max(0, ...place.tags.map(t => ranked.includes(t) ? 6 - ranked.indexOf(t)*2 : 0));
    if (!quality && place !== requested) continue;
    const times = place.access === 'appointment' ? input.confirmed?.[place.id] : place.window;
    const win = Array.isArray(times) && times.map(minute);
    if (!win || !(win[1] > win[0])) {
      if (place.access === 'appointment') {
        if (place === requested) return blocked(`${place.name} needs local confirmation. Ask the host for a visit window on this date, then enter both confirmed times and rebuild.`);
        unavailable.push(place.name);
      }
      continue;
    }
    if (!leg(start.id, place.id) || !leg(place.id, start.id)) {
      if (place === requested) return blocked(`There is no mapped round trip to ${place.name} from this starting point by the selected transport. Try another start or transport.`);
      continue;
    }
    candidates.push({ place, win, quality });
  }
  const scored = [];
  function avoidLunch(at, duration) {
    return lunch && at < lunch[1] && at + duration > lunch[0] ? lunch[1] : at;
  }
  function visit(previous, now, stops, metres, travel, score) {
    if (stops.length && (!requested || stops.some(s => s.place === requested))) {
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
    if (stops.length >= (easy ? 2 : 3)) return;
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
  if (requested && !scored.length) {
    const times = requested.access === 'appointment' ? input.confirmed[requested.id] : requested.window;
    return blocked(`${requested.name} doesn't fit this round trip. The ${requested.minutes}-minute visit must fit between ${times[0]} and ${times[1]} IST, with time to return by ${input.until}. ${mode === 'foot' ? `The total walk must also be within ${distanceLimit/1000} km. Try a car or adjust your times.` : 'Try adjusting your start or return time.'}`);
  }
  scored.sort((a,b) => b.score - a.score || a.back.end - b.back.end);
  const key = plan => plan.stops.map(s => s.place.id).sort().join(',');
  const best = scored[0], alt = best && scored.find(p => key(p) !== key(best));
  return { plans: best ? [best, alt].filter(Boolean) : [], unavailable, routesDate: bundle.date };
}
