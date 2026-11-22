// Dated snapshots of desk research. A layer here means the named subject was
// examined, not that the region was surveyed for every site in that layer.
const date = '2026-11-22';

export const regionReviews = [
  {
    state: 'Andaman and Nicobar Islands', date, layers: ['geology'],
    sources: [['India’s submission · Baratang karst complex', 'https://whc.unesco.org/en/tentativelists/7052/']],
    outcome: 'Added Baratang cave formation from the karst description in India’s Tentative List submission.',
    next: 'Check a Geological Survey of India account of Baratang’s mud volcanism separately.',
  },
  {
    state: 'Arunachal Pradesh', date, layers: ['geology'],
    sources: [['Incredible India · Sela Pass', 'https://www.incredibleindia.gov.in/en/arunachal-pradesh/tawang/sela-pass']],
    outcome: 'Added the pass and its seasonally freezing lake. The tourism profile describes the setting but does not establish the lake’s origin.',
    next: 'Look for a geomorphological study before attributing the lake basin to glaciation.',
  },
  {
    state: 'Bihar', date, layers: ['history'],
    sources: [['Bihar Tourism · Ready Reckoner, p. 24', 'https://tourism.bihar.gov.in/content/dam/bihar-tourism/e_brochures/ready-reckoner-22.pdf']],
    outcome: 'Added the peace pagoda on Ratnagiri Hill from the Rajgir monument profile.',
    next: 'Check an archaeological survey for Rajgir’s early fortifications.',
  },
  {
    state: 'Chandigarh', date, layers: ['history'],
    sources: [['Chandigarh Tourism · Rock Garden', 'https://chandigarhtourism.gov.in/pages/page/rock-garden']],
    outcome: 'Added Nek Chand’s garden as a twentieth-century work of sculpture and landscape design.',
    next: 'Look for an archive or museum account of the garden’s construction phases.',
  },
  {
    state: 'Chhattisgarh', date, layers: ['geology'],
    sources: [['Bastar district · Chitrakote Waterfall', 'https://bastar.gov.in/en/tourist-place/chitrakote-waterfall/'], ['Incredible India · Chitrakote Waterfalls', 'https://www.incredibleindia.gov.in/en/chhattisgarh/jagdalpur/chitrakote-waterfalls']],
    outcome: 'Added the curved rim and seasonal changes in flow at the Indravati falls.',
    next: 'Check the local geological mapping before naming the rock at the ledge.',
  },
  {
    state: 'Dadra and Nagar Haveli and Daman and Diu', date, layers: ['history'],
    sources: [['Union territory administration · Naida Caves', 'https://ddd.gov.in/places-centres/naida-caves/']],
    outcome: 'Added the hewn steps in Diu. The reported link to stone supplied for the fort is attributed as a belief.',
    next: 'Check heritage inventories for Dadra and Nagar Haveli and for Daman, beyond the Diu site.',
  },
  {
    state: 'Delhi', date, layers: ['biosphere'],
    sources: [['Delhi Tourism · Aravalli Biodiversity Park', 'https://delhitourism.gov.in/dt/biodiversity_parks/aravalli_biodiversity_park.html']],
    outcome: 'Added restoration of former clay pits at the South Central Ridge park near Vasant Vihar.',
    next: 'Seek a park management report on how the restored plant communities are monitored.',
  },
  {
    state: 'Goa', date, layers: ['geology'],
    sources: [['Goa Tourism Development Corporation · Dudhsagar Falls', 'https://goa-tourism.com/water-bodies/dudhsagar-falls/']],
    outcome: 'Added Dudhsagar’s four tiers, distinguishing their combined height from a single drop.',
    next: 'Seek a geological map or survey that identifies the bedrock at the falls.',
  },
  {
    state: 'Haryana', date, layers: ['geology'],
    sources: [['Haryana Tourism · Morni and Tikkar Tal', 'https://haryanatourism.gov.in/places_of_interest/morni-and-tikkar-tal/']],
    outcome: 'Added the paired lakes and separating hillock. The source reports similar lake levels but gives no hydrological measurements.',
    next: 'Seek a hydrology study before proposing a subsurface connection.',
  },
  {
    state: 'Himachal Pradesh', date, layers: ['history'],
    sources: [['Lahaul and Spiti district · Dhankar', 'https://hplahaulspiti.nic.in/tourist-places-in-spiti/']],
    outcome: 'Added the defensive siting of Dhankar citadel from the district’s Spiti account.',
    next: 'Check a conservation or architectural record for the sequence of construction at Dhankar.',
  },
  {
    state: 'Jharkhand', date, layers: ['geology'],
    sources: [['Government of Jharkhand · Hundru Falls', 'https://www.jharkhand.gov.in/home/AboutTourism']],
    outcome: 'Added the drop on the Subarnarekha and the state’s description of erosion at Hundru.',
    next: 'Seek a geological survey of the plateau edge to explain why the drop occurs here.',
  },
  {
    state: 'Lakshadweep', date, layers: ['biosphere'],
    sources: [['Lakshadweep Administration · Agatti island profile', 'https://lakshadweep.gov.in/islands/agatti/']],
    outcome: 'Added the shelter provided by the reef and the coral and fish habitat of Agatti lagoon.',
    next: 'Seek dated reef monitoring before describing present coral cover or trends.',
  },
  {
    state: 'Mizoram', date, layers: ['biosphere'],
    sources: [['Incredible India · Reiek village', 'https://www.incredibleindia.gov.in/en/rural-tourism/reiek']],
    outcome: 'Added Reiek’s forest and the youth organisation’s protection rules as described by the village profile.',
    next: 'Look for a public account by Reiek’s forest stewards before expanding the local history.',
  },
  {
    state: 'Puducherry', date, layers: ['geology'],
    sources: [['Incredible India · Chunnambar Boat House', 'https://www.incredibleindia.gov.in/en/puducherry/puducherry/chunnambar-boat-house']],
    outcome: 'Added the river mouth, backwaters and neighbouring beach south of Puducherry city.',
    next: 'Seek a coastal survey before describing seasonal changes in the mouth or shoreline.',
  },
  {
    state: 'Punjab', date, layers: ['biosphere'],
    sources: [['Ramsar Sites Information Service · Harike Lake', 'https://rsis.ramsar.org/ris/462']],
    outcome: 'Added Harike’s wintering and staging habitats. The Ramsar description dates to 1990; its counts were not used as current estimates.',
    next: 'Find a recent wetland census with survey dates before adding bird numbers.',
  },
  {
    state: 'Sikkim', date, layers: ['biosphere'],
    sources: [['Wildlife Institute of India · Khangchendzonga National Park', 'https://c2c.wii.gov.in/khangchendzonga-national-park']],
    outcome: 'Added the park’s changing vegetation with elevation, including the influence of slope and exposure.',
    next: 'Check a vegetation study for specific differences between alpine meadow types.',
  },
  {
    state: 'Tripura', date, layers: ['history'],
    sources: [['Unakoti district · Unakoti Heritage Site', 'https://unakoti.nic.in/tourist-place/unakoti-heritage-site/']],
    outcome: 'Added the central Shiva head and the distinction between rock-cut figures and separate stone images at Unakoti.',
    next: 'Consult an archaeological catalogue before assigning dates to individual carvings.',
  },
];
