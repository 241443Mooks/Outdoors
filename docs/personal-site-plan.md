# SMooks: personal website direction and working plan

## Purpose

SMooks.co.uk is Sharron's personal home for things made, useful ideas, capabilities,
projects and interests. Outdoors is the repository name; Outside is one collection
within the site. Preserve the quiet, spacious presentation and conversational voice:
“Here are some things. Have a look.”

## Shape of the site

| Area | Purpose | Current position |
| --- | --- | --- |
| Home | Introduce the person and offer a few useful starting points | Built |
| Projects | Things made or improved, with a short account of the work | Planned |
| Capabilities | Explain how Sharron works, linked to concrete project examples | Planned |
| Notes | Ideas, observations, experiments and things being learned | Planned |
| Outside | Outdoor resources and interests | Built: 16 cards, 80 links |
| Play | Personal game recommendations | Built: eight games |

Add navigation when a section has real content. A project can be small or unfinished;
state its actual status. Professional work and personal interests belong together.
Portfolio entries should explain the problem, Sharron's contribution and the result,
with enough evidence to support the claims. Capabilities emerge from those examples.

## Capture past work without making it a large writing task

The owner can describe one thing in conversation, in any order. A rough paragraph
is enough. The assistant turns it into a capture record using the
[project template](project-entry-template.md), asks only for important missing facts,
and preserves uncertainties. There is no requirement to complete a form.

1. **Capture:** give the item a stable title and a GitHub issue, using the optional
   “Website content” template. Link related items instead of creating duplicates.
2. **Check:** distinguish personal recollection from supported facts. Confirm role,
   approximate dates, project status and any numerical outcomes. Say “date to confirm”
   rather than choosing a date. Link only material suitable for public sharing.
3. **Draft:** write a short summary first, then detail if the subject needs it.
   Link the draft PR from the capture issue. Keep one primary entry for each project;
   a later update extends that entry rather than creating conflicting copies.
4. **Review:** show the owner the wording, images and evidence to be published.
   Resolve missing facts or clearly omit unsupported claims.
5. **Publish:** merge the reviewed change, confirm the deployment, visit the real URL,
   then record the PR, commit and live URL on the capture issue before closing it.

Issue status can be recorded with a simple checklist: captured, checked, drafted,
reviewed, published. Captured does not mean ready to publish. A merged PR does not
prove the live site changed.

This repository and its issues are public. Unpublished website copy in a branch is
still public repository content. Keep confidential source material outside this repo;
use a short description of the evidence needed instead of uploading private records.

## First useful release

1. **Restore reliable publishing.** Continue [issue #6](https://github.com/241443Mooks/Outdoors/issues/6).
   Use the observed failure below to check the existing setup before choosing a
   migration. Agree one production publishing route and document it consistently.
2. **Capture three examples.** Select one recent project, one earlier work example
   and one idea or experiment. Start with whatever the owner can describe most easily.
   Do not wait for a complete career history.
3. **Implement Projects with real content.** Extend the current dependency-free static
   generator with a collection and detail template. Keep content separate from markup,
   generate stable URLs and omit drafts from generated pages, navigation and indexes.
   Draft filtering is a website publishing control, not repository privacy.
4. **Add a concise introduction and capabilities.** Base each capability on reviewed
   examples. Avoid claims that are supported only by a job title or a tool list.
5. **Add Notes when the first note is ready.** Keep Outside and Play growing through
   their existing workflows. Do not introduce a CMS before there is an editing need
   the existing workflow cannot meet.

Projects/Capabilities/Notes are a plan, not implemented routes. The capture workflow
is manual; it does not yet generate portfolio pages or ingest conversation history.

## Deployment checkpoint: 19 October 2026

Source: main commit `ec057ae7fe1518c2c819a0a32f1ab44a323c95bf`.
[Verify website passed](https://github.com/241443Mooks/Outdoors/actions/runs/39141078902).
[Deploy smooks failed](https://github.com/241443Mooks/Outdoors/actions/runs/39141078904).

The deployment log confirms:
- tests, build and generated-page checks passed;
- both Cloudflare secrets were present;
- Wrangler installed successfully;
- the Pages project API request failed with **Authentication error [code: 10000]**.

The failure is in Cloudflare API access, not the static build. The log alone does not
identify whether the cause is token permissions, account scope or another credential
configuration problem. Check the project-owning account, the configured account ID,
and the token's Pages Edit permission/scope using the existing
[deployment guide](cloudflare-pages-deployment.md). Do not broaden permissions based
only on Wrangler's supplementary membership-role warning.

An HTTP request from this workspace to the live home and Play pages returned 403;
this does not establish what a normal visitor sees. Live acceptance remains open.

## Publishing acceptance

- `npm run check` succeeds and the reviewed content appears in generated pages.
- The chosen deployment path reports success for the expected main commit.
- Home, Outside, Play and a detail page work on the actual custom domain.
- A second small reviewed change reaches the domain automatically; no manual upload.
- Check the new pages on a phone and with keyboard navigation.
- Record deployed commit, live URLs and date on the relevant issue.
