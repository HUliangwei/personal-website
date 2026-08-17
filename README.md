# Liangwei Hu Portfolio V4

A bilingual, static personal technical portfolio for Liangwei Hu. V4 is organized for public / HR-facing use: it introduces current SPAD IC work, education and technical journey, four concise project cards, selected coursework, technical interests, and authorized contact channels without exposing private source documents or internal review notes.

## Stack

- Astro 7 with TypeScript and static output
- Tailwind CSS 4 through the Vite plugin
- Astro Content Collections / MDX for bilingual project records
- Three.js as an optional, dynamically imported Home enhancement
- Framework-free progressive enhancement for navigation, PDF preview, and About / Home interactions
- Node's built-in test runner for source, generated-output, privacy, accessibility, and deployment contracts
- Cloudflare Workers Static Assets through Wrangler

There is no SPA framework, SSR adapter, database, analytics SDK, or required client-side 3D model.

## V4 information architecture

V4 published exactly eight public routes; V5 adds one detail page per programming showcase project:

```text
Chinese                     English
/                           /en
/about                      /en/about
/projects                   /en/projects
/cv                         /en/cv
```

The four top-level page roles are:

```text
Home      Personal introduction, current focus, four projects, toolkit, interests, contact
About     Education journey, two technical tracks, working method, current work, side quests
Projects  Four research overview cards plus an expandable programming collection with detail pages
CV        Academic profile, selected coursework, and three CV directions
```

Research project detail routes are intentionally not published: Home and Projects reuse the same localized collection records so titles, status, summaries, highlights, and topic boundaries stay consistent. The V5 programming collection is the exception — each programming showcase markdown file under `src/content/programming/` auto-generates one card in the collection and one detail page (see `docs/编程项目 展示规范.md`).

## Architecture

```text
public/
  cv/                         Two owner-authorized public CV snapshots
  models/hlw.glb              Optional verified personal model; currently optional
  favicon.*
  robots.txt
src/
  components/
    about/                    Education, dual-track journey, workflows, Now, Side Quests
    cv/                       Academic profile, coursework tables, CV cards, PDF preview
    home/                     Hero, lazy 3D scene, focus, projects, toolkit, interests, contact
    layout/                   Navigation and footer
    pages/                    Shared locale-aware page components
    projects/                 Research cards, programming collection, figures, and conceptual diagrams
  config/                     Stable site configuration
  content/projects/           Four Chinese and four English research project records
  content/programming/        Programming showcase markdown driving cards and detail pages
  data/                       Typed profile, education, CV, About, journey, and programming copy
  i18n/                       Dictionaries, locale types, and route helpers
  layouts/                    Shared base metadata shell
  pages/                      Chinese routes plus mirrored `/en` routes, including programming detail pages
  scripts/                    Progressive Home / About interaction modules
  styles/global.css           Design tokens, responsive layout, and accessibility rules
  utils/                      Build-time helpers such as the verified-model gate
docs/
  CONTENT_SOURCES.md          Internal provenance / evidence ledger; never a public asset
  HLW_MODEL_GUIDE.md          Safe `/models/hlw.glb` replacement contract
  编程项目 展示规范.md          Programming showcase authoring contract (cards + detail pages)
tests/                        Regression, integration, privacy, accessibility, and release gates
astro.config.mjs             Static Astro + MDX configuration
wrangler.jsonc               Cloudflare static-assets deployment contract
```

Generated `dist/` and installed `node_modules/` are not source files and must not be edited or committed.

## Internationalization

Chinese is the default locale. English mirrors each public route under `/en`.

Shared locale-aware page components receive a locale, while `src/i18n/zh.ts` and `src/i18n/en.ts` own interface copy. The language switch preserves the current top-level route instead of returning users to the home page.

Every locale page emits:

- its own `<html lang>`
- localized title and description
- canonical URL
- `zh-CN`, `en`, and `x-default` alternates
- localized Open Graph locale and description

When adding a new public route, add both locale versions and extend the integration tests. V5 publishes programming project-detail routes generated from showcase files in `src/content/programming/`.

## Projects

The public collection contains exactly four project identities in both languages:

- **SPAD IC Design** — a 1×16-channel mixed-signal SPAD readout IC in SMIC 180 nm BCD, currently at physical verification / PEX / post-layout simulation and pre-tapeout preparation.
- **Vision-Guided Mobile Robot** — an undergraduate system connecting Python / YOLO vision, ROS task logic, upper/lower-controller communication, MCU control, and motor control.
- **Superconducting Quantum Computing** — HFSS 3D electromagnetic simulation, parameter sweeps, and field / geometry analysis of microwave structures related to superconducting quantum chips; simulation only.
- **Embodied AI Learning** — an in-progress learning project. Linux, ROS2, Gazebo, MuJoCo, LeRobot, and ACT remain **Learning Topics**, not completed tools.

Project cards are non-interactive overview articles. V4 does not publish `View Project`, `Read More`, or detail links for the four research projects. The V5 programming collection is the exception: every programming showcase file produces one card plus a detail page at `/projects/programming/{slug}` (and the `/en` mirror), per `docs/编程项目 展示规范.md`.

## Programming showcase

The `软件 / 编程` section on the Projects page is content-driven. Each programming project lives as a bilingual pair of showcase markdown files in `src/content/programming/` (`{slug}.mdx` for Chinese, `{slug}.en.mdx` for English) with validated frontmatter (`title`, `slug`, `locale`, `status`, `summary`, `technologies`, `date`, `featured`, optional `highlights` / `cover` / `links`). The build:

1. reads every showcase file through the `programming` content collection (`src/content.config.ts`),
2. renders one card in the expandable collection (`src/components/projects/ProgrammingCollection.astro`),
3. renders one detail page per locale (`/projects/programming/{slug}` via `src/pages/projects/programming/[slug].astro`).

Adding or updating a programming project only requires editing the showcase markdown — no `.astro` or `.ts` code changes. The authoring contract, field tables, and a full template live in `docs/编程项目 展示规范.md`.

To update a project:

1. Edit the matching `slug.mdx` and `slug.en.mdx` records in `src/content/projects/`.
2. Preserve the schema and keep Chinese / English records aligned.
3. Keep completed tools separate from learning topics.
4. Distinguish simulation, measured data, pre-layout, post-layout, and pre-tapeout states accurately.
5. Keep conceptual diagrams explicitly labelled as conceptual.
6. Run `npm test` and `npm run build`.

Do not add unsupported fabrication, measurement, training-success, inference-success, award, metric, or tool claims.

## Academic data

Publication-safe academic facts live in `src/data/education.ts`; templates should not hard-code GPA, rank, course, or grade values.

The CV page publishes:

- the undergraduate GPA with the official transcript snapshot context dated `2023-12-12`
- the graduate GPA from the official transcript
- the resume-sourced undergraduate rank as explicitly non-official
- selected undergraduate and graduate coursework in semantic tables

The original transcript PDFs are not public assets. Private academic identifiers, QR / verification data, birth information, and other transcript-only identity fields remain excluded.

English course names are editorial translations of the official Chinese labels; numeric grades preserve the official transcript values.

## CV documents

Track definitions live in `src/data/cv.ts`; owner-authorized public CV snapshots live in `public/cv/`.

The two current public documents are:

- `liangwei-hu-ic-design.pdf`
- `liangwei-hu-embodied-ai.pdf`

Quantum Computing remains a non-link **`Preparing`** state until an owner-authorized public PDF is supplied.

PDF preview is user-triggered. The page also preserves Open / Download actions and mobile fallbacks for the two published CVs.

## Transcript privacy workflow

V4 does not publish transcript cards, transcript URLs, transcript previews, or transcript downloads.

The private undergraduate and graduate transcript files are evidence sources only. Selected publication-safe facts are transcribed into the typed academic data model and covered by tests.

If a transcript is ever considered for publication, it must first be separately sanitized and explicitly approved. Until then, no transcript PDF belongs in `public/` or generated output.

## 3D model

The Home hero uses Three.js only as progressive enhancement. The scene is dynamically imported after capability / viewport checks, and reduced-motion or unsupported clients retain complete non-3D content.

The optional personal-model interface is:

```text
public/models/hlw.glb
```

served as:

```text
/models/hlw.glb
```

When the file is absent, no model request target is emitted. Read `docs/HLW_MODEL_GUIDE.md` before replacing it.

The 3D scene must never be required for navigation, project content, calls to action, or accessibility.

## Reference policy

External reference repositories may be studied for ideas, but personal models, likenesses, private assets, and unlicensed code must not be copied into this repository or `public/`.

Any future external reference should be license-reviewed, with attribution added when required.

## Local development

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Astro normally serves:

```text
http://localhost:4321
```

## Build and verification

Primary release gates:

```sh
npm ci
npm test
npm run build
git diff --check
git status
```

`npm test` uses Node's built-in test runner and runs the repository's `*.test.mjs` contracts serially. The tests cover generated routes, localized copy, project boundaries, academic data, public CV hashes, accessibility landmarks, internal links, privacy / secret exclusions, responsive CSS prerequisites, and the Wrangler deployment contract.

`npm run build` writes deployable static assets to `dist/`.

Automated tests validate static responsive prerequisites, but they do not prove real browser layout. Actual browser viewport QA at 320, 375, 768, 1024, and 1440 CSS pixels is a release gate, together with navigation, language switching, PDF behavior, reduced-motion behavior, and console checks.

## Linux / Cloudflare verification

Because a previous Cloudflare build exposed a cross-platform npm lockfile issue, final release validation should include Linux / WSL with Node 24 and npm 10.x:

```sh
rm -rf node_modules
npm ci
npm test
npm run build
```

Do not replace `npm ci` with `npm install` as a release workaround.

The current lockfile includes the optional WASM dependency records required by the present dependency graph, but only a clean Linux `npm ci` can close the platform-specific release gate.

## Cloudflare deployment

Production remains a static-assets deployment:

```text
GitHub -> Cloudflare Build -> npm ci -> npm run build -> dist/ -> npx wrangler deploy
```

Required invariants:

```text
Astro output     static
Worker name      personal-website
Assets directory ./dist
```

Do not add an SSR adapter, create a second Worker for this site, or commit deployment credentials.

Merge `feat/portfolio-v5` into `main` only after local tests, build, browser QA, privacy checks, and the Linux / Cloudflare dependency gate pass. Pushing `main` then triggers the existing GitHub-to-Cloudflare deployment flow.

## Truthfulness and security

- Keep public wording natural and HR-facing; do not expose TODO, verification, provenance, or developer-note language in generated pages.
- Publish only supported education, project, result, award, and identity claims.
- Keep completed tools separate from learning topics.
- Treat everything under `public/` as internet-public.
- Never publish raw transcripts, CET records, PDK / foundry material, GDS / OASIS, complete netlists, NDA material, `.env` files, tokens, API keys, or private local paths.
- Keep the two authorized CV PDFs stable unless the owner explicitly replaces them.
- Preserve keyboard access, zoom, reduced-motion, forced-colors, no-JavaScript fallbacks, and route-preserving language switching.
- Review dependency and lockfile changes before release.
