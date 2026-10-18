# Production deployment: Cloudflare Pages (`smooks`)

This repository was originally published through Cloudflare Pages Direct Upload.
A successful GitHub **Verify website** run only proves the static build works; it
does **not** publish anything. This document accompanies the new workflow
[`.github/workflows/deploy-cloudflare-pages.yml`](../.github/workflows/deploy-cloudflare-pages.yml).

## Before merging the deployment PR

1. In Cloudflare **Workers & Pages**, identify the **existing** Pages project
   serving [smooks.co.uk](https://smooks.co.uk). Confirm that its project name
   is exactly **`smooks`**, its production branch is **`main`**, and
   it belongs to the Cloudflare account you intend to deploy from. If any
   of these differ, **stop and correct the workflow before merging**.
2. Find the **Cloudflare account ID**. This is an account identifier, not
   a zone ID.
3. In Cloudflare **My Profile → API Tokens → Create Token**, create a custom
   token with **Account → Cloudflare Pages → Edit** permission, scoped to
   the relevant account. Give only the permissions required by Pages uploads;
   don't use a global API key or a token with broad DNS permissions.
4. In this GitHub repository, go to **Settings → Secrets and variables →
   Actions → New repository secret**. Add these two names exactly:
   - `CLOUDFLARE_ACCOUNT_ID`: the account ID from step 2.
   - `CLOUDFLARE_API_TOKEN`: the token from step 3.
5. Review this PR. **Merging is the activation step:** the push to `main`
   will trigger the first production upload. Do not merge until you are
   ready for that upload. You don't have to share either secret in chat.

## What happens on each push to main

- `Deploy smooks` checks out `main` on Node.js 22.
- It runs **`npm run check`**, which tests, builds and verifies the site.
  There is deliberately **no `npm ci`**: the repository has no
  third-party Node dependencies or `package-lock.json`.
- It checks that the generated home, Outside and Play files exist.
- It stops with a clear message if either required GitHub Actions secret
  is missing (the previous live site stays unchanged).
- It uses Cloudflare's official `wrangler-action@v4` to run
  `pages deploy dist --project-name=smooks --branch=main` against the
  **existing** Pages project. No DNS or Cloudflare project settings are
  changed by the workflow.
- It may publish a GitHub Deployment record using `GITHUB_TOKEN`.

This workflow does not run on pull requests or feature-branch pushes.
There is no PR preview deployment in this first version. A manual run under
**Actions → Deploy smooks → Run workflow** is also available **on `main`
only**, so an accidental feature-branch selection cannot publish to production.

## After the first successful deployment

1. Open **GitHub → Actions → Deploy smooks** and check the production run,
   including the deploy step's Cloudflare output.
2. Confirm Cloudflare's **Deployments** list shows a new production upload
   for the same commit and that the project still serves the two domains.
3. Check all four URLs:
   - https://smooks.co.uk/
   - https://smooks.co.uk/outside/
   - https://smooks.co.uk/play/
   - https://smooks.co.uk/play/colt-express/
4. Check that the homepage now links to Play and the Play listing displays
   the game recommendations. If CI succeeds but the site is still old,
   investigate which Cloudflare Pages project actually owns the custom domain;
   do not blindly recreate the site or change DNS.

To retry later without another code change, run **Deploy smooks** manually
on `main` from the Actions tab. Future merges to `main` deploy automatically.

Reference: [Cloudflare's Direct Upload CI guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## Safeguards

- This PR prepares **code only**. Opening or testing the PR does not deploy.
- **Merging the PR will attempt a real production deployment** if the secrets
  have been added; otherwise the deploy workflow fails without an upload.
- The existing Outside and Play content are built together from this same
  repository. No redesign, domain migration, new Pages project, or DNS change.
- Treat the API token as a secret; rotate it in Cloudflare if compromised.
