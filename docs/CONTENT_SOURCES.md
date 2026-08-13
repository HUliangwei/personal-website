# Content source ledger

This tracked internal ledger records the provenance and publication status of facts used by Portfolio V3. It identifies private evidence by document class and page or section, without retaining complete local paths or filename identifiers. The source documents themselves remain outside the repository.

## Evidence classifications

- **Official** - official transcript or school-issued material.
- **Verified Resume** - an owner-authored resume statement cross-checked against the current directional resume; not an official third-party record.
- **Verified Project** - a project artifact or note that directly supports the claim.
- **Calculated** - a value derived from cited inputs with the method retained.
- **User-provided** - a public personal fact supplied directly by the portfolio owner.
- **User-authorized** - contact information whose public release was explicitly approved by the portfolio owner.
- **TODO** - conflicting, incomplete, or unsupported evidence; publish only an explicit verification note.

For coursework, `evidenceSource: Official` means the course exists on the official transcript. Label provenance is separate: Chinese labels are `Official Chinese`, while English labels are `Editorial Translation` and must not be presented as official school-issued English titles.

## Academic facts

| Field | Public value | Source and location | Class | Publication decision |
| --- | --- | --- | --- | --- |
| Undergraduate institution / program | Wuhan University, Physics | Official undergraduate transcript (private local source), pages 1-2 header | Official | Publish. |
| Undergraduate study period | 2020.09-2024.06 | Current embodied-AI resume (private local source), education table; official undergraduate transcript pages 1-2 independently show 2020 cohort and expected graduation in Jun 2024 | Verified Resume | Publish as a period, without converting the expected date into an official graduation assertion. |
| Undergraduate GPA | **3.86 / 4.00** | Official undergraduate transcript (private local source), pages 1 and 2 footer, printed 2023-12-12 | Official | Publish with scale and print-date context. The document predates expected graduation, so this is the official GPA at printing and is **not necessarily the final graduation GPA**. |
| Undergraduate GPA conflict | Resume says 3.82 / 4.00; transcript says 3.86 | Resume file above, education table; official transcript pages 1-2 | Official resolves conflict | Use 3.86 / 4.00 and document why 3.82 is rejected. Do not silently merge versions. |
| Undergraduate rank | 4 | Same owner-authored resume, education table | Verified Resume | May be shown only as self-reported/resume-sourced. The official transcript has no rank field; never label it official. |
| Undergraduate selected coursework and grades | Mathematical Methods for Physics 96; Computational Physics 96; C Programming 95; Quantum Mechanics 95; Calculus I 94 and II 84; Linear Algebra B 94; Electrodynamics 94; Digital Logic 92; Digital Logic Lab 91; Probability and Statistics B 92; Circuit Analysis 90 | Official undergraduate transcript (private source): page 1 course table (all except Computational Physics and Quantum Mechanics); page 2 course table (Computational Physics and Quantum Mechanics) | Official | Publish the audited course-grade pairs. Chinese labels follow the official record; English labels are editorial translations, not school-issued English titles. |
| Graduate institution / program | University of Science and Technology of China, Quantum Science and Technology | Official graduate transcript (private local source), page 1 header | Official | Publish. |
| Graduate study period | 2024.09-2027.06 expected | Current embodied-AI resume (private local source), education table | Verified Resume | Publish with “expected”. |
| Graduate GPA | **3.55 / 4.30** | Official graduate transcript (private local source), page 1, “全部课程 GPA: 3.55” and GPA conversion table with maximum 4.3 | Official | Publish with scale. |
| Graduate selected coursework and grades | Programmable Logic 79; Physical Electronics Logic Lab 95; Computational Physics 92; Digital Signal Processing II 83; Semiconductor Devices 80; Quantum Materials and Devices 88; Quantum Optics 88 | Official graduate transcript (private source), page 1 course table | Official | Publish the audited course-grade pairs. Chinese labels follow the official record; English labels are editorial translations, not school-issued English titles. |
| Graduate research focus | Semiconductor single-photon detectors and readout circuits | Current embodied and IC resume Markdown files, education/profile sections | Verified Resume | Publish as owner-described research focus, not as a university-issued field. |

## Public profile facts

| Field | Public value | Source and location | Class | Publication decision |
| --- | --- | --- | --- | --- |
| Identity | 胡良玮 / Liangwei Hu | Official academic records and current owner-authored resumes, identity headers | Official | Publish localized names. Reject the misspellings 胡良伟 and 胡亮伟. |
| School journey | 宣城市第三小学; 宣城市第十二中学; 宣城中学; 武汉大学; 中国科学技术大学 | Portfolio owner’s V3 content specification | User-provided | Publish all five schools. No dates were supplied for the first three, so none are invented. English school names are conservative editorial translations. |
| Interests | 足球; 篮球; 羽毛球; KTV; 麻将; 游戏 | Portfolio owner’s V3 content specification | User-provided | Publish with conservative English editorial translations. |
| Games | 骑马与砍杀; 维多利亚; 无畏契约 | Portfolio owner’s V3 content specification | User-provided | Publish as personal interests; English display names are Mount & Blade, Victoria, and VALORANT. |
| Email | 3036064607@qq.com | Explicit V3 publication authorization from the portfolio owner | User-authorized | Publish as an email contact. |
| Phone | +86 187 9229 3249 | Explicit V3 publication authorization from the portfolio owner | User-authorized | Publish as a telephone contact. Do not publish any other private contact or identity number. |

## Transcript publication decision

| Record | Private evidence reviewed | Privacy finding | V3 public state |
| --- | --- | --- | --- |
| Undergraduate transcript | Private official record, pages 1-2 | Contains identity and verification data, including a QR code. | `available: false`, `pdf: null`, with the natural localized state 准备中 / Preparing. The original is not copied into the repository or public assets. |
| Graduate transcript | Private official record, page 1 | Contains identity and verification data, including a QR code and birth date. | `available: false`, `pdf: null`, with the natural localized state 准备中 / Preparing. The original is not copied into the repository or public assets. |

Publication can change only after the owner supplies separately sanitized PDFs and approves them for public release. The current private originals are evidence sources, not downloadable website assets.

## Project and experience facts

| Claim | Source and location | Class / measurement type | Publication decision |
| --- | --- | --- | --- |
| SPAD board-level power reduction from approximately 1 W to 0.1 W per pixel/channel | Current IC resume (private local source), SPAD bullet 5 | Verified Resume; **measured board-level result** | May publish with “approximately” and “measured”. Do not compare it as if it were an ASIC simulation result. |
| SPAD IC single-channel static power about 2 mW and quench transient peak about 200 mW | Same IC resume, SPAD bullet 5 | Verified Resume; **pre-layout simulation** | Keep explicitly separate from the measured 1 W to 0.1 W board result. Do not label measured or post-layout. |
| Mobile robot stack | Current embodied-AI resume (private local source), project lines 99-135 | Verified Resume | The supported platform is **ROS**, not ROS2. Use Python, YOLO, ROS, upper/lower-controller communication, MCU and motor control only to the degree stated. |
| Mobile robot / UAV conflict | Current embodied resume comment line 165 excludes the UAV from the contest; an IC resume version describes a robot/UAV collaborative system | Conflict resolved conservatively | Exclude UAV from the current mobile-robot case study. Do not use ROS2 in diagrams or copy inherited ROS2 wording. |
| Hubei Provincial College Student Electronic Design Contest second prize | Current embodied resume project role and summary | Verified Resume; no certificate supplied to this audit | May be described only as a resume claim. Do not display a certificate, award ID, official issuer verification, or “officially verified” badge. |
| Quantum / Baidu experience | Current embodied and IC resume Markdown, Baidu internship section | Verified Resume; **HFSS simulation only** | Publish as superconducting-qubit-related circuit/microwave structure work using Ansys HFSS 3D electromagnetic simulation, parameter sweeps and field/geometry analysis. Do not claim fabrication, tape-out, lab measurement, qubit operation, coherence results, or experimental validation. |
| LeRobot / ACT | Current embodied-AI resume (private local source), hidden “VLA/robot learning small project” checklist; no completed LeRobot/ACT evidence in the audited resume | TODO | Portfolio owner requested the topic, but current audited evidence supports only a **Learning Project / In Progress** treatment. LeRobot, ACT, Transformer, imitation learning, MuJoCo, PushT, dataset, checkpoint, inference, evaluation and metrics remain verification notes until project artifacts are supplied. |

## Privacy and publication restrictions

- Never copy either original transcript, CET6 records, academic record identifiers, birth date, QR codes, identity numbers, home address, verification codes, or unnecessary personal identifiers into `public/`, generated site data, screenshots, or commits.
- Never publish PDK/process rules, GDS, full netlists, confidential experiment data, NDA material, tokens, API keys, secrets, private phone numbers, or unreviewed contact data.
- SPAD public figures should be conceptual or deliberately redacted. Do not expose foundry-confidential screenshots, proprietary dimensions, process data, or unreleased layouts.
- CV PDFs may enter `public/cv/` only after owner confirmation and privacy review. A transcript or certificate is not a CV and remains private.
- Complete local provenance paths and identifying source filenames do not belong in tracked files. `src/data/education.ts` contains publication-safe values and classifications only.

## Cloudflare Linux lockfile evidence

The exact A/B audit is recorded in `.superpowers/sdd/2026-08-12-personal-portfolio-v2/progress.md` and Git history:

- **A - before fix:** `be2dcc7^` failed under Cloudflare-like Linux with Node **24.18.0** and npm **10.9.2** during `npm ci`, reporting missing `@emnapi/runtime@1.11.3` and `@emnapi/core@1.11.3`.
- **B - fixed:** commit `be2dcc7` (`fix: regenerate npm lockfile for cloudflare linux build`) passed exact-environment `npm ci`, the existing **10/10** tests, and the **7-page** build.
- The install command remains `npm ci`; no `npm install`, `--omit=optional`, disabled lockfile check, Worker rename, or deployment reconfiguration was used.

## Maintenance rule

When evidence changes, update this ledger first, preserve conflicts rather than overwriting history, then update the typed public data and its tests. Unknown facts stay `TODO` until a cited source supports them.
