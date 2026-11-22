# Fieldday India

A mobile-first geotourism atlas and one-day planner. Browse India by place, state or union territory, and theme; save ideas on the current device. In Adilabad and Bengaluru, enter a time window, choose a start point, mode and pace, and generate a round trip with buffered travel times. English UI with Telugu names for planning stops. No account or analytics; trip inputs remain on the device.

The 3D Geo Lab is an on-demand set of seven educational models. It covers Lonar’s meteorite impact, Deccan lava flows, cooling joints at St. Mary’s Islands, cliff retreat at Varkala, cave formation in Meghalaya, river-island change at Majuli, and water storage at Dholavira. Each exhibit has three stages and keyboard, button and pointer rotation. The models are schematic, not measured terrain, archaeological reconstructions or numerical forecasts. No API key, account, or external 3D service is required.

The `/places/` directory links to 48 individual field guides. Each is built as static HTML (no JavaScript required), with an attributed image, editorial notes about the site, things to observe, access checks and source links. Changes to the atlas photo or notes data are included automatically at build time. Guide text lives in `src/field-notes.js`.

## Run and verify

Requires Node 22+ and npm. Browser tests use Chromium and exercise the production bundle at the GitHub Pages project subpath.

```sh
npm ci
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

## Data and limitations

The main atlas brings place guides and regional heritage notes into one search. The [heritage coverage table](https://rajasekharponakala.github.io/adilabad-daytrip/layers/#regional-reviews) includes dated regional checks with sources, findings and unresolved questions. For research context see the [competitive review](docs/competitive-review.md), [hands-on traveller benchmark](docs/traveller-benchmark.md), and [nationwide source roadmap](docs/data-source-roadmap.md).

- 48 editorial records covering all 28 states and 8 union territories, with per-place sources in `src/atlas.js` and `src/catalog.js`. A geotourism lens connects landforms to wildlife, architecture, archaeology, museums and farming. Discovery records are not route stops. UNESCO Tentative List citations do not imply World Heritage inscription.
- The two routing hubs have six eligible stops, including Kala Ashram, which requires a date-specific local confirmation. Adilabad’s two other visits use provisional planning windows. Bengaluru uses conservative windows and excludes Cubbon Park on published closure days. Verify site notices before travel. There are no live weather, closure, entry fee or step-free guarantees. Walking distances refer to travel between mapped stops, not walking inside attractions.
- `src/routes.json` holds directed estimates from [FOSSGIS OSRM](https://routing.openstreetmap.de/) based on [OpenStreetMap](https://www.openstreetmap.org/copyright) data (ODbL 1.0). It includes distances, simplified geometries and coordinate snap distances. The schematic is not turn-by-turn navigation. Pochera stayed discovery-only after the closest mapped car endpoint snapped about 810 m away from the falls pin.
- Use `npm run routes:refresh -- bengaluru` or `npm run routes:refresh -- adilabad` sparingly after updating the corresponding catalog. Review the resulting diff and run all tests before publishing. The shipped app makes no requests to the routing server.
- Before expanding coverage, field-check entrances, published hours, walking conditions, closure contacts and actual travel times. In particular, confirm an indoor day with Kala Ashram, and independently verify waterfall parking, walking approaches and access with local authorities. Do not publish the original conversation or recording in this repository.
- The pilot conversation supplies the core product flow: one free day → indoor/outdoor and ranked interests → transport and preferences → timed routes with optional meals. Cycling, live closures, accommodations, bookings and multi-day trips are not offered yet.
- Hero photograph: [Lonar Crater](https://commons.wikimedia.org/wiki/File:Lonar_Crater.jpg) by Akash Sharma, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/); resized to WebP and cropped by CSS. The photo derivative remains under the same license.
- Atlas images ship locally as compressed WebP files. Each record in `src/place-photos.json` identifies the original file, creator, license and alt text. Click **Sources and visit notes** for credits. If an exact image is unavailable, a labelled context image must not present another location as the advertised stop. Image derivatives retain their listed original license; photo licenses are separate from the site code.

## GitHub Pages

With `gh` authenticated and the repo pushed, set **Settings → Pages → Source → GitHub Actions** (or use `gh api --method POST repos/OWNER/adilabad-daytrip/pages -f build_type=workflow`). The included `Verify and deploy Pages` workflow runs unit tests, builds, runs browser tests and deploys only from `main`. If the first push happened before Pages was enabled, run `gh workflow run pages.yml --ref main`. Check `gh run list --workflow pages.yml` and fetch the published URL with `gh api repos/OWNER/adilabad-daytrip/pages --jq .html_url`.
