# smooks.

A quiet personal website with collections of useful things.

- **Outside** — routes, conditions, navigation, skills and places to explore.
- **Play** — board games worth recommending, focused on the theme, what is fun and who might enjoy them.

## Status and deployment

This repository is connected to the existing Cloudflare Pages project serving both
[smooks.co.uk](https://smooks.co.uk/) and [www.smooks.co.uk](https://www.smooks.co.uk/).
Merges to \`main\` deploy automatically. For new features, use a separate branch
and review before merging.

Cloudflare build command: \`npm run build\`; output folder: \`dist\`; Node.js 22.

The Outside catalogue was reconstructed from an earlier direct-upload deployment.
It preserves 16 resource cards, 80 links, nine filters and the original safety warning.

## Run locally

Node.js 20+ is required. There are no third-party Node dependencies.

\`\`\`sh
npm run check
python3 -m http.server 4321 --directory dist
\`\`\`

Preview the homepage at \`/\`, Outside at \`/outside/\`, Play at \`/play/\`
and the first game at \`/play/heckmeck/\`.

## Adding a game to Play

Add one entry to \`data/play.json\`. Each recommendation includes:
- \`slug\`: unique lower-case URL segment, e.g. \`heckmeck\`
- \`name\`, \`strapline\`, and \`summary\`
- \`theme\`: what it is about
- \`fun\`: the experience and interactions that make it enjoyable
- \`audience\`: who might like it
- \`tags\`: a few plain-language characteristics
- \`art\`: choose \`dice\`, \`cards\`, \`tiles\`, or \`abstract\` for original typographic artwork
- \`amazonUrl\`: an **optional, game-specific** Associates link supplied by the site owner

The static build automatically creates a recommendation card at \`/play/\`
and an individual page at \`/play/<slug>/\` for each entry. Don't put a single
game's purchase link on another game's page. The page includes a clear affiliate
label and the Amazon Associate disclosure next to a relevant purchase link.
Games without a purchase link remain perfectly valid.

Game illustrations are original typographic motifs, not copied product art.
We can add licensed game photos later, without requiring them to add a recommendation.

## Other files

- \`data/resources.json\` — Outside content and external links.
- \`src/*.template.html\` — the homepage, Outside and Play templates.
- \`src/styles.css\` — global layout and the Play visual treatment.
- \`src/script.js\` — category filter interaction (Outside only).
- \`scripts/build.mjs\` — static generator.
- \`scripts/verify.mjs\` and \`tests/\` — automated checks.

The build generates CSS and JavaScript filenames based on content hashes,
preventing browsers from reusing obsolete cached styles.

## Privacy and external resources

The site itself sets no analytics cookies. Clicking an external destination
(including Amazon) opens that third-party site, which may have its own
privacy practices. Affiliate links are labelled and are not inserted unless
their destination has been supplied for that specific game.

The homepage uses a provisional remote landscape photograph: before a future
visual refresh, pick a properly licensed image and host it locally.
