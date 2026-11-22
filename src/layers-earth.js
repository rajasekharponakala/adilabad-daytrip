const worldHeritage = id => ['UNESCO World Heritage Centre · site record', `https://whc.unesco.org/en/list/${id}/`];
const tentative = id => ['India’s submission · UNESCO Tentative List', `https://whc.unesco.org/en/tentativelists/${id}/`];
const ramsar = id => ['Ramsar Sites Information Service · site record', `https://rsis.ramsar.org/ris/${id}`];
const district = ['Adilabad District · Places of Interest', 'https://adilabad.telangana.gov.in/places-of-interest/'];
const gsi = ['Ministry of Mines · GSI geo-heritage inventory', 'https://www.pib.gov.in/newsite/printrelease.aspx?relid=137573'];

// Editorial discovery only. Atlas links identify related places, not visiting access.
export const earthEntries = [
  {
    id: 'earth-kuntala', name: 'Kuntala Waterfalls', state: 'Telangana', area: 'Near Neredikonda, Adilabad district',
    layer: 'geology', placeId: 'kuntala',
    summary: 'The Kadem River drops over a steep step before flowing into forest. Seasonal inflow changes how much of the rock face the cascade covers; the shape of the drop is easier to read when less water is coming over it.',
    sources: [district],
  },
  {
    id: 'earth-lalbagh', name: 'Lalbagh Peninsular Gneiss', state: 'Karnataka', area: 'Bengaluru',
    layer: 'geology', placeId: 'lalbagh',
    summary: 'The exposed bedrock in Lalbagh is Peninsular Gneiss, listed by the Geological Survey of India. Gneiss often shows light and dark mineral bands; unlike sedimentary layers, these bands reflect changes in the rock under heat and pressure.',
    sources: [gsi],
  },
  {
    id: 'earth-lonar', name: 'Lonar Impact Crater', state: 'Maharashtra', area: 'Buldhana district',
    layer: 'geology', placeId: 'lonar',
    summary: 'A meteorite struck basalt bedrock, leaving a roughly circular basin with steep walls. The lake has no outflow, so evaporation concentrates dissolved salts and helps explain its saline, alkaline water. The crater shape and the water chemistry tell different parts of its story.',
    sources: [ramsar(2441)],
  },
  {
    id: 'earth-deccan', name: 'Deccan Traps at Panchgani and Mahabaleshwar', state: 'Maharashtra', area: 'Satara district',
    layer: 'geology', placeId: 'deccan',
    summary: 'Successive eruptions built a thick stack of basalt flows. Erosion exposes that stack as cliffs and benches, making the stepped profile a way to read multiple episodes of volcanism rather than a single lava flow.',
    sources: [tentative(6890)],
  },
  {
    id: 'earth-erra', name: 'Erra Matti Dibbalu', state: 'Andhra Pradesh', area: 'Visakhapatnam coast',
    layer: 'geology', placeId: 'erra',
    summary: 'Water and wind have shaped red coastal sediments into steep ridges and gullies. Their dramatic outlines do not mean the material is solid rock: much of it is unconsolidated and easily eroded.',
    sources: [tentative(6893)],
  },
  {
    id: 'earth-mawmluh', name: 'Mawmluh Cave and the Meghalayan Age', state: 'Meghalaya', area: 'East Khasi Hills',
    layer: 'geology', placeId: 'meghalayan',
    summary: 'A stalagmite from Mawmluh Cave preserves changes in oxygen isotopes used to reconstruct past monsoon conditions. A layer in that sample serves as the formal reference for the start of the Meghalayan Age, about 4,200 years ago.',
    sources: [['International Union of Geological Sciences · Mawmluh reference section', 'https://iugs-geoheritage.org/geoheritage_sites/gssp-of-the-meghalayan-stage-in-the-mawmluh-cave/'], tentative(6892)],
  },
  {
    id: 'earth-naga', name: 'Naga Hill Ophiolite', state: 'Nagaland', area: 'Naga Hills',
    layer: 'geology', placeId: 'naga',
    summary: 'An ophiolite is a slice of former oceanic crust and upper mantle now exposed on land. The Naga Hills preserve fragments of the former Tethyan ocean, evidence of an ocean basin closing as continental blocks came together.',
    sources: [tentative(6889)],
  },
  {
    id: 'earth-mardihalli', name: 'Mardihalli Pillow Lavas', state: 'Karnataka', area: 'Chitradurga district',
    layer: 'geology',
    summary: 'The Geological Survey of India lists pillow lavas near Mardihalli. Their rounded forms are typical of lava that erupted underwater: the outside cooled quickly while fresh lava continued pushing into rounded lobes.',
    sources: [gsi],
  },

  {
    id: 'earth-bhimbetka', name: 'Bhimbetka Rock Shelters', state: 'Madhya Pradesh', area: 'Raisen district',
    layer: 'prehistory', placeId: 'bhimbetka',
    summary: 'Five clusters of sandstone shelters preserve paintings thought to range from the Mesolithic into the historical period. The shelters were used over a long span, so the paintings should not be read as a record of one moment or community.',
    sources: [worldHeritage(925)],
  },
  {
    id: 'earth-attirampakkam', name: 'Attirampakkam Stone Tools', state: 'Tamil Nadu', area: 'Kosasthalaiyar basin, Tiruvallur district',
    layer: 'prehistory',
    summary: 'Excavators dated the shift from Acheulean to early Middle Palaeolithic toolmaking to about 385,000 years ago, with an uncertainty of 64,000 years. The tools document changes in technique; they do not identify which human species made them.',
    sources: [['Akhilesh et al. · Nature excavation and dating study', 'https://www.nature.com/articles/nature25444']],
  },
  {
    id: 'earth-dhaba', name: 'Dhaba and the Toba Eruption', state: 'Madhya Pradesh', area: 'Middle Son Valley',
    layer: 'prehistory',
    summary: 'At Dhaba, researchers dated stone-tool assemblages to before and after the Toba super-eruption about 74,000 years ago. Similar tools on either side of that date suggest continuity in stoneworking at this site, not a conclusion about how the eruption affected every population.',
    sources: [['Clarkson et al. · Nature Communications excavation study', 'https://www.nature.com/articles/s41467-020-14668-4']],
  },
  {
    id: 'earth-retlapalle', name: 'Retlapalle Stone-Tool Assemblage', state: 'Andhra Pradesh', area: 'Upper Gundlakamma basin',
    layer: 'prehistory',
    summary: 'Fieldwork in the upper Gundlakamma basin documented Middle Palaeolithic stone tools at Retlapalle. The study combines analysis of how the tools were made with luminescence dating of sediments, which estimates when sediment grains were last exposed to light.',
    sources: [['Anil et al. · PLOS ONE field and dating study', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11349113/']],
  },
  {
    id: 'earth-burzahom', name: 'Burzahom Neolithic Settlement', state: 'Jammu and Kashmir', area: 'Kashmir Valley near Srinagar',
    layer: 'prehistory',
    summary: 'Excavation revealed a succession from below-ground dwelling pits to structures at ground level, together with stone and bone tools. Later layers include megalithic remains, making the site a record of changing settlement practices rather than a snapshot of one village.',
    sources: [tentative(5917)],
  },
  {
    id: 'earth-mudumal', name: 'Mudumal Megalithic Menhirs', state: 'Telangana', area: 'Narayanpet district, Krishna River basin',
    layer: 'prehistory',
    summary: 'Upright stones, burial circles and cup-marked rocks form a megalithic landscape. India’s UNESCO Tentative List submission proposes astronomical readings of some markings; these are interpretations, distinct from the physical evidence of the stones and burials.',
    sources: [tentative(6802)],
  },
  {
    id: 'earth-dholavira', name: 'Dholavira’s Harappan Waterworks', state: 'Gujarat', area: 'Khadir Bet, Kutch',
    layer: 'prehistory', placeId: 'dholavira',
    summary: 'Stone-built reservoirs and drains reveal how this Bronze Age Harappan city managed seasonal water. Workshops, housing and fortifications help place that engineering within the everyday life of a planned settlement.',
    sources: [worldHeritage(1645)],
  },

  {
    id: 'earth-jainath', name: 'Jainath Temple and Its Inscription', state: 'Telangana', area: 'Jainad, Adilabad district',
    layer: 'history', placeId: 'jainath',
    summary: 'The district records a Prakrit inscription of twenty verses at the stone temple. An inscription and an architectural style are different kinds of evidence: one preserves a text, while the other can be compared with other buildings.',
    sources: [district],
  },
  {
    id: 'earth-ramappa', name: 'Ramappa Temple and Kakatiya Craft', state: 'Telangana', area: 'Palampet, Mulugu district',
    layer: 'history', placeId: 'ramappa',
    summary: 'Construction began in 1213 CE. Dancers carved in stone preserve clues to Kakatiya performance traditions, while the nearby Kakatiya-built reservoir shows how the temple belonged to a wider landscape of irrigation and farming.',
    sources: [worldHeritage(1570)],
  },
  {
    id: 'earth-mahabalipuram', name: 'Mahabalipuram and Pallava Stoneworking', state: 'Tamil Nadu', area: 'Chengalpattu coast',
    layer: 'history', placeId: 'mahabalipuram',
    summary: 'The Pallava monuments preserve several ways of working stone: caves cut into bedrock, chariot-shaped shrines carved from individual boulders and temples assembled from blocks. The contrast helps explain the difference between rock-cut and structural architecture.',
    sources: [worldHeritage(249)],
  },
  {
    id: 'earth-hampi', name: 'Hampi and the Vijayanagara Capital', state: 'Karnataka', area: 'Tungabhadra valley, Vijayanagara district',
    layer: 'history',
    summary: 'Bazaars, temples, tanks and fortified spaces show how the Vijayanagara capital worked as a city. Its builders integrated the Tungabhadra River and boulder-strewn terrain into the layout and waterworks.',
    sources: [worldHeritage(241)],
  },
  {
    id: 'earth-hoysalas', name: 'Sacred Ensembles of the Hoysalas', state: 'Karnataka', area: 'Belur, Halebidu and Somanathapura',
    layer: 'history',
    summary: 'The three temple complexes use star-shaped plans and layered bands of carving to tell stories around the shrines. Some sculptors signed their work, preserving evidence of individual artists within a royal building tradition.',
    sources: [worldHeritage(1670)],
  },
  {
    id: 'earth-moidams', name: 'Charaideo Moidams', state: 'Assam', area: 'Charaideo district',
    layer: 'history',
    summary: 'The Ahom royal burial landscape preserves earthen mounds over constructed chambers. The chambers and grave goods document a royal funerary tradition, distinct from the prehistoric standing-stone traditions elsewhere in the atlas.',
    sources: [worldHeritage(1711)],
  },

  {
    id: 'earth-kawal', name: 'Kawal Tiger Reserve', state: 'Telangana', area: 'Northern Telangana, Godavari basin',
    layer: 'biosphere',
    summary: 'Kawal’s dry deciduous forests include extensive teak stands. Connections to other Central Indian forests matter for wildlife movement, so protecting habitat beyond the reserve boundary is important too.',
    sources: [['National Tiger Conservation Authority · Kawal reserve profile', 'https://ntca.gov.in/assets/uploads/briefnote/kawal.pdf']],
  },
  {
    id: 'earth-loktak', name: 'Loktak Lake and Its Floating Meadows', state: 'Manipur', area: 'Bishnupur area',
    layer: 'biosphere', placeId: 'loktak',
    summary: 'Vegetation and soil form thick floating mats called phumdis. These mats help create a mosaic of open water and wetland habitat in a freshwater lake that also supplies water for irrigation and domestic use.',
    sources: [ramsar(463)],
  },
  {
    id: 'earth-chilika', name: 'Chilika’s Freshwater–Saltwater Gradient', state: 'Odisha', area: 'Odisha coast',
    layer: 'biosphere', placeId: 'chilika',
    summary: 'The balance between river inflow and exchange with the Bay of Bengal changes across the lagoon and through the year. That shifting salinity supports different aquatic habitats, and the wetland provides breeding, wintering and stopover grounds for waterbirds.',
    sources: [ramsar(229)],
  },
  {
    id: 'earth-keoladeo', name: 'Keoladeo’s Managed Wetlands', state: 'Rajasthan', area: 'Bharatpur',
    layer: 'biosphere', placeId: 'keoladeo',
    summary: 'Keoladeo depends on water supplied and regulated from outside the park. Its importance to resident nesting birds and wintering migrants shows how decisions about water can directly shape a protected wetland.',
    sources: [worldHeritage(340)],
  },
  {
    id: 'earth-sundarbans', name: 'Sundarbans Tidal Mangroves', state: 'West Bengal', area: 'Indian Sundarbans, lower Ganges delta',
    layer: 'biosphere', placeId: 'sundarbans',
    summary: 'Salt-tolerant mangroves grow along tidal channels and across muddy and sandy flats. The Indian national park is one part of a larger mangrove system spanning India and Bangladesh.',
    sources: [worldHeritage(452)],
  },
  {
    id: 'earth-gulf-of-mannar', name: 'Gulf of Mannar Biosphere Reserve', state: 'Tamil Nadu', area: 'Southeastern Tamil Nadu coast',
    layer: 'biosphere',
    summary: 'Coral reefs, seagrass meadows and mangroves form distinct but neighbouring coastal habitats. Seagrass is a feeding ground for dugongs, while the reefs support diverse marine fish.',
    sources: [['UNESCO Man and the Biosphere Programme · reserve profile', 'https://www.unesco.org/en/mab/gulf-mannar']],
  },
];
