# Personal Portfolio V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing static Astro portfolio into a truthful, source-traceable, bilingual, interactive V2 with four evidence-based project case studies, an optional 3D Home enhancement, and verified academic profiles.

**Architecture:** Keep Astro static output and the existing GitHub-to-Cloudflare Workers Static Assets pipeline. Add a typed locale layer shared by layouts/components, locale-specific MDX project entries, centralized verified education data, reusable conceptual SVG figures, and a Home-only dynamically imported Three.js controller with a procedural fallback. Every page remains complete semantic HTML without JavaScript or WebGL.

**Tech Stack:** Astro 7, TypeScript strict mode, Tailwind CSS 4, Astro Content Collections/MDX, Three.js loaded only by the Home hero, Node native tests, GitHub, Wrangler, Cloudflare Workers Static Assets.

## Global Constraints

- Chinese is the default locale at `/`; English lives under `/en` and language switching preserves the current route.
- Never invent schools, degrees, papers, awards, results, metrics, fabrication status, quantum experience, contact data, or project links.
- Unknown content renders an explicit localized verification note; no fabricated placeholder PDF, result, image, or model is created.
- Original transcripts, CET6 records, PDK, GDS, full netlists, process rules, NDA material, and confidential experiment data never enter `public/`.
- Keep `output: 'static'`, Worker name `personal-website`, `assets.directory: './dist'`, and the current GitHub-to-Cloudflare deployment architecture.
- Do not copy `me.glb`, `sen.blend`, Sen Zheng's likeness, reference portfolio content, images, HDR files, or personal links from `sen-3d-resume`.
- Accessibility remains content-first: skip link, keyboard support, focus states, correct headings, localized labels, reduced motion, and a nonvisual 3D fallback.
- Validate responsive behavior at 320, 375, 768, 1024, and 1440 CSS pixels.
- Each production change follows a failing-test-first cycle and receives a task review before the next task.

---

### Task 1: Verified source ledger and academic data model

**Files:**
- Create: `docs/CONTENT_SOURCES.md`
- Create: `src/data/education.ts`
- Create: `tests/v2-data.test.mjs`
- Modify: `README.md`

**Interfaces:**
- Produces `educationByLocale: Record<Locale, EducationRecord[]>`, where each record contains institution, program, period, GPA value/scale/source classification, rank state, coursework, and optional research focus.
- Records the official transcript facts, resume-only facts, conflicts, measurement types, and publication restrictions used by later tasks.

- [ ] Write `tests/v2-data.test.mjs` to assert the official undergraduate `3.86/4.00`, graduate `3.55/4.30`, source classification, no official rank claim, bilingual course labels, and absence of transcript/CET6 files from `public/`.
- [ ] Run `node --test tests/v2-data.test.mjs` and confirm it fails because the education model and source ledger do not exist.
- [ ] Implement the typed data model using only transcript-supported course names and verified-resume study periods/research focus.
- [ ] Write the source ledger with exact file/page provenance, GPA conflicts, project evidence tiers, result measurement types, privacy restrictions, and the confirmed Linux lockfile A/B result.
- [ ] Run the focused test, then `npm test`, `npm run build`, and `git diff --check` sequentially.
- [ ] Commit as `feat: add verified academic data model`.

### Task 2: Bilingual routing, navigation, layout metadata, and SEO

**Files:**
- Create: `src/i18n/types.ts`
- Create: `src/i18n/zh.ts`
- Create: `src/i18n/en.ts`
- Create: `src/i18n/utils.ts`
- Create: `src/pages/en/index.astro`
- Create: `src/pages/en/about.astro`
- Create: `src/pages/en/projects/index.astro`
- Create: `src/pages/en/projects/[slug].astro`
- Create: `src/pages/en/cv.astro`
- Create: `tests/v2-i18n.test.mjs`
- Modify: `src/config/site.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/layout/Navbar.astro`
- Modify: `src/components/layout/Footer.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[slug].astro`
- Modify: `src/pages/cv.astro`

**Interfaces:**
- Produces `Locale = 'zh' | 'en'`, `DEFAULT_LOCALE`, `getDictionary(locale)`, `localizedPath(path, locale)`, `alternatePath(path)`, and locale-aware BaseLayout props.
- All subsequent components receive locale and dictionary data instead of embedding locale conditionals.

- [ ] Write route/output tests for Chinese and English Home/About/Projects/CV, exact route-preserving language mapping, localized navigation, `<html lang>`, canonical, `hreflang` zh-CN/en/x-default, and Open Graph locale.
- [ ] Run the focused test and confirm missing English routes/metadata cause the expected failure.
- [ ] Implement centralized dictionaries and path utilities, then convert layout navigation/footer and route entry points to locale-aware composition.
- [ ] Keep standard full-page Astro navigation; do not introduce ClientRouter because existing page scripts and Home-only 3D do not need SPA state.
- [ ] Run focused/full tests, build, internal-link checks, and `git diff --check`.
- [ ] Commit as `feat: implement bilingual portfolio routing`.

### Task 3: Four-project bilingual content system

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/config/projects.ts`
- Replace: `src/content/projects/spad.mdx`
- Replace: `src/content/projects/lerobot.mdx`
- Replace: `src/content/projects/ros2-robot.mdx`
- Create: `src/content/projects/mobile-robot.en.mdx`
- Create: `src/content/projects/quantum-hfss.mdx`
- Create: `src/content/projects/quantum-hfss.en.mdx`
- Create: `src/content/projects/spad.en.mdx`
- Create: `src/content/projects/lerobot.en.mdx`
- Create: `tests/v2-project-content.test.mjs`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[slug].astro`
- Modify: `src/pages/en/projects/index.astro`
- Modify: `src/pages/en/projects/[slug].astro`
- Modify: `src/layouts/ProjectLayout.astro`
- Modify: `src/components/projects/ProjectHeader.astro`
- Modify: `src/components/projects/ProjectMeta.astro`

**Interfaces:**
- Extends project schema with `locale`, optional `cover`, optional `links`, and stable public `slug`; collection IDs distinguish locale while public routes remain `/projects/<slug>` and `/en/projects/<slug>`.
- Exposes exactly four slugs: `spad`, `lerobot`, `mobile-robot`, and `quantum-hfss` in each locale.

- [ ] Write tests asserting eight project detail outputs, exact four-project lists per locale, optional schema fields, localized status/role metadata, and required case-study headings.
- [ ] Run the focused test and confirm it fails for missing locale entries and the quantum/mobile routes.
- [ ] Implement evidence-based SPAD, mobile robot, and quantum/HFSS content; separate Measured, Pre-layout Simulation, Post-layout status, and planned work.
- [ ] Implement LeRobot/ACT as an owner-specified Learning Project/In Progress page with explicit verification notes and no invented dataset, training, checkpoint, evaluation, or success metrics.
- [ ] Remove the obsolete `ros2-robot` public slug and never call the verified ROS work ROS2.
- [ ] Run focused/full tests, build, link validation, and `git diff --check`.
- [ ] Commit as `feat: enrich four project case studies`.

### Task 4: Project figures, cards, filters, and conceptual diagrams

**Files:**
- Create: `src/components/projects/ProjectFigure.astro`
- Create: `src/components/projects/figures/SpadDiagram.astro`
- Create: `src/components/projects/figures/LeRobotDiagram.astro`
- Create: `src/components/projects/figures/MobileRobotDiagram.astro`
- Create: `src/components/projects/figures/QuantumHfssDiagram.astro`
- Create: `src/components/projects/ProjectVisual.astro`
- Create: `tests/v2-project-figures.test.mjs`
- Modify: `src/components/projects/ProjectCard.astro`
- Modify: `src/components/projects/ProjectFilter.astro`
- Modify: `src/layouts/ProjectLayout.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- `ProjectFigure` accepts `type: 'real' | 'conceptual' | 'simulation' | 'measured'`, locale, caption, alt, and a slot.
- `ProjectVisual` maps a verified project slug to its responsive accessible diagram and localized conceptual label.

- [ ] Write tests for four responsive SVG diagrams, localized “项目概念示意图”/“Conceptual project diagram” captions, non-misleading labels, card metadata, and measured/simulation badge semantics.
- [ ] Run focused tests and confirm they fail because the figure system does not exist.
- [ ] Build reusable accessible diagrams with SVG/CSS only; do not imitate real layout, HFSS output, or measurement imagery.
- [ ] Upgrade cards and filters with visual, status, date, technology, hover, keyboard, localized empty state, and mobile overflow containment.
- [ ] Run focused/full tests, build, and `git diff --check`.
- [ ] Commit as `feat: add conceptual project diagrams`.

### Task 5: Interactive Home-only 3D enhancement

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/home/HomeScene.astro`
- Create: `src/scripts/home-scene.ts`
- Create: `src/utils/model.ts`
- Create: `tests/v2-home-scene.test.mjs`
- Modify: `src/components/home/Hero.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- `HomeScene` renders an aria-hidden canvas host and imports `home-scene.ts` only after intersection and capability checks.
- `getVerifiedModelUrl()` returns `/models/hlw.glb` only when the file exists at build time; otherwise the controller uses procedural geometry without requesting a missing URL.

- [ ] Write tests asserting Three.js is absent from non-Home page output/bundles, no `/models/hlw.glb` request string when the model file is absent, semantic HTML fallback, reduced-motion guards, and accessible canvas treatment.
- [ ] Run focused tests and confirm missing scene interfaces cause failure.
- [ ] Install only `three` plus required types if the package does not provide them; keep package and lockfile synchronized.
- [ ] Implement a transparent low-poly procedural device/signal/compute/robot scene with bounded DPR, IntersectionObserver initialization, scroll focus presets, pointer-fine parallax, context cleanup, and no postprocessing/HDR.
- [ ] Integrate the split hero and localized reveal copy while preserving complete text/buttons when JavaScript or WebGL is unavailable.
- [ ] Run `npm ci`, focused/full tests, build, bundle inspection, and `git diff --check`.
- [ ] Commit as `feat: add interactive 3d portfolio hero`.

### Task 6: Scroll-driven bilingual About journey

**Files:**
- Create: `src/data/journey.ts`
- Create: `src/components/about/JourneyStageVisual.astro`
- Create: `src/scripts/about-journey.ts`
- Create: `tests/v2-about.test.mjs`
- Modify: `src/components/about/AboutHero.astro`
- Modify: `src/components/about/PersonalStatement.astro`
- Modify: `src/components/about/JourneyTimeline.astro`
- Modify: `src/components/about/Education.astro`
- Modify: `src/components/about/ResearchInterests.astro`
- Modify: `src/components/about/InterestsConnection.astro`
- Modify: `src/components/about/TechnicalProfile.astro`
- Modify: `src/components/about/CurrentFocus.astro`
- Modify: `src/components/about/OutsideResearch.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/en/about.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- `journeyByLocale` preserves the verified chronology: physics/hardware and quantum foundation, Baidu HFSS, SPAD/IC, mobile robotics, LeRobot/embodied learning, current focus.
- `about-journey.ts` progressively sets active stages and progress only when motion is allowed; the ordered DOM timeline is the complete fallback.

- [ ] Write bilingual content/heading/chronology tests plus reduced-motion and no-JS structure assertions.
- [ ] Run focused tests and confirm the V1 narrative does not satisfy the bilingual journey contract.
- [ ] Implement the source-backed narrative, sticky desktop timeline, stage visuals, progress path, and mobile linear layout without changing dates for storytelling.
- [ ] Keep unverified personal/outside-research copy explicitly pending verification.
- [ ] Run focused/full tests, build, and `git diff --check`.
- [ ] Commit as `feat: build scroll-driven about journey`.

### Task 7: Academic CV experience

**Files:**
- Create: `src/components/cv/AcademicProfile.astro`
- Create: `src/components/cv/EducationCard.astro`
- Create: `src/data/cv.ts`
- Create: `tests/v2-cv.test.mjs`
- Modify: `src/components/cv/CVCard.astro`
- Modify: `src/components/cv/PDFPreview.astro`
- Modify: `src/pages/cv.astro`
- Modify: `src/pages/en/cv.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Academic cards consume `educationByLocale`; CV tracks consume localized `cvTracksByLocale` while retaining the two verified PDFs and a non-link Quantum placeholder.

- [ ] Write tests for both academic profiles/locales, GPA scale/source labels, rank pending state, selected courses, three CV tracks, two exact PDF assets, no transcript files, and mobile preview fallbacks.
- [ ] Run focused tests and confirm missing academic cards/English CV fail.
- [ ] Implement localized academic cards and CV track UI without adding structured contact data or a fake Quantum PDF.
- [ ] Preserve user-triggered PDF object creation and Open/Download fallbacks.
- [ ] Run focused/full tests, build, and `git diff --check`.
- [ ] Commit as `feat: expand academic cv experience`.

### Task 8: Documentation, comprehensive tests, and portfolio polish

**Files:**
- Create: `docs/HLW_MODEL_GUIDE.md`
- Create: `tests/v2-integration.test.mjs`
- Modify: `README.md`
- Modify: `src/styles/global.css`
- Modify: `public/robots.txt`
- Modify: localized components only where QA exposes a tested defect

**Interfaces:**
- Documents the `/models/hlw.glb` replacement contract, dimensions/orientation/origin/camera/light assumptions, GLB export, texture and polygon guidance, optional focus nodes, and fallback behavior.
- Integration tests enumerate all expected locale routes and publication/security invariants.

- [ ] Write integration tests covering bilingual Home/About/Projects/CV, eight project detail pages, language mapping, internal links, heading/landmark basics, no transcript/CET6/reference assets, no `me.glb`/`sen.blend`/Sen identity, no secrets, and unchanged Wrangler/static configuration.
- [ ] Run focused tests and confirm any uncovered V2 requirement fails before implementation.
- [ ] Update README architecture/i18n/content/academic/CV/model/reference/development/build/Cloudflare guidance and write the complete model guide.
- [ ] Polish typography, spacing, focus/hover, 150–500 ms reveal timing, reduced motion, forced colors, 200–400% zoom, image loading, and overflow behavior.
- [ ] Run `npm ci`, full tests, build, and `git diff --check`.
- [ ] Commit as `style: polish portfolio v2 experience`.

### Task 9: Browser, Linux, security, and release verification

**Files:**
- Modify only files implicated by a newly failing regression test.

**Interfaces:**
- Produces evidence for Windows and exact Cloudflare-like Linux builds, browser layout/console QA, sensitive-file scan, copyright scan, route/link inventory, and deployment configuration preservation.

- [ ] Run sequential Windows `npm ci`, `npm test`, `npm run build`, and `git diff --check` and retain complete output.
- [ ] Export the branch into WSL native storage and run Node 24.18.0/npm 10.9.2 `npm ci`, `npm test`, and `npm run build`.
- [ ] Start the background Astro dev server and inspect all required Chinese/English routes at 320, 375, 768, 1024, and 1440; exercise mobile navigation, language switch, project filters, PDF controls, reduced motion, no-WebGL fallback, and browser console.
- [ ] For any defect, add a focused failing regression test, implement the minimal fix, and rerun the relevant/full gates.
- [ ] Scan `git diff main...HEAD` and tracked files for transcripts, CET6, PDK, GDS, netlists, `.env`, tokens, API keys, secrets, unintended private identifiers, reference assets, oversized files, and deployment changes.
- [ ] Verify `wrangler.jsonc` still names `personal-website`, points assets to `./dist`, and Astro output remains static.
- [ ] Commit verified QA fixes with an explicit subject only when changes exist.

### Task 10: Review, merge, push, and production check

**Files:**
- No planned source changes; any review fix must follow a regression-test-first fix wave.

**Interfaces:**
- Delivers a reviewed `feat/portfolio-v2`, fast-forward merge to `main`, safe non-force push, and Cloudflare check evidence.

- [ ] Generate a whole-branch review package from the merge base to HEAD and request independent spec/code/security review.
- [ ] Dispatch one tested fix wave for Critical/Important findings, then one scoped re-review.
- [ ] Re-run the entire Windows/Linux/browser/security completion Gate after review fixes.
- [ ] Confirm both `main` and feature worktrees are clean, fast-forward `main` to `feat/portfolio-v2`, and run final checks on `main`.
- [ ] Push `origin main` without force and wait for the existing Cloudflare Workers Build check.
- [ ] If the check fails, read the first real build error, reproduce it, add a failing test where possible, fix the root cause without changing install/deployment architecture, and repeat the final Gate.
- [ ] Report the final commits, routes/locales, verified facts and remaining verification notes, build/test/browser/security evidence, branch/main/push state, Cloudflare deployment result, and public URL.
