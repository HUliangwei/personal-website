# Personal Portfolio V4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the deployed bilingual V3 portfolio into an eight-route, HR-ready V4 with four self-contained project cards, always-visible coursework tables, no transcript module, and verified education-stage durations.

**Architecture:** Keep Astro Content Collections as the single locale-aware project data source, but remove every project-detail route and per-project CTA. Keep academic evidence in `education.ts`, add a pure core-course selector, and render semantic tables directly inside the academic profile. Extend the centralized profile model with user-provided school-stage durations and preserve all existing static, accessibility, motion, privacy, and Cloudflare boundaries.

**Tech Stack:** Astro 7 static output, Astro Content Collections and MDX, Tailwind CSS 4 through Vite, TypeScript, minimal client JavaScript, Three.js Home enhancement, Cloudflare Workers Static Assets.

## Global Constraints

- Public pages contain no TODO, placeholder, verification prompt, developer note, or future-content explanation.
- Normal public states `In Progress`, `Learning Project`, `Preparing`, and localized equivalents are allowed.
- Production exposes exactly `/`, `/about`, `/projects`, `/cv`, `/en`, `/en/about`, `/en/projects`, and `/en/cv`.
- No project card links to a detail route; no detail CTA text is rendered.
- No transcript PDF, preview, download, link, or transcript-status module is public or tracked.
- The two owner-authorized CV PDFs remain byte-for-byte unchanged with Preview, Open, and Download controls.
- Quantum Computing CV remains a non-link `Preparing` state; no PDF is generated.
- No `hlw.glb` is added; the current procedural/no-model fallback remains complete and error-free.
- Mobile Robot public completed evidence remains ROS, Python, YOLO, MCU, controller communication, and motor control; ROS2 and other robot-learning tools may appear only as explicitly labeled learning topics.
- Superconducting Quantum Computing remains simulation-only; SPAD remains pre-tapeout/post-layout and does not claim silicon results.
- Course labels and grades come only from `src/data/education.ts`; original transcripts remain private local evidence.
- The undergraduate GPA is an official 2023-12-12 snapshot, not a final-graduation claim; rank 4 remains self-reported.
- Preserve skip link, keyboard focus, semantic headings, forced colors, reduced motion, no-JS readability, and route-preserving locale switching.
- Do not add dependencies, adapters, SSR, SPA architecture, Worker changes, or deployment changes.
- `wrangler.jsonc` must retain `personal-website` and `./dist`; Astro output remains static.
- Each task uses focused RED/GREEN tests, full regression, build, diff check, a clear commit, and an independent Critical/Important review.

---

### Task 1: Replace project details with four complete overview cards

**Files:**
- Modify: `src/content.config.ts`
- Modify: all eight entries under `src/content/projects/`
- Modify: `src/components/projects/ProjectCard.astro`
- Modify: `src/components/pages/ProjectsPage.astro`
- Modify: `src/components/home/SelectedProjects.astro`
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/styles/global.css`
- Delete: `src/pages/projects/[slug].astro`
- Delete: `src/pages/en/projects/[slug].astro`
- Delete: `src/layouts/ProjectLayout.astro`
- Delete: `src/components/projects/ProjectHeader.astro`
- Delete: `src/components/projects/ProjectMeta.astro`
- Delete: `src/components/projects/ProjectFilter.astro`
- Test: `tests/v4-projects.test.mjs`
- Modify: legacy project/integration tests whose route or CTA assertions are superseded by V4

**Interfaces:**
- `projects` schema adds `highlights: string[]` and `learningTopics: string[]`.
- `ProjectCard` consumes only `project.data`, localized shared labels, and the existing conceptual `ProjectVisual`; it does not accept a duplicate Home display record.
- `technologies` means evidence-backed completed tools. `learningTopics` means explicitly labeled study subjects and is non-empty only when the card needs a learning-state list.
- The public route set drops all eight project-detail routes while the eight MDX files remain collection data.

- [ ] **Step 1: Write the failing V4 project contract**

Create `tests/v4-projects.test.mjs` that runs a real Astro build and asserts:

```js
assert.deepEqual(routeSet, [
  '/', '/about', '/cv', '/en', '/en/about', '/en/cv', '/en/projects', '/projects',
]);
assert.equal(projectCards('/projects').length, 4);
assert.equal(projectCards('/en/projects').length, 4);
assert.equal(projectDetailLinks(allPublicHtml).length, 0);
assert.equal(singleProjectCtas(allPublicText).length, 0);
```

Also assert each card has exact title, status, date, summary, conceptual caption, two or three highlights, and three to six visible topic labels. Assert Home and Projects use the same card metadata. Assert Mobile excludes ROS2/Raspberry Pi/LiDAR/depth-camera completed claims, Quantum is simulation-only, SPAD is pre-tapeout, and Embodied separates completed technologies from learning topics.

- [ ] **Step 2: Run the focused test and confirm the expected RED**

Run:

```powershell
node --test tests/v4-projects.test.mjs
```

Expected: FAIL because V3 still builds sixteen routes, renders View Project links, lacks highlights/learning-topic fields, and exposes filters/detail pages.

- [ ] **Step 3: Extend the collection schema without duplicating facts**

Add these required fields:

```ts
highlights: z.array(z.string()).min(2).max(3),
learningTopics: z.array(z.string()).max(6),
```

Populate all eight frontmatters with locale-specific HR-ready summaries and evidence-bounded highlights. Keep the stable slugs and collection IDs.

- [ ] **Step 4: Make ProjectCard a self-contained non-link article**

Remove `localizedPath`, `projectHref`, `display`, and the anchor. Render:

```astro
<ul class="project-highlights" aria-label={content.highlights}>
  {project.data.highlights.map((highlight) => <li>{highlight}</li>)}
</ul>
```

Render `technologies` under the completed-tools label and `learningTopics` under a localized learning-topics label. Do not style the card as a clickable element.

- [ ] **Step 5: Remove route, filter, and detail-only code**

Delete both `[slug].astro` routes and their unused layout/header/meta components. Remove ProjectFilter from ProjectsPage so the page is a direct four-card overview. Preserve ProjectFigure and ProjectVisual because card diagrams still use them.

- [ ] **Step 6: Update obsolete regression tests without dropping evidence gates**

Change route-count and detail-page assertions to the eight-route V4 contract. Move SPAD/Mobile/Quantum/Embodied evidence checks from generated detail HTML to the locale-specific MDX frontmatter/source and generated card HTML. Retain SVG accessibility, card metadata, and privacy checks.

- [ ] **Step 7: Verify and commit**

Run focused tests, `npm test`, `npm run build`, and `git diff --check`. Confirm eight routes, no per-project CTA, no broken internal link, and a clean worktree after:

```powershell
git commit -m "refactor: simplify portfolio projects for v4"
```

---

### Task 2: Replace transcript UI and hover coursework with core-course tables

**Files:**
- Create: `src/components/cv/CourseworkTable.astro`
- Modify: `src/components/cv/EducationCard.astro`
- Modify: `src/components/cv/AcademicProfile.astro`
- Modify: `src/components/pages/CVPage.astro`
- Modify: `src/data/cv.ts`
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/styles/global.css`
- Delete: `src/components/cv/CourseworkList.astro`
- Delete: `src/components/cv/TranscriptCard.astro`
- Delete: `src/data/transcripts.ts`
- Test: `tests/v4-cv.test.mjs`
- Modify: legacy CV/integration tests superseded by the V4 transcript and table contract

**Interfaces:**
- `CORE_COURSE_IDS` is a readonly map keyed by `EducationRecord['id']`.
- `selectCoreCoursework(record: EducationRecord): CourseworkRecord[]` filters the record's official `coursework` without copying labels or grades.
- `CourseworkTable` receives `educationId`, `coursework`, `courseLabel`, and `gradeLabel` and renders an always-readable semantic `<table>`.
- CVPage contains AcademicProfile and CV Versions only; it imports no transcript data.

- [ ] **Step 1: Write the failing V4 CV contract**

Create a built-output test that asserts two locale-specific tables, exact course IDs/labels/grades, no focus-only grade behavior, no transcript heading/card/link/object, two unchanged authorized PDFs, and Quantum `Preparing` without a PDF.

Use exact selectors:

```js
assert.equal(table('/cv', 'undergraduate').rows.length, 11);
assert.equal(table('/cv', 'graduate').rows.length, 6);
assert.equal(html('/cv').includes('data-transcripts'), false);
assert.equal(transcriptControls(allHtml).length, 0);
```

- [ ] **Step 2: Run the focused test and confirm the expected RED**

Run `node --test tests/v4-cv.test.mjs`.

Expected: FAIL because V3 uses focus-reveal pills, includes seven graduate courses, and renders two transcript Preparing cards.

- [ ] **Step 3: Add the pure core-course selector**

Define the selected IDs in `cv.ts`:

```ts
export const CORE_COURSE_IDS = {
  undergraduate: [
    'mathematical-methods-for-physics', 'computational-physics', 'c-programming',
    'quantum-mechanics', 'calculus', 'linear-algebra', 'electrodynamics',
    'digital-logic-circuits', 'digital-logic-lab', 'probability-and-statistics',
    'circuit-analysis',
  ],
  graduate: [
    'physical-electronics-logic-lab', 'computational-physics',
    'quantum-materials-and-devices', 'quantum-optics',
    'digital-signal-processing-ii', 'semiconductor-device-physics',
  ],
} as const;
```

The selector throws during build/test if a selected ID is absent or duplicated, preventing silent course drift.

- [ ] **Step 4: Implement the semantic table**

Render a caption or visible heading association, `<thead>` with Course/Grade, and `<tbody>` rows with `data-course-id`. Keep `94 / 84` unchanged for Calculus and display other numeric grades without inventing a scale inside each cell.

- [ ] **Step 5: Remove transcript presentation code**

Delete TranscriptCard and transcript data, remove the CVPage section/imports, remove localized transcript copy, and delete transcript CSS. Do not touch the two CV PDFs or PDFPreview behavior.

- [ ] **Step 6: Update and verify regression coverage**

Retain GPA snapshot, rank-source, PDF hash, lazy preview, Quantum, privacy, headings, zoom, forced-colors, and mobile-reflow gates. Replace obsolete transcript-card expectations with an explicit absence contract.

Run focused/full tests, build, diff check, and public PDF inventory, then commit:

```powershell
git commit -m "feat: replace transcript modules with coursework tables"
```

---

### Task 3: Add verified school-stage durations and refine HR-facing copy

**Files:**
- Modify: `src/data/profile.ts`
- Modify: `src/data/about.ts`
- Modify: `src/components/about/EducationJourney.astro`
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/styles/global.css`
- Modify: `docs/CONTENT_SOURCES.md`
- Test: `tests/v4-about-home.test.mjs`

**Interfaces:**
- `SchoolJourneyRecord` gains `duration?: string` and `durationSource?: 'User-provided'`.
- Only the first three records have `duration`; only undergraduate/graduate records have dated `period` values.
- EducationJourney renders duration as text, never as `<time>`, and retains `<time>` for dated higher-education periods.

- [ ] **Step 1: Write the failing duration and copy contract**

Assert both locales render the five schools in order and exact duration text:

```js
assert.deepEqual(earlyDurations('/about'), ['小学阶段 · 6 年', '初中阶段 · 3 年', '高中阶段 · 3 年']);
assert.deepEqual(earlyDurations('/en/about'), ['Primary School · 6 years', 'Middle School · 3 years', 'High School · 3 years']);
```

Assert no year/date is attached to the first three schools, Home retains the approved six-section structure, contact values are exact, and toolkit learning subjects are visibly labeled as learning rather than completed skills.

- [ ] **Step 2: Run the focused test and confirm RED**

Run `node --test tests/v4-about-home.test.mjs`.

Expected: FAIL because the three stage durations are absent and copy still explains missing dates instead of showing the supplied durations.

- [ ] **Step 3: Centralize duration facts**

Add durations to both locale records in `profile.ts`. Update `CONTENT_SOURCES.md` to classify only the durations as user-provided and leave calendar dates absent.

- [ ] **Step 4: Render durations and simplify public copy**

Render `<p class="journey-duration" data-duration-source="user-provided">` before each early-school heading. Rewrite the Education Journey intro/notes as natural HR-facing narrative without source reminders or verification language.

Keep Home's four current-focus states, six toolkit groups, interests, games, and two authorized contact links. If robot-learning topics are named, label the group and note as learning; do not merge them into completed Robotics & Embedded skills.

- [ ] **Step 5: Verify and commit**

Run focused/full tests, build, public-copy scan, and diff check. Commit:

```powershell
git commit -m "feat: refine education journey durations"
```

---

### Task 4: Complete the V4 public-content, responsive, and documentation contract

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro` only if the audit finds stale public metadata
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `README.md`
- Modify: `docs/CONTENT_SOURCES.md`
- Create: `tests/v4-integration.test.mjs`
- Modify: legacy integration tests whose expected route count or public sections changed in V4

**Interfaces:**
- Integration tests build exactly eight routes and verify every internal link resolves within that set.
- The public-copy scanner uses visible text and reports zero V4 forbidden markers and zero single-project CTA phrases.
- The security classifier continues to inspect every tracked/public/dist filename before attempting text decoding.

- [ ] **Step 1: Write the failing V4 integration test**

Cover:

```js
assert.deepEqual(actualRoutes, expectedEightRoutes);
assert.equal(forbiddenPublicMarkers(visibleText).length, 0);
assert.equal(singleProjectCtas(visibleText).length, 0);
assert.equal(publicTranscriptPdfs.length, 0);
assert.equal(publicCvPdfs.length, 2);
```

Also assert bilingual structure, canonical/hreflang/lang/OG, route-preserving top-page switches, one H1/main, four project cards, two course tables, Quantum Preparing, 6/3/3 durations, exact contacts, optional-model boundary, and unchanged deployment config.

- [ ] **Step 2: Run focused integration and observe RED**

Expected failures should identify remaining V3 route assumptions, stale README architecture, obsolete transcript styles/copy, or detail CTA strings.

- [ ] **Step 3: Remove only audited stale code and copy**

Delete unused detail/filter/transcript styles and public dictionary keys. Do not remove internal evidence notes from `CONTENT_SOURCES.md`; keep them unlinked and non-public. Keep public descriptions concise and natural.

- [ ] **Step 4: Polish V4 cards and tables**

Ensure cards have balanced height without click affordance, highlights remain scannable, conceptual diagrams have captions, and two-column coursework tables reflow without page overflow at 320/375/768/1024/1440. Preserve focus, reduced-motion, forced-colors, and 200–400% zoom behavior.

- [ ] **Step 5: Update README**

Document the eight-route V4 IA, collection-backed overview cards, absence of project-detail routes, core-course selection, transcript privacy, two CV snapshots, Quantum Preparing, optional model fallback, testing, and unchanged GitHub-to-Cloudflare pipeline.

- [ ] **Step 6: Run the complete pre-release gate and commit**

Run `npm ci`, focused tests, `npm test`, `npm run build`, `git diff --check`, security scans, and status. Commit:

```powershell
git commit -m "test: cover portfolio v4 public content"
```

---

### Task 5: Browser, Linux, security, review, and production release

**Files:**
- Modify only files implicated by a reproducible final QA defect.

**Interfaces:**
- Final evidence is tied to one exact feature-branch HEAD and repeated on the merged `main` tree.
- No release action changes Worker configuration or uses force push.

- [ ] **Step 1: Run fresh Windows verification**

Sequentially run Node/npm versions, `npm ci`, `npm test`, `npm run build`, `git diff --check main...HEAD`, `git status`, and `git fsck --full`.

- [ ] **Step 2: Run exact Linux verification**

Export/fetch the exact HEAD into WSL native `/tmp`, use Node 24.18.0 and npm 10.9.2, and run `npm ci`, the full test suite, and build. Verify HEAD/tree/index identity and clean temporary artifacts.

- [ ] **Step 3: Run actual browser QA**

Use the in-app browser against the background Astro server. Inspect all eight routes at 320, 375, 768, 1024, and 1440 px. Verify page and heading overflow, visual layout, console, mobile nav/Escape focus return, locale switching, four non-link project cards, course tables, CV lazy preview/Open/Download, Quantum Preparing, About durations/motion fallback, Home 3D/no-model fallback, and exact contacts.

- [ ] **Step 4: Run final publication/security review**

Scan tracked files, public, dist, and `git diff main...HEAD` for private transcripts, identifiers, QR material, secrets, chip-confidential artifacts, reference assets, oversized files, public development markers, detail CTAs, transcript UI, and deployment drift. Request an independent whole-branch review and fix only reproducible Critical/Important findings with TDD.

- [ ] **Step 5: Repeat gates after any fix**

Re-run Windows, Linux, browser, and security verification at the new exact HEAD. Do not claim completion from earlier results.

- [ ] **Step 6: Merge and release**

Use `superpowers:finishing-a-development-branch`. The user has explicitly pre-authorized unattended publication after all gates, so fast-forward `feat/portfolio-v4` into `main`, verify the merged tree, push `origin main` without force, wait for the existing Workers Build check, and confirm all eight production URLs return HTTP 200 with V4 markers.

## Plan Self-Review

- V4 sections 0–54 map to Tasks 1–5.
- No task publishes transcripts, adds a Quantum PDF, or requires `hlw.glb`.
- Project evidence and learning topics use separate interfaces.
- Core-course selectors reference IDs that already exist in the verified education dataset.
- The route contract consistently uses eight pages after detail-route deletion.
- No new dependency, runtime framework, adapter, or deployment change is planned.
- No implementation step contains an unresolved placeholder.
