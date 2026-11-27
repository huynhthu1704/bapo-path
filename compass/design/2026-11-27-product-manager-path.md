# Design: Product Manager role and learning path

Status: Approved (by Christine, 2026-11-27)
Requirements: REQ-036
Design tool: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca (page "03 · Screens"; frames are screenshots from `npm run dev:demo`)

## Approach
No new screens or components. The PM track reuses the existing onboarding cards, roadmap tabs, level cards, skill
cards, challenge page and profile settings. Everything appears only while the `pmTrack` flag is on for the visitor
(Owner and staff by default); learners see today's BA and PO screens. Colour for PM: the existing `accent` tone
(amber), as the Prompt Workbench already uses for the PM role tag. Icon: `Compass`.

## Screens
### SCR-1 · Onboarding step 1 — REQ-036 (TC-036a)
- Purpose: choose a role and a level.
- Elements: a third card "Product Manager" ("Find the right problems, set the product direction and measure what
  works."), below Business Analyst and Product Owner; same card style and check circle; level buttons unchanged.
- States: flag on → 3 cards · flag off → 2 cards (as today) · selected card highlighted (`aria-pressed`).
- Frame: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca?node-id=37-2288

### SCR-2 · Skill Roadmap (list and map) — REQ-036 (TC-036b, TC-036d)
- Purpose: follow the PM path.
- Elements: track tabs Business Analyst · Product Owner · Product Manager (PM selected when it is my track); the 4
  level cards (10 · 10 · 8 · 6 skills); skill cards; the level challenge banner. Subtitle mentions Product Manager
  while the flag is on.
- States: starting level unlocked, other levels locked until the previous challenge is passed (as BA and PO) · flag off
  → no PM tab.
- Frame: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca?node-id=37-2289

### SCR-3 · Skill lesson and level challenge — REQ-036 (TC-036b)
- Purpose: learn a PM skill, then pass the level challenge.
- Elements: unchanged lesson and challenge layouts with PM content; 5 scenarios per level, pass 4 of 5. The hint names
  the learner's role.
- Frame: none (layout unchanged).

### SCR-4 · Profile, search and term pages — REQ-036 (TC-036c, TC-036d)
- Purpose: show rank and progress; find skills.
- Elements: rank uses PM names (Intern → Associate PM → Product Manager → Senior PM → Lead PM); "Roadmap progress" gains
  a Product Manager block; "Learning track" switch gains PM. Search results and a term's "Used in skills" list PM
  skills only while the flag is on.
- Frame: none (layout unchanged).

## Notes
- 375 px: three onboarding cards stack; track tabs fit at 375 px (checked in e2e `@mobile`).
- PM lessons are English only for now.
- Someone who already chose PM keeps seeing their track even if the flag is turned off again.
