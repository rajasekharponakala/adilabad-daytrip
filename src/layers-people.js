const ugadi = ['Mahabubnagar District · Ugadi celebrations', 'https://mahabubnagar.telangana.gov.in/festival/ugadi-fesitival/'];
const gi = (label, number) => [label, `https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/${number}`];

// Editorial discovery only. Linked atlas places provide context, not access or invitations.
export const peopleEntries = [
  {
    id: 'living-nagoba-jatara', name: 'Nagoba Jatara at Keslapur', state: 'Telangana', area: 'Keslapur, Adilabad district', layer: 'anthropology', placeId: 'nagoba',
    summary: 'The district records a gathering in the month of Pushya to honour Nagoba, with Gond devotees from Adilabad and neighbouring Maharashtra among the participants. This is a living religious observance; do not assume that every rite is open to visitors or photography.',
    sources: [['Adilabad District · Nagoba Jatara', 'https://adilabad.telangana.gov.in/places-of-interest/']],
  },
  {
    id: 'living-sankirtana', name: 'Sankirtana of Manipur', state: 'Manipur', area: 'Manipur plains', layer: 'anthropology',
    summary: 'In the Vaishnava communities described in the nomination, singing, drumming and dancing recount stories of Krishna and mark both religious occasions and stages of life. Mentors pass on the skills to disciples; the linked dossier includes community consent for nomination, not permission to record a ceremony.',
    sources: [['UNESCO · community-backed nomination and consent documents', 'https://ich.unesco.org/en/RL/sankirtana-ritual-singing-drumming-and-dancing-of-manipur-00843']],
  },
  {
    id: 'living-durga-puja', name: 'Durga Puja image-making', state: 'West Bengal', area: 'Kolkata', layer: 'anthropology',
    summary: 'Kolkata workshops shape images of Durga and her family from unfired clay in the months before the festival. Painting the eyes at Mahalaya and immersing the images at the end give the craft a place in the ritual cycle.',
    sources: [['UNESCO · Durga Puja nomination and community consent', 'https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703']],
  },
  {
    id: 'living-ramman', name: 'Ramman ritual theatre', state: 'Uttarakhand', area: 'Saloor–Dungra, Garhwal', layer: 'anthropology',
    summary: 'Ramman honours Bhumiyal Devta through songs, masked dances and recitation, including a local version of the Rama epic. The village communities organise the observance and hold distinct ritual responsibilities; the dossier is a starting point for reading, not an invitation.',
    sources: [['UNESCO · Ramman nomination and community consent', 'https://ich.unesco.org/en/RL/ramman-religious-festival-and-ritual-theatre-of-the-garhwal-himalayas-india-00281']],
  },
  {
    id: 'living-kalbelia-song', name: 'Kalbelia song and dance', state: 'Rajasthan', area: 'Rajasthan', layer: 'anthropology',
    summary: 'The nomination describes an oral tradition in which Kalbelia artists share stories through song and improvise lyrics in performance. It documents how practitioners have adapted their music and dance as livelihoods changed.',
    sources: [['UNESCO · Kalbelia nomination and community consent', 'https://ich.unesco.org/en/RL/kalbelia-folk-songs-and-dances-of-rajasthan-00340']],
  },

  {
    id: 'food-ugadi-pachadi', name: 'Ugadi pachadi', state: 'Telangana', area: 'Mahabubnagar district', layer: 'culinary',
    summary: 'The district’s Telugu New Year account describes a festive preparation with six flavours. Its associations with different feelings are part of the celebration’s symbolism, not a rule about how every household prepares it.',
    sources: [ugadi],
  },
  {
    id: 'food-hyderabad-haleem', name: 'Hyderabad Haleem', state: 'Telangana', area: 'Hyderabad', layer: 'culinary',
    summary: 'The Haleem Makers Association registered Hyderabad Haleem as a geographical indication. Its filing and register entry document how a makers’ association defined a regional preparation for legal protection.',
    sources: [gi('GI Registry · Haleem Makers Association filing', 193)],
  },
  {
    id: 'food-tirumala-laddu', name: 'Tirumala laddu', state: 'Andhra Pradesh', area: 'Tirumala, Tirupati district', layer: 'culinary',
    summary: 'This laddu is associated with Tirumala’s temple offering tradition. The temple trust, Tirumala Tirupati Devasthanam, is the applicant for the registered name “Tirupathi Laddu”.',
    sources: [gi('GI Registry · Tirumala Tirupati Devasthanam filing', 121)],
  },
  {
    id: 'food-dharwad-pedha', name: 'Dharwad Pedha', state: 'Karnataka', area: 'Dharwad', layer: 'culinary',
    summary: 'The Dharwad Pedha is registered under a filing by a local pedha manufacturers’ welfare trust. The registry includes the makers’ statement of case and a map of the geographical indication.',
    sources: [gi('GI Registry · Dharwad Pedha makers’ filing', 80)],
  },
  {
    id: 'food-odisha-rasagola', name: 'Odisha Rasagola', state: 'Odisha', area: 'Odisha', layer: 'culinary',
    summary: 'A state enterprise and a sweets-makers’ association jointly registered Odisha Rasagola. Compare the filing with Banglar Rasogolla: the registry documents two separately named regional products, not a verdict on who invented rasagola.',
    sources: [gi('GI Registry · Odisha Rasagola', 612), gi('GI Registry · Banglar Rasogolla', 533)],
  },

  {
    id: 'sky-nizamiah', name: 'Nizamiah Observatory star catalogue', state: 'Telangana', area: 'Hyderabad', layer: 'astronomy',
    summary: 'Osmania University records that the observatory measured the positions of more than 460,000 stars and published them in twelve volumes of the Astrographic Catalogue. This is a historical record of how astronomers mapped the sky.',
    sources: [['Osmania University · astronomy facilities and catalogue', 'https://www.osmania.ac.in/sciencecollege/astron_facilities.html']],
  },
  {
    id: 'sky-kodaikanal', name: 'Kodaikanal Solar Observatory', state: 'Tamil Nadu', area: 'Kodaikanal, Palani Hills', layer: 'astronomy',
    summary: 'More than a century of observations lets researchers compare the Sun over long periods and across wavelengths. The observatory links to its digitised archive and daily solar images, both useful without a site visit.',
    sources: [['Indian Institute of Astrophysics · observatory and data links', 'https://www.iiap.res.in/centers/kso/']],
  },
  {
    id: 'sky-hanle', name: 'Himalayan Chandra Telescope', state: 'Ladakh', area: 'Hanle, Leh district', layer: 'astronomy',
    summary: 'Hanle’s two-metre telescope observes in visible and infrared light from a high-altitude site with low atmospheric water vapour. The Indian Institute of Astrophysics operates the telescope remotely from its CREST campus.',
    sources: [['Indian Institute of Astrophysics · Indian Astronomical Observatory', 'https://www.iiap.res.in/centers/iao/']],
  },
  {
    id: 'sky-devasthal', name: 'Devasthal Optical Telescope', state: 'Uttarakhand', area: 'Devasthal, Nainital district', layer: 'astronomy',
    summary: 'The 3.6-metre research telescope collects images and spectra in visible and near-infrared light. ARIES explains its instruments and publishes a gallery of observations, including images of Saturn and the Crab Nebula.',
    sources: [['ARIES · telescope facility', 'https://aries.res.in/dot/'], ['ARIES · observing gallery', 'https://www.aries.res.in/dot/gallery.html']],
  },
  {
    id: 'sky-gmrt', name: 'Giant Metrewave Radio Telescope', state: 'Maharashtra', area: 'Khodad, Pune district', layer: 'astronomy',
    summary: 'Thirty dishes, each 45 metres across, work together as a radio interferometer. Combining the signals makes this a very different kind of observation from looking through a visible-light telescope.',
    sources: [['NCRA–TIFR · research facility', 'https://www.ncra.tifr.res.in/research/the-giant-metrewave-radio-telescope']],
  },

  {
    id: 'calendar-ugadi-reading', name: 'Ugadi almanac reading', state: 'Telangana', area: 'Mahabubnagar district', layer: 'astrology',
    summary: 'Mahabubnagar’s district administration records Panchanga Sravanam, a reading of the traditional almanac, as part of its Telugu New Year celebrations. The reading is presented here as a cultural observance, not as scientific forecasting.',
    sources: [ugadi],
  },
  {
    id: 'calendar-rashtriya-panchanga', name: 'Rashtriya Panchanga', state: 'West Bengal', area: 'Kolkata', layer: 'astrology',
    summary: 'The Positional Astronomy Centre’s month-by-month reference brings together Saka Era dates and traditional panchanga reckoning. It shows how calculated calendar data and cultural ways of marking time can appear side by side without validating astrological predictions.',
    sources: [['Positional Astronomy Centre · Indian calendar months', 'https://packolkata.imd.gov.in/panchang/en/panchang']],
  },
  {
    id: 'calendar-ladakh-losar', name: 'Ladakhi Losar', state: 'Ladakh', area: 'Across Ladakh', layer: 'astrology',
    summary: 'The Leh district account relates Ladakhi New Year observances to the tenth month of the Tibetan calendar. It describes prayers and visits among families and neighbours. This is a calendrical tradition, not a claim about how celestial events affect people.',
    sources: [['District Leh · Ladakh festival traditions', 'https://leh.nic.in/swadesh-darshan-leh/']],
  },
  {
    id: 'calendar-vishu-medam', name: 'Vishu and the month of Medam', state: 'Kerala', area: 'Across Kerala', layer: 'astrology',
    summary: 'Vishu falls on the first day of Medam in the Malayalam calendar. Kerala Tourism documents its traditional association with the Sun’s entry into Aries, a calendrical and astrological convention rather than a statement about the modern astronomical constellation.',
    sources: [['Kerala Tourism · Vishu festival documentation', 'https://www.keralatourism.org/1000festivals//assets/uploads/pdf/Vishu.pdf']],
  },
  {
    id: 'calendar-kumbh-mela', name: 'Kumbh Mela and ritual time', state: 'Uttar Pradesh', area: 'Prayagraj, one of four host cities', layer: 'astrology',
    summary: 'The UNESCO dossier situates astrology alongside pilgrimage, spirituality and ritual practice at Kumbh Mela. The role of astrology here is cultural and religious, not evidence for predictions. Prayagraj is one of the four host cities documented in the dossier.',
    sources: [['UNESCO · Kumbh Mela nomination and consent documents', 'https://ich.unesco.org/en/RL/kumbh-mela-01258']],
  },
];
