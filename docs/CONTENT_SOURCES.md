# Content source ledger

This internal ledger records the provenance and publication status of facts used by Portfolio V2. It may name local source files for auditability; those paths must never be copied into public-facing data or rendered pages.

## Evidence classifications

- **Official** - official transcript or school-issued material.
- **Verified Resume** - an owner-authored resume statement cross-checked against the current directional resume; not an official third-party record.
- **Verified Project** - a project artifact or note that directly supports the claim.
- **Calculated** - a value derived from cited inputs with the method retained.
- **TODO** - conflicting, incomplete, or unsupported evidence; publish only an explicit verification note.

For coursework, `evidenceSource: Official` means the course exists on the official transcript. Label provenance is separate: Chinese labels are `Official Chinese`, while English labels are `Editorial Translation` and must not be presented as official school-issued English titles.

## Academic facts

| Field | Public value | Source and location | Class | Publication decision |
| --- | --- | --- | --- | --- |
| Undergraduate institution / program | Wuhan University, Physics | `D:\Desktop\CV\本科中文成绩单.pdf`, pages 1-2 header | Official | Publish. |
| Undergraduate study period | 2020.09-2024.06 | `D:\Desktop\CV\具身智能简历\胡良玮_具身智能版简历_MPE_v3.md`, education table; transcript pages 1-2 independently show 2020 cohort and expected graduation in Jun 2024 | Verified Resume | Publish as a period, without converting the expected date into an official graduation assertion. |
| Undergraduate GPA | **3.86 / 4.00** | `D:\Desktop\CV\本科中文成绩单.pdf`, pages 1 and 2 footer, printed 2023-12-12 | Official | Publish with scale and print-date context. The document predates expected graduation, so this is the official GPA at printing and is **not necessarily the final graduation GPA**. |
| Undergraduate GPA conflict | Resume says 3.82 / 4.00; transcript says 3.86 | Resume file above, education table; official transcript pages 1-2 | Official resolves conflict | Use 3.86 / 4.00 and document why 3.82 is rejected. Do not silently merge versions. |
| Undergraduate rank | 4 | Same owner-authored resume, education table | Verified Resume | May be shown only as self-reported/resume-sourced. The official transcript has no rank field; never label it official. |
| Undergraduate selected courses | Mathematical Methods for Physics; Computational Physics; C Programming; Quantum Mechanics; Calculus I/II; Linear Algebra B; Electrodynamics; Digital Logic Circuits and Laboratory; Probability and Mathematical Statistics B; Circuit Analysis | `D:\Desktop\CV\本科中文成绩单.pdf`: page 1 (all except Computational Physics and Quantum Mechanics); page 2 (Computational Physics, Quantum Mechanics) | Official | Publish only these transcript-present labels. English names are editorial translations of the official Chinese labels. No grade list is currently exposed. |
| Graduate institution / program | University of Science and Technology of China, Quantum Science and Technology | `D:\Desktop\CV\研究生中文成绩单-26458462.pdf`, page 1 header | Official | Publish. |
| Graduate study period | 2024.09-2027.06 expected | `D:\Desktop\CV\具身智能简历\胡良玮_具身智能版简历_MPE_v3.md`, education table | Verified Resume | Publish with “expected”. |
| Graduate GPA | **3.55 / 4.30** | `D:\Desktop\CV\研究生中文成绩单-26458462.pdf`, page 1, “全部课程 GPA: 3.55” and GPA conversion table with maximum 4.3 | Official | Publish with scale. |
| Graduate selected courses | Principles and Applications of Programmable Logic Devices; Physical Electronics Logic Design and Simulation Laboratory; Computational Physics; Digital Signal Processing II; Principles of Semiconductor Devices; Quantum Materials and Devices; Quantum Optics | Same graduate transcript, page 1 course table | Official | Publish only transcript-present courses. English names are editorial translations of the official Chinese labels. |
| Graduate research focus | Semiconductor single-photon detectors and readout circuits | Current embodied and IC resume Markdown files, education/profile sections | Verified Resume | Publish as owner-described research focus, not as a university-issued field. |

## Project and experience facts

| Claim | Source and location | Class / measurement type | Publication decision |
| --- | --- | --- | --- |
| SPAD board-level power reduction from approximately 1 W to 0.1 W per pixel/channel | `D:\Desktop\CV\集成电路简历\胡良玮_集成电路简历.md`, SPAD bullet 5 | Verified Resume; **measured board-level result** | May publish with “approximately” and “measured”. Do not compare it as if it were an ASIC simulation result. |
| SPAD IC single-channel static power about 2 mW and quench transient peak about 200 mW | Same IC resume, SPAD bullet 5 | Verified Resume; **pre-layout simulation** | Keep explicitly separate from the measured 1 W to 0.1 W board result. Do not label measured or post-layout. |
| Mobile robot stack | `D:\Desktop\CV\具身智能简历\胡良玮_具身智能版简历_MPE_v3.md`, project lines 99-135 | Verified Resume | The supported platform is **ROS**, not ROS2. Use Python, YOLO, ROS, upper/lower-controller communication, MCU and motor control only to the degree stated. |
| Mobile robot / UAV conflict | Current embodied resume comment line 165 excludes the UAV from the contest; an IC resume version describes a robot/UAV collaborative system | Conflict resolved conservatively | Exclude UAV from the current mobile-robot case study. Do not use ROS2 in diagrams or copy inherited ROS2 wording. |
| Hubei Provincial College Student Electronic Design Contest second prize | Current embodied resume project role and summary | Verified Resume; no certificate supplied to this audit | May be described only as a resume claim. Do not display a certificate, award ID, official issuer verification, or “officially verified” badge. |
| Quantum / Baidu experience | Current embodied and IC resume Markdown, Baidu internship section | Verified Resume; **HFSS simulation only** | Publish as superconducting-qubit-related circuit/microwave structure work using Ansys HFSS 3D electromagnetic simulation, parameter sweeps and field/geometry analysis. Do not claim fabrication, tape-out, lab measurement, qubit operation, coherence results, or experimental validation. |
| LeRobot / ACT | `D:\Desktop\CV\具身智能简历\胡良玮_具身智能版简历_MPE_v3.md`, hidden “VLA/robot learning small project” checklist; no completed LeRobot/ACT evidence in the audited resume | TODO | Portfolio owner requested the topic, but current audited evidence supports only a **Learning Project / In Progress** treatment. LeRobot, ACT, Transformer, imitation learning, MuJoCo, PushT, dataset, checkpoint, inference, evaluation and metrics remain verification notes until project artifacts are supplied. |

## Privacy and publication restrictions

- Never copy either original transcript, CET6 records, student numbers, birth date, QR codes, identity numbers, home address, verification codes, or unnecessary personal identifiers into `public/`, generated site data, screenshots, or commits.
- Never publish PDK/process rules, GDS, full netlists, confidential experiment data, NDA material, tokens, API keys, secrets, private phone numbers, or unreviewed contact data.
- SPAD public figures should be conceptual or deliberately redacted. Do not expose foundry-confidential screenshots, proprietary dimensions, process data, or unreleased layouts.
- CV PDFs may enter `public/cv/` only after owner confirmation and privacy review. A transcript or certificate is not a CV and remains private.
- Local provenance paths belong only in this internal ledger. `src/data/education.ts` contains publication-safe values and classifications, never local file paths.

## Cloudflare Linux lockfile evidence

The exact A/B audit is recorded in `.superpowers/sdd/2026-08-12-personal-portfolio-v2/progress.md` and Git history:

- **A - before fix:** `be2dcc7^` failed under Cloudflare-like Linux with Node **24.18.0** and npm **10.9.2** during `npm ci`, reporting missing `@emnapi/runtime@1.11.3` and `@emnapi/core@1.11.3`.
- **B - fixed:** commit `be2dcc7` (`fix: regenerate npm lockfile for cloudflare linux build`) passed exact-environment `npm ci`, the existing **10/10** tests, and the **7-page** build.
- The install command remains `npm ci`; no `npm install`, `--omit=optional`, disabled lockfile check, Worker rename, or deployment reconfiguration was used.

## Maintenance rule

When evidence changes, update this ledger first, preserve conflicts rather than overwriting history, then update the typed public data and its tests. Unknown facts stay `TODO` until a cited source supports them.
