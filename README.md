# Adilabad Daytrip

A mobile-first, no-account day planner for Adilabad, Telangana. Enter a date and time window, choose a starting landmark and transport mode, rank interests, and get a round trip with buffered travel times. English UI with Telugu place names. It runs client-side and sends no trip inputs to a routing or analytics service.

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

- Seven places with per-record sources in `src/catalog.js`, reviewed on 2026-11-22. Gandhi Park and the exterior of Jainath Temple have *planning windows*, not verified hours. Kala Ashram is schedulable only with a locally confirmed window. Four attractions are discovery-only. There is currently no schedulable waterfall itinerary. No live weather, closure, entry fee, or accessible-route guarantees.
- `src/routes.json` holds directed estimates from [FOSSGIS OSRM](https://routing.openstreetmap.de/) based on [OpenStreetMap](https://www.openstreetmap.org/copyright) data (ODbL 1.0). It includes distances, simplified geometries and coordinate snap distances. The schematic is not turn-by-turn navigation. Pochera stayed discovery-only after the closest mapped car endpoint snapped about 810 m away from the falls pin.
- Use `npm run routes:refresh` sparingly after updating the catalog. This maintainer script sends the public points to FOSSGIS at a limited request rate. Review the resulting diff and run all tests before publishing. The shipped app makes no requests to the routing server.
- Before expanding coverage, field-check entrances, published hours, walking conditions, closure contacts and actual travel times. In particular, confirm an indoor day with Kala Ashram, and independently verify waterfall parking, walking approaches and access with local authorities. Do not publish the original conversation or recording in this repository.

## GitHub Pages

With `gh` authenticated and the repo pushed, set **Settings → Pages → Source → GitHub Actions** (or use `gh api --method POST repos/OWNER/adilabad-daytrip/pages -f build_type=workflow`). The included `Verify and deploy Pages` workflow runs unit tests, builds, runs browser tests and deploys only from `main`. If the first push happened before Pages was enabled, run `gh workflow run pages.yml --ref main`. Check `gh run list --workflow pages.yml` and fetch the published URL with `gh api repos/OWNER/adilabad-daytrip/pages --jq .html_url`.
