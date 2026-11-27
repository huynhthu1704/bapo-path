# Plan: #63 onboarding "Daily goal" cards as compact rows

Requirements: none (bug) · Test cases: #63 tests in tests/e2e/goal-cards.spec.js · Issue: #63
Intent: the bug issue · Design: Figma S04 · Onboarding — Domains & Goal (node 5-544), the original design

## Files
- tests/e2e/goal-cards.spec.js — failing test: the icon sits left of and beside the text, on desktop and at 375 px
- src/pages/Entry.jsx — the Daily goal cards lay out as a row; selected state exposed with aria-pressed

## Steps
1. Commit the failing test and this plan.
2. Give the Daily goal buttons in Onboarding2 a row layout (same approach as #58) and add aria-pressed.
3. Run `npm run verify` and compare with the Figma frame.

## Risks
- Other `card row` uses on the site keep their current look: no approved design for them yet (follow-up).
- Narrow screens: the three cards stack to one column below 900 px, so each row has room for its text.

## Proof
- `npx playwright test -g "#63"` fails before the fix (icon above the text) and passes after, on desktop and at 375 px;
  `npm run verify`.
