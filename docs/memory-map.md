# A map of things — draft

## What this adds

A `/map/` page for exploring memories by place. The homepage links to the sketch.
Work, Play and Explore have separate colours and text labels. Pins open dated
story popups; work stories use Situation / Task / Action / Result, with plain
headings. All stories also appear in a keyboard-accessible list. The list remains
available without JavaScript and if the detailed background fails to load.

The three starter entries are **illustrative examples**, including their places.
They are not biographical claims. No private email text is included. Replace them
with owner-reviewed entries as those are ready. The route is marked noindex, but
that is not privacy or access control: everything in this repository is public.

## Map behaviour

- Leaflet supports mouse drag, keyboard arrows, +/− buttons and pinch zoom.
- Zoom is limited to 1–11: world through city scale. No street-view imagery.
  City-scale tiles can still show roads; the cap limits detail, not data privacy.
- World resets the camera; Show all pins fits the currently filtered stories.
- Nearby screen positions group within 46 pixels. A grouped popup contains every
  story in that group. Markers stay 44 pixels wide regardless of zoom.
- Colour is supplemented by category text, titles and the matching list.
- On touch devices one-finger gestures leave page scrolling available; two fingers
  enable map movement. Real-device gesture acceptance is still required.
- Wheel zoom is disabled to avoid trapping ordinary page scrolling. Keyboard,
  buttons and pinch remain available. Reduced-motion settings disable animation.
- Filters change both pins and the list. The live count distinguishes matching
  stories from those currently inside the map view.
- The map and story list stack on small screens. Popups scroll internally if long.

## Adding an entry

Edit `data/memories.json`, keeping its `entries` array. Each entry has:

| Field | Meaning |
| --- | --- |
| id | Unique stable lower-case slug |
| category | work, play or explore |
| title, summary | Short public title and description |
| place | Public city/region label |
| latitude, longitude | Approximate city centre, not a home address |
| date | Human-readable date or approximate period; do not invent precision |
| status | example, published or draft |
| story | For work: situation, task, action and result strings |
| memory | For other categories: the short memory or story |

Draft entries are omitted from generated HTML. This is a website publishing filter,
not a way to keep information private in a public repository. The build validates
coordinates, categories, IDs, required text and work-story fields, and escapes
content before inserting HTML. There is no editor, email importer, timeline filter
or authentication in this draft.

## Sources and dependencies

- **Leaflet 1.9.4**, BSD 2-Clause, vendored in `public/vendor/leaflet-1.9.4/` with
  its licence. JS and CSS integrity are checked against the official
  [download page](https://leafletjs.com/download.html).
  Library source: https://github.com/Leaflet/Leaflet/tree/v1.9.4
  No runtime CDN request or npm install is needed to build the site.
- **OpenStreetMap Standard raster tiles**, loaded only by the browser for its map
  viewport via `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. Attribution remains
  visible. The URL is a data attribute in `src/map.template.html` so the service
  can be replaced. Respect browser caching and send the normal page-origin referrer.
  No scraping, prefetch or offline tile downloads are implemented.
  [Tile usage policy](https://operations.osmfoundation.org/policies/tiles/).
  Service availability is best-effort; reassess hosting if traffic grows.
- **Natural Earth 1:110m land**, public domain, locally stored as an SVG path in
  `data/world-land-path.json`, with source and projection recorded there. The path
  was projected into Web Mercator for alignment with Leaflet (EPSG:3857).
  This simplified coastline provides background context if tiles fail; it does not
  replace city detail. Longitude runs left-to-right from −180° to +180°, latitude
  is clipped at ±85.05112878°. No country boundaries or territorial claims layer.

Detailed map requests expose IP address and viewed tile area to OpenStreetMap.
A notice and privacy link appear below the map. Story text is served locally and
is not sent to the tile service. No geolocation permission, API key or paid service.

## Acceptance and remaining checks

Run `npm run check`. Focused tests cover sample labels, draft exclusion, escaping,
invalid coordinates, work fields, grouping, zoom configuration and vendored hashes.
The build verifier checks the generated map and versioned assets.

Browser flow: `/map/` → Work → pin → dated STAR popup → Read in the list.
Also check Show all pins, zoom cap, keyboard use, grouped points, mobile gestures,
no-JavaScript list and blocked-tile fallback. Browser acceptance must be recorded
on the draft PR before treating the feature as ready. Cloudflare publishing is
separate work tracked in issue #6; this PR does not change it.
