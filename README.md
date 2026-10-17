# smooks. — personal website and Outside collection

This is the source for a quiet personal home on the internet, beginning with **Outside**, a collection of useful outdoor links.

## Status

The [published outdoor directory](https://smooks.co.uk/) was originally deployed through Cloudflare Pages Direct Upload. This repository reconstructs the published content; it is **not** the original source code.

**This branch is a design proposal, not a live deployment.** A commit or pull-request merge here does not publish changes to the existing Cloudflare site.

## What's here

- A restrained personal homepage in the visual direction A + D: scenic hero, serif headline, dark forest details and understated copy.
- One real collection at \`/outside/\`. No empty pages or dead navigation for future Projects or Notes.
- All 16 published resource cards, 80 external resource links, 9 filters, four 'Before you go' shortcuts, original descriptions and the foraging caution.
- Mobile and desktop layouts, keyboard focus states, filter status announcement and reduced-motion support.
- Plain static HTML, CSS and JS with no application framework or dependencies.

## Run

Node 20+:

\`\`\`sh
npm run check
python3 -m http.server 4321 --directory dist
\`\`\`

Preview \`http://localhost:4321/\` and \`http://localhost:4321/outside/\`.

## Files

- \`data/resources.json\`: all Outside content and destinations; edit here.
- \`src/index.template.html\`: personal homepage.
- \`src/outside.template.html\`: outdoor resource directory.
- \`src/styles.css\`: site-wide tokens, typography, homepage, directory and responsive styles.
- \`src/script.js\`: category filtering on the directory.
- \`scripts/build.mjs\`: produces static \`dist/\`.
- \`tests/\`: integrity and basic site tests.

## Visual image dependency before deployment

The draft hero uses a **provisional Unsplash image loaded from an external CDN**, to make it possible to review the visual direction without choosing a final photograph. This makes a third-party image request in browsers. **Before publishing**, choose a final photograph, confirm its licence, self-host the optimised image in \`public/\`, update the CSS URL and remove this note. The CSS also provides a solid forest-colour fallback.

No analytics scripts or cookies are added by the project itself.

## Cloudflare

The current Pages project is configured for direct upload, not Git. It is unaffected by this branch. For a future new Git-connected Pages project: build \`npm run build\`, output \`dist\`; any live-domain cutover must be planned and explicitly approved. An existing Direct Upload project cannot be converted in place to Git integration.

**Do not change Cloudflare or the live domain without explicit approval.**
