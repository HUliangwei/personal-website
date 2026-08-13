# Personal Portfolio V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the existing bilingual V2 portfolio into a personal, evidence-based V3 whose Home introduces Liangwei Hu, About explains his education and two technical tracks, Projects identifies four concrete bodies of work, and CV exposes verified coursework grades without publishing private transcripts.

**Architecture:** Keep Astro static output, shared locale-aware page components, Content Collections/MDX, and the Home-only lazy Three.js enhancement. Add centralized V3 data modules for public profile, toolkit, education journey, coursework grades, and transcript availability; route wrappers remain thin. Unverified public copy is omitted or expressed as a natural state, while exact source notes remain in the redacted tracked ledger.

**Tech Stack:** Astro 7, Tailwind CSS 4, TypeScript, Astro Content Collections + MDX, Three.js, Node native tests, Cloudflare Workers Static Assets.

## Global Constraints

- Work only on `feat/portfolio-v3` in the isolated worktree; do not reinitialize Astro, Git, or Cloudflare.
- Keep Chinese default routes and English `/en` routes; shared page components receive `locale` and never duplicate the UI.
- Preserve `output: 'static'`, Worker `personal-website`, `assets.directory: './dist'`, `npm ci`, and the existing GitHub-to-Cloudflare deployment architecture.
- Evidence priority is official transcript/material, latest directional resume, older resume, then existing website copy.
- Public UI must contain no `TODO`, `Placeholder`, `Need verification`, `Add verified`, local provenance path, student number, birth date, transcript QR/verification data, PDK/GDS/netlist/NDA content, or reference-repository identity/assets.
- Course grades are official transcript values; English course labels remain editorial translations.
- Raw transcripts are not copied into `public/`. Both contain QR/identity data; V3 publishes a natural `Preparing` transcript module until owner-supplied sanitized PDFs exist.
- Contact publication is explicitly authorized only for `3036064607@qq.com` and `+86 187 9229 3249`; do not publish other private identifiers.
- Project evidence boundaries from V2 remain: SPAD measured/pre-layout/post-layout claims stay distinct; mobile robot is ROS rather than ROS2; HFSS is simulation only; embodied AI is a learning map, not a completed research result.
- `/models/hlw.glb` remains optional. No missing URL is emitted, no Sen assets are copied, and Home remains readable without WebGL/JavaScript.
- Every behavior change follows RED-GREEN TDD, focused/full verification, `git diff --check`, independent task review, and a clear commit.

---

### Task 1: Revalidate V3 public facts and academic grade data

**Files:**
- Modify: `docs/CONTENT_SOURCES.md`
- Modify: `src/data/education.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/transcripts.ts`
- Create: `tests/v3-data.test.mjs`

**Interfaces:**
- Extends `CourseworkRecord` with `grade: string` and retains `evidenceSource`/`labelSource`.
- Produces `profileByLocale: Record<Locale, PublicProfile>` for identity, education summary, authorized contact, interests, and school journey.
- Produces `transcriptsByLocale: Record<Locale, TranscriptRecord[]>`, where every V3 record is `available: false`, `pdf: null`, and carries a natural Preparing label.

- [ ] Write failing data tests using literal transcript-derived grades: undergraduate Mathematical Methods for Physics 96, Computational Physics 96, C Programming 95, Quantum Mechanics 95, Calculus I 94 and II 84, Linear Algebra B 94, Electrodynamics 94, Digital Logic 92, Digital Logic Lab 91, Probability and Statistics B 92, Circuit Analysis 90; graduate Programmable Logic 79, Physical Electronics Logic Lab 95, Computational Physics 92, DSP II 83, Semiconductor Devices 80, Quantum Materials and Devices 88, Quantum Optics 88.
- [ ] Assert authorized contact literals, the five user-provided school names, real interests, grade source semantics, transcript `available: false`, no academic PDF files, and no private transcript identifiers or complete local paths in tracked text.
- [ ] Run `node --test tests/v3-data.test.mjs`; expected RED because V3 models and grades do not exist.
- [ ] Implement the minimal typed data and update the ledger with redacted source descriptions, page/section evidence, transcript privacy decision, and V3 facts.
- [ ] Run focused test, `npm test`, `npm run build`, and `git diff --check`.
- [ ] Commit `feat: add verified portfolio v3 data model`.

### Task 2: Restructure Home around personal identity

**Files:**
- Create: `src/components/home/TechnicalToolkit.astro`
- Create: `src/components/home/LifeInterests.astro`
- Create: `src/components/home/Contact.astro`
- Modify: `src/components/pages/HomePage.astro`
- Modify: `src/components/home/Hero.astro`
- Modify: `src/components/home/CurrentFocus.astro`
- Modify: `src/components/home/SelectedProjects.astro`
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/styles/global.css`
- Create: `tests/v3-home.test.mjs`
- Delete after reference removal: `src/components/home/Capabilities.astro`
- Delete after reference removal: `src/components/home/ShortTimeline.astro`
- Delete after reference removal: `src/components/home/ContactCTA.astro`

**Interfaces:**
- Home renders exactly Hero, `01 / Current Focus`, `02 / Selected Projects`, `03 / Technical Toolkit`, `04 / Life & Interests`, and `05 / Contact`.
- `TechnicalToolkit` consumes only verified/public skill groups; uncertain robot-learning tools appear as learning states, not completed experience.
- Existing `HomeScene` remains the only 3D enhancement and consumes updated `data-scene-focus` anchors.

- [ ] Write a failing built-HTML contract: correct identity/graduate/SPAD copy, four qualified focus states, no Home timeline or “Research & Engineering,” exact core project names, toolkit categories, interests/games, authorized contact links, and no public development markers in either locale.
- [ ] Run `node --test tests/v3-home.test.mjs`; expected RED on old Home structure and copy.
- [ ] Implement shared localized Home sections, remove the timeline/capability abstractions, preserve accessible headings and HomeScene fallback, and add responsive styles.
- [ ] Run focused/full tests, build, and diff check.
- [ ] Commit `feat: restructure portfolio v3 home content`.

### Task 3: Rebuild About as education plus dual-track journey

**Files:**
- Create: `src/data/about.ts`
- Create: `src/components/about/EducationJourney.astro`
- Create: `src/components/about/DualTrackJourney.astro`
- Create: `src/components/about/HowIWork.astro`
- Create: `src/components/about/Now.astro`
- Create: `src/components/about/SideQuests.astro`
- Modify: `src/components/pages/AboutPage.astro`
- Modify: `src/scripts/about-journey.ts`
- Modify: `src/scripts/journey-motion.ts`
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/styles/global.css`
- Create: `tests/v3-about.test.mjs`
- Remove references to obsolete V2 abstract About components/copy.

**Interfaces:**
- `aboutByLocale` exposes `schools`, `engineeringTrack`, `physicsQuantumTrack`, `workflows`, `now`, and `sideQuests`.
- The complete no-JS DOM uses semantic lists; motion only marks active stages/progress and is disabled on mobile or reduced motion.

- [ ] Write failing tests for all five schools, two independently labeled tracks, superconducting quantum naming with HFSS as method, evidence-bounded How I Work flows, SPAD-only Now, Side Quests, no abstract V2 phrases, no public TODO, and executable motion lifecycle/reduced-motion behavior.
- [ ] Run focused test and verify the old single timeline fails for the intended reasons.
- [ ] Implement the shared dual-track narrative and progressive enhancement without changing verified chronology.
- [ ] Run focused/full tests, build, and diff check.
- [ ] Commit `feat: rebuild about as a personal technical journey`.

### Task 4: Refine the identities of the four core projects

**Files:**
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: all eight files under `src/content/projects/`
- Modify: `src/components/projects/ProjectCard.astro`
- Modify: `src/components/projects/ProjectMeta.astro`
- Modify: project conceptual diagram labels only where the V3 identity changes.
- Create: `tests/v3-projects.test.mjs`

**Interfaces:**
- Stable slugs remain `spad`, `mobile-robot`, `quantum-hfss`, and `lerobot`.
- Public identities are SPAD IC Design, Mobile Robot, Superconducting Quantum Computing, and Embodied AI Learning.
- Embodied entry/body is a status-based learning map; unsupported ROS2/Gazebo/MuJoCo/LeRobot/ACT/VLA/VLM/VCT stages are not rendered as completed technologies.

- [ ] Write failing route/card/content tests for exact V3 names, four concrete categories, project state semantics, concept captions, and retained SPAD/mobile/HFSS evidence restrictions.
- [ ] Run focused test and verify V2 titles/LeRobot framing fail.
- [ ] Update localized metadata and MDX while preserving evidence-backed case-study facts and accessible concept diagrams.
- [ ] Run focused/full tests, build, and diff check.
- [ ] Commit `feat: refine four core project identities`.

### Task 5: Enhance Academic Profile, coursework grades, and transcript infrastructure

**Files:**
- Create: `src/components/cv/CourseworkList.astro`
- Create: `src/components/cv/TranscriptCard.astro`
- Modify: `src/components/cv/EducationCard.astro`
- Modify: `src/components/cv/AcademicProfile.astro`
- Modify: `src/components/pages/CVPage.astro`
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/styles/global.css`
- Create: `tests/v3-cv.test.mjs`

**Interfaces:**
- `CourseworkList` renders each course as a keyboard-focusable disclosure with visible grade on coarse-pointer/mobile and hover/focus grade reveal on fine-pointer desktop.
- `TranscriptCard` accepts `TranscriptRecord`; V3 records render a non-link Preparing state and never construct `<object>`, Open, or Download controls without an approved PDF.
- Existing two CV PDFs and lazy `PDFPreview` behavior remain unchanged; Quantum CV uses Preparing.

- [ ] Write failing built-HTML and executable interaction/style tests for all verified grades, keyboard/touch accessibility, three CV tracks, two exact CV PDFs, two transcript Preparing cards, and zero transcript PDF/link/object.
- [ ] Run focused test and verify grade/transcript UI is absent.
- [ ] Implement the minimal shared components and responsive/focus/forced-colors/reduced-motion styles.
- [ ] Run focused/full tests, build, and diff check.
- [ ] Commit `feat: enhance academic coursework experience`.

### Task 6: Remove public template/TODO copy and polish bilingual V3

**Files:**
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: localized shared components only where audit exposes user-visible old copy.
- Modify: `src/styles/global.css`
- Modify: `README.md`
- Modify: `docs/HLW_MODEL_GUIDE.md` only if V3 Home anchor behavior changed.
- Create: `tests/v3-integration.test.mjs`

**Interfaces:**
- Integration tests build and enumerate all 16 locale routes, validate internal links/headings/SEO/language mapping, and scan generated text for development markers and template phrases.
- README documents V3 IA, shared i18n, four project identities, academic grades, transcript privacy workflow, optional GLB, and unchanged Cloudflare deployment.

- [ ] Write failing integration tests for the V3 route/content/security contract, public TODO/template phrase scan, contact scope, model/reference boundary, private identifiers, and deployment configuration.
- [ ] Run focused test and observe remaining V2 markers/README gaps.
- [ ] Replace only user-visible stale copy, polish 320/375/768/1024/1440 overflow/focus/touch/forced-color behavior, and update documentation.
- [ ] Run `npm ci`, focused/full tests, build, and diff check.
- [ ] Commit `style: polish portfolio v3 bilingual experience`.

### Task 7: Browser, Linux, security, review, and production release

**Files:**
- Modify only files implicated by a regression test for a verified QA defect.

**Interfaces:**
- Produces fresh Windows and exact Cloudflare-like Linux evidence, browser viewport/interaction evidence, final sensitive/copyright inventory, independent review approval, and production deployment result.

- [ ] Run Windows `npm ci`, `npm test`, `npm run build`, `git diff --check`, `git status`, and `git fsck` sequentially.
- [ ] Export exact HEAD to WSL native storage and run Node 24.18.0/npm 10.9.2 `npm ci`, `npm test`, and `npm run build`.
- [ ] Use the in-app browser against the background Astro server to inspect all 16 routes at 320, 375, 768, 1024, and 1440; exercise mobile nav, language switch, filters, course grade focus/touch, CV PDF controls, transcript Preparing state, no-model/reduced-motion fallback, and console.
- [ ] Scan tracked files, `public/`, `dist/`, and `git diff main...HEAD` for raw transcripts, identifiers, QR/verification material, secrets, chip-confidential files, reference assets, public TODO/template phrases, oversized files, and deployment drift.
- [ ] Request a whole-branch independent spec/code/security review; apply at most one TDD fix wave for Critical/Important findings and perform one scoped re-review.
- [ ] Re-run the entire Windows/Linux/browser/security completion gate after review fixes.
- [ ] Use `superpowers:finishing-a-development-branch`; because the approved V3 specification already authorizes merge and production release after all gates, choose local fast-forward merge to `main`, verify the merged tree, non-force push `origin main`, and wait for the existing Cloudflare Workers Build check.
- [ ] Confirm production HTTP 200 and V3 identity/content markers, or stop safely on a real deployment failure without changing Worker/deployment architecture.

## Self-review

- Coverage: all V3 sections 0-60 map to Tasks 1-7; transcript publication is explicitly resolved as unavailable because both originals visibly contain identity/QR data.
- Scope: no new framework, adapter, SPA, animation library, or unrelated refactor.
- Type consistency: profile, education/course grades, About, transcript, and locale interfaces are introduced before consumers.
- Public truth boundary: unsupported skills are omitted or labeled learning states; no public TODO is used as a substitute for evidence.
- Verification: each feature task has focused RED/GREEN, full tests/build/diff, independent review; final release repeats Windows/Linux/browser/security gates.
