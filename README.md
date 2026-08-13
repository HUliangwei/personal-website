# Liangwei Hu Portfolio

A bilingual, static research-engineering portfolio for technical journeys, evidence-qualified project case studies, academic context, and track-specific CVs. Unknown or unverified claims remain visibly marked `TODO`; the site never fills gaps with invented experience or results.

## Stack

- Astro 7 with TypeScript and static output
- Tailwind CSS 4 through the Vite plugin, with the design system in `src/styles/global.css`
- Astro Content Collections and MDX for bilingual project case studies
- Three.js, dynamically imported on the Home hero only
- Framework-free scripts for navigation, filters, PDF previews, and scroll enhancement
- Node's built-in test runner for source, build-output, privacy, and deployment contracts
- Cloudflare Workers Static Assets through the existing Wrangler configuration

There is no SPA framework, SSR adapter, database, analytics SDK, or required client-side model.

## Architecture

```text
public/
  cv/                         Verified public CV PDFs only
  models/hlw.glb              Optional verified personal model (not yet present)
  favicon.*
  robots.txt
src/
  components/
    about/                    Narrative journey sections and visuals
    cv/                       Academic profile, CV cards, opt-in PDF preview
    home/                     Hero, lazy 3D scene, and Home sections
    layout/                   Navigation and footer
    pages/                    Shared locale-aware page compositions
    projects/                 Cards, filters, figures, and concept diagrams
  config/                     Stable site and project taxonomy configuration
  content/projects/           Four Chinese and four English MDX case studies
  data/                       Typed education, CV, and journey data
  i18n/                       Dictionaries, locale types, and route helpers
  layouts/                    Base metadata shell and project detail layout
  pages/                      Chinese routes plus mirrored `/en` routes
  scripts/                    Progressive Home/About interaction modules
  styles/global.css           Design tokens, responsive layout, accessibility
  utils/model.ts              Build-time verified-model gate
docs/
  CONTENT_SOURCES.md          Non-public provenance and evidence ledger
  HLW_MODEL_GUIDE.md          Safe `/models/hlw.glb` replacement contract
tests/                        Phase and V2 integration contracts
astro.config.mjs             Static Astro and MDX configuration
wrangler.jsonc               Existing Cloudflare static-assets contract
```

Generated `dist/` and installed `node_modules/` are not source files and must not be edited or committed.

## Internationalization

Chinese is the default locale: `/`, `/about`, `/projects`, `/projects/<slug>`, and `/cv`. English mirrors each route under `/en`. Shared page components receive a locale, while `src/i18n/zh.ts` and `src/i18n/en.ts` own interface copy. `src/i18n/utils.ts` maps paths and preserves the current route when switching language.

Every locale page emits its own title, description, canonical URL, `zh-CN`/`en`/`x-default` alternates, HTML language, and Open Graph locale. When adding a route or project, add both locale versions and extend integration tests so the switch cannot fall back to a language home page.

## Projects

The public collection contains exactly four evidence-audited topics in both languages: SPAD readout IC, LeRobot/ACT learning practice, a vision-guided mobile robot, and superconducting-circuit HFSS simulation.

To update one:

1. Edit the matching `slug.mdx` and `slug.en.mdx` entries in `src/content/projects/`.
2. Keep the `slug`, `locale`, category, status, date, role, technologies, featured flag, and links compatible with `src/content.config.ts`.
3. Record factual provenance or conflicts in `docs/CONTENT_SOURCES.md` before publishing claims.
4. Keep unknown results and links as `TODO`; distinguish measured, simulated, pre-layout, and post-layout evidence.
5. Use `ProjectFigure.astro` and a correct figure type (`real`, `conceptual`, `simulation`, or `measured`). Concept diagrams must remain explicitly labelled and must not imitate experimental evidence.
6. Run `npm test` and `npm run build`.

Do not add a fifth placeholder project or infer tools, metrics, awards, fabrication, or measurements from adjacent material.

## Academic data

Publication-safe academic facts live in `src/data/education.ts`; page templates must not hard-code GPA, rank, course, or source semantics. `docs/CONTENT_SOURCES.md` records the private source hierarchy and known conflicts without publishing transcript files.

Only the selected school/program labels, periods, qualified official GPA values, evidence-labelled rank state, selected coursework, and verified focus may render. Do not publish transcripts, per-course grade tables, private academic identifiers, QR/verification codes, birth data, or calculated GPA presented as official. English course labels are editorial translations unless an official English source exists.

## CV documents

Track definitions live in `src/data/cv.ts`; verified PDFs live in `public/cv/`. The current public documents are:

- `liangwei-hu-ic-design.pdf`
- `liangwei-hu-embodied-ai.pdf`

Quantum Computing remains a non-link “Coming soon” state until a verified PDF exists. Never generate a placeholder PDF or substitute a transcript.

To replace a CV, verify the document and public metadata, retain the stable filename, update the expected byte length and SHA-256 digest in `tests/phase5-cv.test.mjs`, and test Preview, Open, Download, and mobile fallback behavior. PDF embedding remains user-triggered so page load does not fetch documents automatically.

## 3D model

The Home hero lazy-loads Three.js only after the scene approaches the viewport and WebGL is available. Until a verified model is supplied, a copyright-safe procedural scene is used; reduced-motion and unsupported clients receive the complete SVG fallback.

The only supported personal-model interface is `public/models/hlw.glb`, served as `/models/hlw.glb`. Read `docs/HLW_MODEL_GUIDE.md` before adding it. The model is optional progressive enhancement: copy, navigation, CTAs, and project content cannot depend on it.

## Reference policy

`sen-3d-resume` was studied only as a local reference for ideas such as lazy 3D initialization and scroll-linked scene state. Do not copy its personal model (`me.glb`), Blender source (`sen.blend`), likeness, name, resume content, visual assets, or repository code into this project. Reference repositories belong outside this Git repository and outside `public/`.

Any future external reference must be license-reviewed. Record attribution when required and prefer an original implementation that matches this site's content and accessibility architecture.

## Local development

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Astro normally serves `http://localhost:4321`. In Codex-managed environments, use `astro dev --background`, then `astro dev status`, `astro dev logs`, and `astro dev stop` as documented in `AGENTS.md`.

## Build and verification

```sh
npm test
npm run build
npm run preview
```

`npm test` builds the static output while checking bilingual routes, content contracts, CV hashes, accessibility landmarks, internal links, privacy boundaries, model/reference exclusions, and Wrangler invariants. `npm run build` writes deployable assets to `dist/`. Before release, use `npm ci`, run the full test and build gates, inspect the generated routes in a browser, and run `git diff --check`.

## Cloudflare deployment

The existing production architecture is intentionally unchanged:

```text
GitHub -> Cloudflare Build -> npm ci -> npm run build -> dist/ -> npx wrangler deploy
```

`astro.config.mjs` must remain static. `wrangler.jsonc` must retain Worker name `personal-website` and `assets.directory` set to `./dist`. Do not add an SSR adapter, create another Worker, or move deployment credentials into repository files.

Pushing `main` triggers the existing GitHub-to-Cloudflare integration. A successful local build does not prove production deployment; check the external Cloudflare build separately when access is available. Tokens and account credentials belong only in the hosting provider's encrypted secret store.

## Truthfulness and security

- Publish only evidence-supported education, work, project, award, result, link, and identity claims.
- Keep `TODO` where evidence is missing.
- Treat everything under `public/` as internet-public and review documents for metadata and personal identifiers.
- Never publish transcripts, CET6 records, PDK/foundry material, GDS, complete netlists, NDA data, internal measurements, `.env` files, tokens, or API keys.
- Use safe new-tab relationships and preserve keyboard, reduced-motion, forced-colors, zoom, and no-JavaScript fallbacks.
- Review every dependency and lockfile change before release.
