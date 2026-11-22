import { places } from './catalog.js';

const unesco = id => `https://whc.unesco.org/en/list/${id}/`;
const tentative = id => `https://whc.unesco.org/en/tentativelists/${id}/`;

// Editorial discovery records, not verified itineraries or a register of official designations.
const rows = [
  ['lonar','Lonar Crater','Maharashtra','Buldhana',['geology','nature'],'A meteorite impact punched a crater into basalt. The lake and rim make it possible to read the impact in the landscape.','Ministry of Mines via PIB','https://www.pib.gov.in/PressReleaseDetail.aspx?PRID=2335748&reg=19&lang=1'],
  ['varkala','Varkala Cliffs','Kerala','Thiruvananthapuram district',['geology','nature'],'Layers of sediment and laterite form a coastal cliff above the Arabian Sea. Keep back from unstable cliff edges.','UNESCO Tentative List',tentative(6895)],
  ['bhimbetka','Bhimbetka Rock Shelters','Madhya Pradesh','Raisen',['geology','heritage'],'Sandstone overhangs provided shelter and a surface for paintings. Read the rock and human history together.','UNESCO World Heritage Centre',unesco(925)],
  ['st-marys','St. Mary’s Islands','Karnataka','Off Malpe, Udupi',['geology','nature'],'Hardened lava forms striking columns at this island cluster. Confirm boat operation and landing access locally.','UNESCO Tentative List',tentative(6891)],
  ['deccan','Panchgani & Mahabaleshwar','Maharashtra','Satara',['geology','nature'],'Stepped plateaus expose successive basalt flows in the Deccan Traps.','UNESCO Tentative List',tentative(6890)],
  ['erra','Erra Matti Dibbalu','Andhra Pradesh','Visakhapatnam coast',['geology'],'Rainwater erosion cuts gullies through the red coastal sediments. View only from permitted areas.','UNESCO Tentative List',tentative(6893)],
  ['sela','Sela Pass','Arunachal Pradesh','Tawang–West Kameng',['geology','nature'],'A high Himalayan pass with a glacial lake. Check permits, road conditions and altitude guidance before visiting.','Incredible India','https://incredibleindia.gov.in/en/arunachal-pradesh/tawang/sela-pass'],
  ['majuli','Majuli','Assam','Brahmaputra valley',['nature','culture'],'A river island shaped by sediment deposition and erosion, with a living tradition of satras. Check ferry and seasonal access.','NITI Aayog · Divya Bharat','https://niti.gov.in/node/2250'],
  ['rajgir','Rajgir Hills','Bihar','Nalanda district',['geology','heritage'],'A ring of hills frames old routes, sacred sites and hot springs. Check individual site access.','Bihar Tourism · visitor guide','https://tourism.bihar.gov.in/content/dam/bihar-tourism/e_brochures/ready-reckoner-22.pdf'],
  ['chitrakote','Chitrakote Falls','Chhattisgarh','Bastar',['geology','nature'],'The Indravati spreads across a rock ledge before dropping into a gorge. Seasonal flows change the view and access.','Chhattisgarh Tourism Board','https://tourism.cgstate.gov.in/destinations/Bastar/Chitrakote'],
  ['dudhsagar','Dudhsagar Falls','Goa','Bhagwan Mahavir Sanctuary area',['nature','geology'],'The Mandovi drops over several tiers in the Western Ghats. Use only officially allowed approaches, never railway tracks.','Goa Tourism Development Corporation','https://goa-tourism.com/water-bodies/dudhsagar-falls/'],
  ['dholavira','Dholavira','Gujarat','Khadir Bet, Kutch',['heritage','geology'],'In the seasonal salt-flat landscape of Kutch, a Harappan city engineered reservoirs to manage scarce water.','UNESCO World Heritage Centre',unesco(1645)],
  ['morni','Morni Hills','Haryana','Panchkula district',['nature','geology'],'A Shivalik foothill landscape of ridges and valleys. Start with public viewpoints and verify local trail conditions.','Haryana Tourism','https://haryanatourism.gov.in/destinations/panchkula'],
  ['spiti','Spiti Valley','Himachal Pradesh','Lahaul and Spiti',['geology','nature'],'Steep slopes and layered rock line this high cold-desert valley. Check road access, weather and altitude guidance.','District Lahaul and Spiti','https://hplahaulspiti.nic.in/tourist-places-in-spiti/'],
  ['hundru','Hundru Falls','Jharkhand','Near Ranchi',['geology','nature'],'The Subarnarekha drops off the plateau here. Visitor access can involve steps and slippery surfaces.','Government of Jharkhand','https://www.jharkhand.gov.in/home/AboutTourism'],
  ['loktak','Loktak Lake','Manipur','Bishnupur area',['nature','birds'],'Floating masses of vegetation known as phumdis create a changing wetland landscape. Start at an authorised viewpoint.','Manipur Tourism','https://manipurtourism.gov.in/in-around-loktak-lake'],
  ['meghalayan','Meghalayan Age Caves','Meghalaya','Garo, Khasi and Jaintia Hills',['geology','science'],'Limestone caves and their mineral deposits preserve evidence of past climates. Not every cave is open to visitors.','UNESCO Tentative List',tentative(6892)],
  ['reiek','Reiek','Mizoram','Near Aizawl',['nature','culture'],'Look across folded-looking ridges and valleys from a publicly accessible viewpoint. Verify trail conditions and permits.','North Eastern Council · tourist circuits','https://necouncil.gov.in/nec-project-sectors/tourism-and-industries'],
  ['naga','Naga Hill Ophiolite','Nagaland','Naga Hills',['geology','science'],'These rocks preserve pieces of ancient oceanic crust exposed on land. This is a geological listing, not a marked visitor trail.','UNESCO Tentative List',tentative(6889)],
  ['chilika','Chilika Lagoon','Odisha','Odisha coast',['nature','birds'],'This brackish lagoon sits between land and sea. The changing mix of fresh and salt water supports rich birdlife.','Incredible India','https://incredibleindia.gov.in/en/odisha/bhubaneswar/chilika-lake'],
  ['harike','Harike Wetland','Punjab','Beas–Sutlej confluence',['nature','birds'],'A wetland at the meeting of two rivers. Look for waterbirds from public viewing areas without disturbing them.','Ramsar Sites Information Service','https://rsis.ramsar.org/ris/462'],
  ['keoladeo','Keoladeo National Park','Rajasthan','Bharatpur',['nature','birds'],'A managed wetland shows how water levels shape habitats for resident and migratory birds.','UNESCO World Heritage Centre',unesco(340)],
  ['khangchendzonga','Khangchendzonga National Park','Sikkim','Western Sikkim',['geology','nature','culture'],'Glaciers, high peaks and valleys are part of a sacred landscape. Access to protected areas requires checking permits and suitable routes.','UNESCO World Heritage Centre',unesco(1513)],
  ['mahabalipuram','Mahabalipuram Monuments','Tamil Nadu','Chengalpattu coast',['heritage','geology'],'Temple builders carved granite in place and assembled it into structures. Compare carved forms with the surrounding bedrock.','UNESCO World Heritage Centre',unesco(249)],
  ['ramappa','Ramappa Temple','Telangana','Palampet, Mulugu',['heritage','geology'],'The temple combines carved stone with lightweight bricks. It is a useful introduction to the role of materials in architecture.','UNESCO World Heritage Centre',unesco(1570)],
  ['unakoti','Unakoti','Tripura','Near Kailashahar',['heritage','geology'],'Rock reliefs and sculptures use the hillside itself as a canvas. Expect steps and check access locally.','Tripura Tourism','https://tripuratourism.gov.in/archaeological-sites'],
  ['sarnath','Sarnath','Uttar Pradesh','Near Varanasi',['heritage','culture'],'Read the history of the site through its masonry and the contrast between brick stupas and carved sandstone.','UNESCO World Heritage Centre',unesco(927)],
  ['nanda','Nanda Devi & Valley of Flowers','Uttarakhand','Garhwal Himalaya',['geology','nature'],'Glacial valleys and a steep elevation range support alpine habitats. Visit only on open trails in the permitted season.','UNESCO World Heritage Centre',unesco(335)],
  ['sundarbans','Sundarbans National Park','West Bengal','Ganges delta',['nature','birds'],'Tidal channels move sediment through an immense mangrove delta. Use permitted boat routes only.','UNESCO World Heritage Centre',unesco(452)],
  ['baratang','Baratang Limestone Caves','Andaman and Nicobar Islands','Middle Andaman approach',['geology','nature'],'Water dissolves limestone and deposits new mineral formations inside the caves. Entry requires local authorisation.','Andaman & Nicobar Tourism','https://andamantourism.gov.in/html/Baratang.html'],
  ['rock-garden','Rock Garden Chandigarh','Chandigarh','Sector 1',['culture','heritage'],'Nek Chand used discarded materials to build an outdoor sculpture landscape. This is an arts stop, not a natural geosite.','Chandigarh Tourism','https://chandigarhtourism.gov.in/pages/page/rock-garden'],
  ['naida','Naida Caves','Dadra and Nagar Haveli and Daman and Diu','Diu',['geology','heritage'],'Rock passages outside the fort walls reveal a human-shaped site. Check closure notices instead of assuming access.','Union territory administration','https://ddd.gov.in/places-centres/naida-caves'],
  ['aravalli','Aravalli Biodiversity Park','Delhi','Vasant Vihar area',['nature','geology'],'Restored habitat on the Delhi Ridge connects rocky terrain, soils and native plants. Do not confuse it with the similarly named Gurugram park.','Delhi Tourism','https://delhitourism.gov.in/dt/biodiversity_parks/aravalli_biodiversity_park.html'],
  ['gurez','Gurez Valley','Jammu and Kashmir','Bandipora district',['geology','nature'],'The Kishanganga flows through a high mountain valley. Weather, road closures and local visitor rules can affect access.','District Bandipora','https://bandipore.nic.in/tourist-place/gurez-valley/'],
  ['lamayuru','Lamayuru Landscape','Ladakh','Leh district',['geology','culture'],'Pale sedimentary slopes around the village are carved into ridges and gullies. Allow time for acclimatisation.','District Leh','https://leh.nic.in/tourist-place/lamayuru/'],
  ['agatti','Agatti Lagoon','Lakshadweep','Agatti Island',['nature','geology'],'The reef shelters a shallow lagoon. Check entry permits and use locally authorised reef-safe activities.','Lakshadweep Administration','https://lakshadweep.gov.in/tourist-place/agatti/'],
  ['chunnambar','Chunnambar Backwaters','Puducherry','Near Ariyankuppam',['nature'],'The meeting of river and coast shapes the estuary and sand barriers. Check official boat operations before travelling.','Incredible India','https://incredibleindia.gov.in/en/puducherry/puducherry/chunnambar-boat-house'],
  ['malegaon-farm','Malegaon Agricultural Farm','Maharashtra','Baramati, Pune district',['farm','culture'],'A host-led farm visit is a way to learn how local growing conditions and farming choices shape the landscape. Contact the host before visiting; this is a working farm.','Agricultural Development Trust · farm visitor contact','https://agritourismbaramati.in/contact'],
];

export const atlas = [
  ...rows.map(([id,name,state,area,tags,note,source,url]) => ({id,name,state,area,tags,note,access:'discovery',sources:[[source,url]]})),
  ...places,
];

export const regions = [...new Set(atlas.map(p => p.state))].sort((a,b) => a.localeCompare(b,'en-IN'));

export function filterAtlas({ query = '', state = '', theme = '' } = {}) {
  const words = query.trim().toLocaleLowerCase('en-IN').split(/\s+/).filter(Boolean);
  return atlas.filter(p => (!state || p.state === state) && (!theme || p.tags.includes(theme)) &&
    words.every(word => `${p.name} ${p.te ?? ''} ${p.state} ${p.area} ${p.note}`.toLocaleLowerCase('en-IN').includes(word)));
}
