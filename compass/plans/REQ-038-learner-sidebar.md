# Plan: REQ-038 part 2 — the learner sidebar groups

Requirements: REQ-038 · Test cases: TC-038 (a; b–d from part 1) · Issue: #59
Intent: compass/intent/2026-11-27-admin-redesign-and-flags.md · Design: compass/design/2026-11-27-admin-redesign-and-flags.md (SCR-1, SCR-2, Figma F01/F07)

Part 1 (#70) built the one Admin area. This PR restructures the learner sidebar as approved, closes REQ-038 (Done),
and points the docs to the new Admin area. No flag for the sidebar (ADR-009).

## Files
- src/components/ui.jsx — sidebar groups: **Home** (+ **Admin** for staff) · LEARN Skill Roadmap, Glossary, BABOK &
  PMBOK, Domain Knowledge, References · PRACTISE Practice, Speed Round, Story Mode, Prompt Workbench · PROGRESS
  Achievements, Collection, Study Circle · MY STUFF Saved, My Library, My Job Search, Progress & Profile. Each item still
  follows its feature flag; a group with nothing visible is hidden (REQ-037).
- src/pages/AdminShell.jsx — the "Admin section" drop-down gets a placeholder when the current page is not in the
  role's menu (review note 3 of #70).
- tests/e2e/navigation.spec.js — TC-038a (groups and order, hidden empty group, staff Admin under Home, 375 px drawer);
  TC-038c also covers `/pw-admin/preview/:id`, `/pw-admin/review/:id`, old `#/admin` and a kept query string
  (review note 1 of #70).
- tests/e2e/features.spec.js — the menu item is now called "Glossary".
- README.md, docs/WORKFLOW.md, compass/agent-knowledge.md — "Admin" instead of Prompt admin / Knowledge admin; Admin ›
  Features; how the first Owner finds their user ID.
- compass/spec.json — REQ-038 Done, TC-038 automated (`tests/e2e/navigation.spec.js`); views compass/requirements.md,
  compass/tests.md, compass/handover.md.

## Steps
1. TC-038a and the extra TC-038c links first; check TC-038a fails today.
2. Regroup NAV in ui.jsx; placeholder option in AdminShell.
3. Docs and spec; `npm test`, `npm run verify`, Compass checks.

## Risks
- **Learners losing a menu item:** TC-037c lists every item by name and TC-038a checks the full grouped list.
- **Renaming "General Knowledge" to "Glossary" in the menu** (as in the approved design F01): the page keeps its title;
  tests that used the old menu name are updated.
- Not in this PR (12-file limit): review notes 2, 4, 5 of #70 (demo-mode Knowledge base buttons, count reads, bundle
  size) and the Profile tile gap; they become a follow-up.

## Proof
- `npx playwright test -g TC-038` (desktop and 375 px), `npm run verify`, `npm test`, `node compass/check-spec.mjs`.
- Screenshots compared with Figma F01 and F07.
