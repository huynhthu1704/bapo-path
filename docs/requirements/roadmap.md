# Skill Roadmap: requirements and traceability

**Module:** Skill Roadmap (onboarding, roadmap, challenges, ranks) · **Flag:** `pmTrack`

Each REQ has a GitHub issue with the full story and criteria. A test's title starts with its TC id, so
`npx playwright test -g TC-036` runs the tests for REQ-036. How to add or change a requirement: see
`prompt-workbench.md`.

## Traceability matrix

Status: **Covered** = every criterion has an automated test · **Partial** = some criteria tested · **Manual** = checked by hand only.

| REQ | Title | Pri | Sprint | Issue | TC → test | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-036 | Product Manager role and learning path | Should | next | #44 | TC-036a–d → `pm-track.spec.js` | Covered (demo mode; the flag audience from the live settings is not tested) |

## Requirements

- **REQ-036** A third track, **Product Manager (PM)**, next to Business Analyst and Product Owner. While the `pmTrack` flag is on,
  onboarding step 1 shows a Product Manager card, and the Roadmap and Profile show a Product Manager tab. The PM track has four
  levels like BA and PO: 10 full Beginner lessons, short skills at Intermediate, Advanced and Expert, and a 5-scenario challenge at
  the end of every level. PM ranks: Intern → Associate PM → Product Manager → Senior PM → Lead PM. With the flag off, learners see
  only BA and PO; anyone who already chose PM keeps seeing their track. PM lessons are English only for now (no VI / KO / FR yet).
