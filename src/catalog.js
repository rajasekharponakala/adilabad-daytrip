const district = ['Adilabad District · Places of Interest', 'https://adilabad.telangana.gov.in/places-of-interest/'];
const kalaPin = ['Spotwander · location', 'https://spotwander.com/place/ChIJueZKJwBd0jsR0ht_aDdH9OQ/kala-ashram'];
const kata = (...sources) => sources;

export const hubs = { adilabad: 'Adilabad', bengaluru: 'Bengaluru' };
const adilabadStarts = [
  { id: 'station', name: 'Adilabad railway station', te: 'ఆదిలాబాద్ రైల్వే స్టేషన్', lat: 19.68077, lon: 78.53608,
    sources: kata(['Mapcarta · station location', 'https://mapcarta.com/36064514']) },
  { id: 'town', name: 'Adilabad town centre', te: 'ఆదిలాబాద్ పట్టణ కేంద్రం', lat: 19.6759, lon: 78.534,
    sources: kata(['Mapcarta · town reference point', 'https://mapcarta.com/Adilabad']) },
];

const adilabadPlaces = [
  { id: 'gandhi', name: 'Gandhi Park', te: 'గాంధీ పార్క్', area: 'Adilabad town', lat: 19.66, lon: 78.53389,
    tags: ['nature'], setting: 'outdoor', minutes: 35, window: ['08:00', '17:00'], access: 'candidate',
    note: 'A town park for a short outdoor break. The listing reports daylight hours; the planner uses a narrower daytime window. Check the gate and footpaths locally.',
    sources: kata(['Holidify · visitor information', 'https://www.holidify.com/places/adilabad/mahatma-gandhi-park-sightseeing-4014.html'], ['Wikimapia · park location', 'https://wikimapia.org/5135199/Gandhi-Park']) },
  { id: 'jainath', name: 'Jainath Temple', te: 'జైనాథ్ ఆలయం', area: 'Jainad', lat: 19.73537, lon: 78.64374,
    tags: ['heritage', 'culture'], setting: 'outdoor', minutes: 45, window: ['09:00', '16:00'], access: 'candidate',
    note: 'Look for the historic stone architecture and ask about the Prakrit inscription described by the district. The hours are a conservative exterior-visit window, not confirmed darshan hours. Check festivals and access with the temple.',
    sources: kata(district, ['Spotwander · temple location', 'https://spotwander.com/place/ChIJq6rqZmNY0jsRcUXHBN1-_OY/sri-laxmi-narayana-swamy-temple']) },
  { id: 'kala', name: 'Kala Ashram', te: 'కళా ఆశ్రమం', area: 'Tantoli Road', lat: 19.66001, lon: 78.54021,
    tags: ['culture', 'heritage'], setting: 'indoor', minutes: 60, access: 'appointment',
    note: 'A centre for traditional arts associated with Ravindra Sharma. Only add it after the host confirms a visit window; indoor access and availability are not assumed.',
    sources: kata(['The Hindu · Kala Ashram and traditional arts', 'https://www.thehindu.com/news/national/telangana/kala-vishwa-darshanam-gets-under-way/article9337040.ece'], kalaPin) },
  { id: 'pochera', name: 'Pochera Waterfalls', te: 'పొచ్చెర జలపాతం', area: 'Near Boath', lat: 19.34306, lon: 78.38694,
    tags: ['geology', 'nature'], setting: 'outdoor', access: 'discovery',
    note: 'Watch how the cascades follow rocky slopes from an approved viewing area. Discover only: the mapped road ends well short of the falls pin and the entrance and current access need local verification. Never enter the water or cross barriers.',
    sources: kata(district, ['Trawell · motorable approach', 'https://www.trawell.in/telangana/kuntala-falls/pochera-falls'], ['Wikipedia · falls coordinates', 'https://en.wikipedia.org/wiki/Pochera_Falls']) },
  { id: 'kuntala', name: 'Kuntala Waterfalls', te: 'కుంటాల జలపాతం', area: 'Near Neredikonda', lat: 19.28548, lon: 78.50433,
    tags: ['geology', 'nature'], setting: 'outdoor', access: 'discovery',
    note: 'The Kadem River drops through rocky terrain. Discover only: seasonal restrictions and a steep approach need local verification.',
    sources: kata(district, ['Apple Maps · falls coordinates', 'https://maps.apple.com/place?place-id=I408F7EE71E396846'], ['Deccan Chronicle · temporary restrictions', 'https://www.deccanchronicle.com/southern-states/telangana/kuntala-waterfall-attracts-tourists-as-curbs-lifted-1894462']) },
  { id: 'nagoba', name: 'Nagoba Temple, Keslapur', te: 'నాగోబా ఆలయం, కేస్లాపూర్', area: 'Keslapur',
    tags: ['culture', 'heritage'], setting: 'outdoor', access: 'discovery',
    note: 'The district lists the Nagoba Jatara at this place of worship. Discover only: check public access and local customs, and do not treat a community ceremony as a scheduled attraction.', sources: kata(district) },
  { id: 'gayatri', name: 'Gayatri Waterfalls', te: 'గాయత్రి జలపాతం', area: 'Near Tarnam Khurd',
    tags: ['geology', 'nature'], setting: 'outdoor', access: 'discovery',
    note: 'A fall in forest terrain. Discover only: the district describes a lengthy approach through forest; the app does not route visitors there.', sources: kata(district) },
];

export const starts = [
  ...adilabadStarts.map(p => ({...p, hub:'adilabad'})),
  { id:'blrm', hub:'bengaluru', name:'Cubbon Park metro', lat:12.9809, lon:77.59756,
    sources:[['Mapcarta · station location','https://mapcarta.com/N3343297219']] },
];

export const places = [
  ...adilabadPlaces.map(p => ({...p, hub:'adilabad', state:'Telangana'})),
  { id:'lalbagh', hub:'bengaluru', state:'Karnataka', name:'Lalbagh Rock & Botanical Garden', te:'లాల్‌బాగ్ శిల & ఉద్యానవనం', area:'Bengaluru · Main Gate',
    lat:12.95372, lon:77.58584, tags:['geology','nature'], setting:'outdoor', minutes:100, window:['09:00','17:00'], access:'candidate',
    note:'Find ancient Peninsular Gneiss inside a botanical garden. The pin is near the main gate; the visit includes time to walk inside. Use the paths and avoid wet exposed rock.',
    sources:[['Karnataka Tourism · Lalbagh','https://karnatakatourism.org/attractions/lalbagh-botanical-garden/'],['Mapcarta · main gate area','https://mapcarta.com/N2396890413'],['Indian Express · Geological Survey of India on Lalbagh Rock','https://indianexpress.com/article/cities/bangalore/3-billion-year-old-lalbagh-rock-at-risk-from-proposed-hebbal-tunnel-warns-gsi-10865683/']] },
  { id:'cubbon', hub:'bengaluru', state:'Karnataka', name:'Cubbon Park', te:'కబ్బన్ పార్క్', area:'Central Bengaluru',
    lat:12.97417, lon:77.59342, tags:['nature'], setting:'outdoor', minutes:55, window:['09:00','17:00'], closedDays:[1], secondTuesday:true, access:'candidate',
    note:'A city green space for a gentle-paced outing; actual path surfaces vary. Karnataka Tourism lists Mondays and the second Tuesday of each month as closures.',
    sources:[['Karnataka Tourism · park and visitor information','https://karnatakatourism.org/en/attractions/cubbon-park'],['Mapcarta · park reference point','https://mapcarta.com/25731494']] },
  { id:'vismuseum', hub:'bengaluru', state:'Karnataka', name:'Visvesvaraya Science Museum', te:'విశ్వేశ్వరయ్య విజ్ఞాన సంగ్రహాలయం', area:'Kasturba Road, Bengaluru',
    lat:12.97522, lon:77.59643, tags:['science'], setting:'indoor', minutes:85, window:['09:30','17:15'], access:'candidate',
    note:'An indoor, hands-on science stop. The published day extends later than our planning window; check holiday notices, admission and exhibit access.',
    sources:[['Visvesvaraya Museum · visitor information','https://vismuseum.gov.in/'],['Mapcarta · museum location','https://mapcarta.com/W327551780']] },
];

export const interests = { nature:'Nature', heritage:'History & archaeology', culture:'Arts & culture', geology:'Rocks & landscapes', science:'Museums & science', birds:'Birding & wildlife', farm:'Farm experiences' };
export const reviewed = '2026-11-22';
