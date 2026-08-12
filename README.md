# Liangwei Hu Portfolio

A static research and engineering portfolio for presenting technical direction, project case studies, and track-specific CVs. The published copy intentionally leaves unverified details marked `TODO` instead of filling gaps with assumptions.

## Stack

- [Astro](https://astro.build/) with static output
- MDX content collections for project case studies
- Tailwind CSS v4 through the Vite plugin, with the site design in `src/styles/global.css`
- Small, framework-free scripts for the mobile navigation, project filters, and opt-in PDF previews
- Cloudflare Workers static assets configured by `wrangler.jsonc`
- Node's built-in test runner for production HTML and artifact contracts

The site has no SPA runtime, client framework, database, analytics, or server-rendered route.

## Local development

Node.js 22.12 or newer is required.

```sh
npm ci
npm run dev
```

Astro serves the development site at `http://localhost:4321`. In Codex-managed environments, start the server in background mode with `astro dev --background` and manage it with `astro dev status`, `astro dev logs`, and `astro dev stop`.

## Build and test

```sh
npm test
npm run build
npm run preview
```

`npm test` builds the static site and checks the phase contracts, published routes, internal links, CV artifacts, SEO metadata, and deployment invariants. `npm run build` writes the deployable site to `dist/`. Do not hand-edit `dist/`; it is generated output.

## File architecture

```text
public/
  cv/                    Published, verified PDF files
  favicon.*              Static site icons
  robots.txt             Search crawler policy
src/
  components/            Page sections and shared layout components
  config/                Site metadata, navigation, and project categories
  content/projects/      One MDX case study per project
  data/                  Verified, typed academic data for page consumers
  layouts/               Shared HTML and project-detail shells
  pages/                 Astro routes
  styles/global.css      Global design and responsive behavior
tests/                   Build-level HTML and artifact contracts
astro.config.mjs         Static Astro build configuration
wrangler.jsonc           Cloudflare static-assets deployment configuration
```

## Add or update a project

1. Copy an existing file in `src/content/projects/` and give it a unique lowercase slug filename.
2. Complete its frontmatter according to `src/content.config.ts`. Categories must come from `src/config/projects.ts`; booleans and arrays must retain their declared types.
3. Keep `cover: TODO` until a real image is available. When adding one, place the optimized asset under `public/` and set `cover` to its root-relative URL, such as `/images/projects/example.webp`.
4. Keep unknown dates, roles, outcomes, links, and case-study sections explicitly marked `TODO`. Do not infer them.
5. Run `npm test` and `npm run build`. The project collection automatically creates `/projects/<slug>` and adds the card to the projects index; set `featured: true` only when it should also appear on the home page.

## Update CVs

Published PDFs live in `public/cv/` and are referenced by the track list in `src/pages/cv.astro`.

1. Replace the relevant PDF only with the author's verified document, or add a new verified file with a stable, descriptive filename.
2. Update the corresponding `pdf` path and `available` state in `src/pages/cv.astro`.
3. Update the expected byte length and SHA-256 digest in `tests/phase5-cv.test.mjs`. This makes accidental PDF replacement visible in review.
4. Keep unavailable tracks in the “Coming soon” state. Never add a link for a PDF that does not exist.
5. Run `npm test` and open the production build to verify preview, open, download, and browser fallback behavior.

## Cloudflare deployment

The deployment path is intentionally simple:

```text
GitHub repository -> npm ci -> npm test -> npm run build -> dist/ -> npx wrangler deploy
```

For GitHub-based CI or deployment:

1. Check out the repository and use a Node version compatible with `package.json`.
2. Run `npm ci` so the lockfile controls dependency installation.
3. Run `npm test`, then `npm run build`.
4. Authenticate Wrangler through the CI provider's encrypted secrets and run `npx wrangler deploy` from the repository root.
5. Wrangler publishes `./dist` using the existing Worker name and assets directory in `wrangler.jsonc`.

Do not change the Worker name, assets directory, or Astro static-output mode without a deliberate deployment migration. Never commit Cloudflare tokens, account credentials, private contact details, unpublished CVs, or other personal sensitive data.

## Truthfulness and security constraints

- Publish only claims, dates, institutions, roles, results, links, and documents that have been verified by the portfolio owner.
- Preserve visible `TODO` markers when evidence is not available; a polished placeholder is preferable to invented content.
- Treat files under `public/` as public internet assets. Remove metadata or private information from documents and images before adding them.
- Keep external links intentional and use safe new-tab attributes where applicable.
- Review dependency and lockfile changes, and use repository or CI secret storage for all credentials.

Academic facts are centralized in `src/data/education.ts` rather than page templates. Each GPA, rank state, course label, study period, and research focus has an evidence classification; the non-public provenance and conflict record lives in `docs/CONTENT_SOURCES.md`. Never move transcripts or CET6 records into `public/`.
