# Personal Portfolio V4 Design

## Purpose

V4 turns the existing bilingual V3 portfolio into an HR-ready public site. It removes development-state presentation, narrows Projects to four self-contained overview cards, replaces transcript-oriented UI with directly readable coursework tables, and adds user-provided school-stage durations to About without inventing dates.

The approved source is the user-provided `personal-website_v4.md` specification held outside the repository. This repository document records the implementation decisions needed to apply it safely to the current V3 codebase.

## Public Information Architecture

The production build contains exactly eight pages:

- Chinese: `/`, `/about`, `/projects`, `/cv`
- English: `/en`, `/en/about`, `/en/projects`, `/en/cv`

Project detail routes are removed rather than merely hidden. Project MDX entries remain the locale-aware content source for card metadata, but no MDX body is rendered as a public route.

## Project Overview Model

Home and Projects consume the same four locale-specific collection entries in this order:

1. SPAD IC Design
2. Vision-Guided Mobile Robot
3. Superconducting Quantum Computing
4. Embodied AI Learning

Each card is a non-interactive `<article>` with a conceptual diagram, category, date, status, summary, two or three evidence-bounded highlights, and three to six topic labels. The only project navigation on Home is the section-level link to `/projects`.

Completed technologies and learning topics are different data. `technologies` lists evidence-backed completed tools. `learningTopics` lists explicitly labeled learning subjects for Embodied AI and never implies completed implementation. Mobile Robot remains ROS—not ROS2—and omits Raspberry Pi, LiDAR, and depth-camera claims because current evidence does not verify them. Quantum remains simulation-only. SPAD retains the verified 1×16-channel, SMIC 180 nm BCD, mixed-signal, verification, and pre-tapeout boundaries without publishing confidential design artifacts.

## CV and Academic Data

The CV page order is:

1. Academic Profile
2. Undergraduate Core Coursework
3. Graduate Core Coursework
4. CV Versions

Course grades come only from `src/data/education.ts`. A shared selector chooses the approved core-course IDs; it never copies grades into presentation data. Coursework renders as a semantic two-column table with grades always visible. The undergraduate table contains the eleven approved courses. The graduate table contains the six V4-selected courses and excludes `programmable-logic-devices` from the public core selection without deleting it from the verified internal dataset.

The Transcript section, transcript component, and transcript presentation data are removed. No transcript PDF is generated, copied, linked, previewed, or downloaded. The two owner-authorized CV snapshots retain Preview, Open, and Download. Quantum Computing remains a concise non-link `Preparing` card.

The undergraduate GPA remains `3.86 / 4.00` with the explicit official transcript snapshot date of 2023-12-12 and is not described as a final graduation GPA. Rank 4 remains clearly self-reported from the resume rather than official.

## About and Personal Data

The existing five-school Education Journey stays in profile order. The first three schools gain user-provided stage durations, not inferred calendar dates:

- Primary School · 6 years
- Middle School · 3 years
- High School · 3 years

Wuhan University and USTC retain their verified resume periods. The dual technical tracks, How I Work, SPAD Now, and Side Quests remain, with no new animation or 3D behavior.

## Copy, Safety, and Accessibility

Generated visible text contains no development notes, TODO markers, verification prompts, transcript-publication UI, or single-project CTAs. Normal public states such as `In Progress`, `Learning Project`, and `Preparing` remain.

The site preserves the skip link, keyboard focus, semantic headings, reduced-motion behavior, forced-colors support, route-preserving locale switch, and no-model Home fallback. Tables reflow at 320 px without horizontal page overflow.

Original transcripts, private identifiers, verification QR material, secrets, confidential chip artifacts, and reference-project assets remain outside tracked and public output. The Worker name, static Astro output, `./dist` assets directory, dependency set, and deployment architecture do not change.

## Verification and Release

Implementation uses TDD per task and independent review after each task. The final gate includes:

- Windows `npm ci`, full tests, build, diff check, status, and fsck
- WSL native Node 24 / npm 10.x `npm ci`, tests, and build
- Actual browser QA at 320, 375, 768, 1024, and 1440 px
- Eight-route HTTP, accessibility, console, interaction, public-copy, and security scans
- Fast-forward merge of `feat/portfolio-v4` to `main`
- Non-force push and confirmation of the existing Cloudflare Workers Build and production pages
