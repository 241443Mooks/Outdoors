# Historical draft preview instructions

**Status, 19 October 2026:** these instructions describe the original proposed
Git-connected preview setup, which was not verified. The merged workflow now
attempts a production upload from GitHub Actions and does not create PR previews.
Use [the current deployment guide](cloudflare-pages-deployment.md) and
[issue #6](https://github.com/241443Mooks/Outdoors/issues/6) for current work.
Do not assume a branch push creates a preview.

## Original draft instructions (historical)

The GitHub repository is connected to Cloudflare Pages. This document describes how to preview this **draft branch** separately from production.

## Branch and build settings

- Production branch: `main` (verify this is the selected production branch in Cloudflare).
- Draft branch: `feature/personal-homepage-a-d`.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Root directory: `/` (repository root).
- No framework preset or environment variables are required for this static build.

In Cloudflare Pages, under **Builds / Branch control**, ensure preview deployments are enabled for non-production branches (all non-production branches, or include `feature/personal-homepage-a-d`).

The Git connection should then deploy new commits on the draft branch to a separate `pages.dev` preview URL, potentially linked in pull request #1. A branch preview **does not** change the main production domain.

## Preview checklist

- Open the draft's preview URL from Cloudflare Deployments or PR #1 (do not guess an address).
- Check the homepage and its navigation, particularly on a phone.
- Visit `/outside/`; inspect cards and ensure the nine category filters work.
- Check **16** cards, **80** resource links and the wild-food warning.
- Review headings, button wording, focus visibility and tap targets.

## Before merging or deploying

1. Replace the draft's provisional remote Unsplash image with an approved, locally hosted image.
2. Review any preview-only styling/layout differences in real browsers.
3. Confirm the new production deployment will not overwrite a different Cloudflare project or domain unexpectedly.
4. Merge and publish only after explicit owner approval.

**GitHub Actions build checks are not Cloudflare deployment checks.**
