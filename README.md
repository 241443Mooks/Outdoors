# smooks — outdoors

Editable, static-source reconstruction of the outdoor resource directory at [smooks.co.uk](https://smooks.co.uk/).

## Status

This is a **reconstruction from the publicly deployed website**, not the original source files. It preserves the live catalogue as retrieved on 16 October 2026: **16 resource cards, 80 external resource links, 9 category filters, 4 “Before you go” shortcuts**, descriptions, page copy and the wild-food caution.

**The existing live Cloudflare Pages site remains unchanged.** Its project uses direct upload and is not connected to this Git repository. A new deploy requires deliberate configuration; do not assume a commit publishes.

## Run locally

Requires Node.js 20 or later. No package installation or third-party dependencies.

```sh
npm test
npm run build
python3 -m http.server 4321 --directory dist
```

Visit `http://localhost:4321` for a locally served preview.

## Edit and rebuild

- `data/resources.json` — single source of truth for all categories, text, links and shortcuts.
- `src/index.template.html` — semantic page structure and metadata.
- `src/styles.css` — theme variables, layout, responsive styling, focus states.
- `src/script.js` — accessible category filters, status messages and URL query state.
- `scripts/build.mjs` — generates fully rendered static `dist/index.html` plus styles/assets.
- `tests/content.test.mjs` — catalogue and integrity checks.

Run `npm test && npm run build` after editing. The build output in `dist/` is intentionally not tracked. The resource links are pre-rendered in HTML, so they remain available without JavaScript; filters require JavaScript.

## Cloudflare Pages

For a **new** Git-connected Pages project: use this repo, build command `npm run build`, output directory `dist`, root directory `/`. Review DNS and deployment behaviour separately before moving the live domain.

For the **existing Direct Upload** Pages project: it can continue to receive manual or Wrangler deployments of `dist/` after approval. It cannot be converted in place to Git integration.

Do not deploy or change `smooks.co.uk` without explicit approval.

## Limitations

The original CSS, icons, source code and nonpublic deployment settings were not recoverable from the published page. This implementation recreates the visible content and interactions, with a neutral visual baseline ready for theme review. External sites may move or change; individual destinations have not been independently audited.

## Privacy

There are no cookies, analytics scripts, third-party fonts or trackers in this project. External links open their respective third-party websites.
