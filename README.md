# smooks.

A quiet personal website with collections of useful things.

- **Outside** — routes, conditions, navigation, skills and places to explore.
- **Play** — board, dice and card games worth recommending, focused on the theme, what is fun and who might enjoy them.

## Status and deployment

This repository is connected to the existing Cloudflare Pages project serving both
[smooks.co.uk](https://smooks.co.uk/) and [www.smooks.co.uk](https://www.smooks.co.uk/).
GitHub checks only verify the site until the Cloudflare deployment workflow is
configured and merged. After setup, commits merged into `main` automatically
publish the built `dist` folder to the existing Pages project. See
[Cloudflare deployment setup](docs/cloudflare-pages-deployment.md). Use a separate
branch and review before merging.

GitHub deployment build: `npm run check`; output folder: `dist`; Node.js 22.

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

Start with the [Play recommendation template](docs/play-recommendation-template.md).
It records the collection's purpose, editorial voice, writing outline and
checks for a new game. The owner only needs to share a game and what they
like about playing it; this isn't a form they need to complete.

Add one entry to \`data/play.json\`. Each recommendation includes:
- \`slug\`: unique lower-case URL segment, e.g. \`heckmeck\`
- \`name\`, \`strapline\`, and \`summary\`
- \`type\`: one primary category, \`board\`, \`dice\`, or \`card\`; this powers Play filters and the game type label
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

Play offers \`All games\`, \`Board games\`, \`Dice games\`, and \`Card games\` filters. Selecting one updates the visible cards, announced result count, and optional \`?type=\` URL (e.g. \`/play/?type=dice\`). No separate category pages or extra navigation are required. Without JavaScript, all games remain visible.

Game illustrations are original typographic motifs, not copied product art.
We can add licensed game photos later, without requiring them to add a recommendation.

## Other files

- \`data/resources.json\` — Outside content and external links.
- \`src/*.template.html\` — the homepage, Outside and Play templates.
- \`src/styles.css\` — global layout and the Play visual treatment.
- \`src/script.js\` — independent resource filters (Outside) and game type filters (Play).
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


## Gameplay photography and rights

Play prefers photos of the **game in play** over photos of boxes. Photos are
optional. Add an \`image\` object to a game in \`data/play.json\` only when
the right to reuse a specific photograph has been confirmed:

\`\`\`json
{
  "url": "https://example.com/gameplay-image.jpg",
  "alt": "What is actually shown on the table",
  "photographer": "Photographer's chosen credit",
  "source": "https://example.com/source-page",
  "license": "Specific licence or permission",
  "licenseUrl": "https://example.com/licence",
  "changes": "Unmodified photograph; fitted without cropping"
}
\`\`\`

The build validates that these fields exist and adds linked photographer and
licence credits on Play cards and detailed game pages. Never substitute an
Amazon listing photo, BoardGameGeek user image, publisher page image, or other
third-party photo merely because it is publicly visible.

The first CC-licensed image is served from Wikimedia Commons, **not hosted
on this repository**, so page visitors make a separate request to Wikimedia.
Keep the image fitted without cropping to preserve the permitted original
work. If the licence needs its own share-alike notice for adaptations, document
it explicitly before making changes.

Current image sourcing decisions: \`docs/play-image-sourcing.md\`.
