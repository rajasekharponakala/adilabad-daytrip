# Can I get back to the station by 16:00?

**Hands-on public web benchmark · 22 November 2026.** Wanderlog let a guest build a dated, four-entry round trip in both cities. OpenStreetMap returned all six requested car legs. Incredible India supplied places to consider and a Bengaluru itinerary, but the itinerary covered two days. In these runs, a traveller could assemble a plausible six-hour day; the return margin still required a calculation and local access checks.

## The traveller’s task

**Saturday 28 November 2026, 10:00–16:00 IST.** Leave the named station by car, visit two places, take 45 minutes for lunch and return to the same station by 16:00. Allow an hour at each stop and keep at least 30 minutes spare before the deadline. The hour is a visitor’s budget, not an operator’s recommended visit length. Use the same stop order to make the routes comparable:

| City | Start and finish | First stop | Second stop |
| --- | --- | --- | --- |
| Adilabad | Adilabad railway station | Jainath Temple | Gandhi Park |
| Bengaluru | Cubbon Park metro station | Lalbagh Botanical Garden | Visvesvaraya Industrial & Technological Museum |

**Method.** Used Playwright 1.65.1 with Chromium, signed out, English (India), Asia/Kolkata timezone. Read the rendered pages, search options, itinerary entries and route summaries. The same goal was brought to each product; only inputs actually accepted are reported below. A suggested place, a scheduled visit, a route estimate and a verified entrance are four different outcomes. No accounts, subscriptions or trials were used.

## Wanderlog — build the day as a guest

**Starting page and steps:** [Wanderlog](https://wanderlog.com/) → **Start planning** → [Plan a new trip](https://wanderlog.com/plan/create). Enter the city, choose the **City** result (Adilabad also offered a District result), pick 28 November twice for the start and end dates, then **Start planning**. The dialog said “Sign up to save your trip” and offered **Skip and sign up later**. That button opened the editor in both runs. Step through the introductory tips; under **Saturday, 28th November → Add a place**, search for the station, each stop, then the station again. Select the locally addressed results.

| City | What the editor produced | What the traveller still had to check |
| --- | --- | --- |
| Adilabad | The day read **Adilabad Railway Station → Suryanarayana Swami Temple, Jainath → Gandhi Park → Adilabad Railway Station**. Day total: **42 mins, 43 km**. The temple entry displayed **Open 6AM–8PM**. | The initial Explore panel highlighted an India guide labelled **999 km away from Adilabad**; searching by place name nevertheless worked. Gandhi Park had multiple similarly named local suggestions. The itinerary entry did not establish which gate to use. |
| Bengaluru | The day read **Cubbon Park → Lalbagh Botanical Garden → Visvesvaraya Industrial & Technological Museum → Cubbon Park**. The station search result said “Cubbon Park Metro Station”; the selected place detail said “Subway station.” Day total: **21 mins, 9.4 km**. Both attractions also appeared in Recommended places. | The final leg showed **11 min · 880 m**, and its Directions link specified `travelmode=walking`. The displayed total was therefore **not** an all-car estimate. The itinerary’s shorter “Cubbon Park” label alone did not identify a station exit. |

Both editors offered **Add time** on the return entry. The observed totals were travel times: we did not enter dwell times or lunch, test a deadline alert, or verify a saved trip after closing the browser. **Optimize route** was marked **Pro**; manual ordering did not require it.

## Incredible India — find stops and a suggested sequence

**Starting page and steps:** [English homepage](https://www.incredibleindia.gov.in/en) → search icon → enter city → **Search**. Inspect the result categories and open the most relevant attraction or itinerary. Repeat the homepage search with the stop names below.

- **[Adilabad search](https://www.incredibleindia.gov.in/en/search-results?q=Adilabad):** Two results: Kuntala Waterfalls and Adilabad Dokra craft. Opened [Kuntala Waterfalls](https://www.incredibleindia.gov.in/en/telangana/karimnagar/kuntala-waterfalls): its description and travel information supplied context, but the railway station it named was **Karimnagar Railway Station**, not our origin. Searching `Jainath Temple` returned zero results; `Gandhi Park` returned eight, none of the displayed result links identifying the Adilabad park. This path did not establish a timed visit to either requested stop. We did not substitute the waterfall just because it surfaced first.
- **[Bengaluru search](https://www.incredibleindia.gov.in/en/search-results?q=Bengaluru):** 38 results; selecting **Itineraries** narrowed this to two. Opened [Quick quest: Bengaluru’s highlights in 48 hours](https://www.incredibleindia.gov.in/en/trips/trip-listing/quick-quest-bengalurus-highlights-in-48-hours), labelled **2 Days | Bengaluru**, **38.2 km**. Day two included the requested museum and the planetarium. A separate `Lalbagh` search surfaced the [garden attraction](https://www.incredibleindia.gov.in/en/karnataka/bengaluru/lalbagh). `Visvesvaraya` returned zero search results **despite the museum being named in the itinerary**. The itinerary gave ideas for what to visit, not travel times for this station loop.

Neither sampled path yielded a date-specific 10:00 departure or 16:00 station return. This describes these searches and pages, not the limits of the entire site.

## OpenStreetMap — price each leg in time

**Starting page and steps:** Open [OpenStreetMap Directions](https://www.openstreetmap.org/directions), then load each linked route below in the public Directions page with OSRM car selected via the URL. Use the **From/To** coordinate pair from the [Fieldday catalog](../src/catalog.js), read **Distance / Time**, and repeat for the next pair including the return. Supplying known pins deliberately tests routing, not whether a traveller could discover the right entrance by name. Totals are our sums of displayed, rounded leg results.

| City | Station → first stop | First → second stop | Second stop → station | Car travel only |
| --- | --- | --- | --- | --- |
| Adilabad | [20 km · 20 min](https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=19.68077%2C78.53608%3B19.73537%2C78.64374) | [21 km · 20 min](https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=19.73537%2C78.64374%3B19.66%2C78.53389) | [3.2 km · 4 min](https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=19.66%2C78.53389%3B19.68077%2C78.53608) | **44.2 km · 44 min** |
| Bengaluru | [6.5 km · 7 min](https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=12.9809%2C77.59756%3B12.95372%2C77.58584) | [3.7 km · 4 min](https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=12.95372%2C77.58584%3B12.97522%2C77.59643) | [1.2 km · 2 min](https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=12.97522%2C77.59643%3B12.9809%2C77.59756) | **11.4 km · 13 min** |

**Manual answer to the traveller**, using those legs with lunch after the first visit. These times are our arithmetic, not an itinerary emitted by OpenStreetMap:

| Leave at 10:00 | First visit | Lunch | Second visit | Estimated back | Margin to 16:00 |
| --- | --- | --- | --- | --- | --- |
| Adilabad | 10:20–11:20 | 11:20–12:05 | 12:25–13:25 | **13:29** | 2 h 31 min |
| Bengaluru | 10:07–11:07 | 11:07–11:52 | 11:56–12:56 | **12:58** | 3 h 02 min |

Both loops clear the 30-minute reserve **on paper**. The route pages did not verify Saturday access, parking, the walk from a car to an entrance, queues, traffic at the proposed hour or time to reach a lunch venue. In particular, seven minutes to cover 6.5 km in Bengaluru is a routing estimate, not a measured Saturday drive. Confirm the drop-off, entry window and return conditions before treating either plan as dependable.

## What this changes for Fieldday

The clearest opportunity is to show the return margin **and what it depends on** next to the itinerary. A guest can already assemble local stops in Wanderlog, including in Adilabad; national tourism search can lead to useful interpretation even when a place-name query misses; a map can supply each leg when someone brings the pins. Fieldday can save the traveller the remaining work by naming the entrance, keeping the requested mode on every leg, and showing lunch, visit time and contingency separately. This two-city comparison supports testing that workflow; it does not establish which product routes most accurately or what happens on site.
