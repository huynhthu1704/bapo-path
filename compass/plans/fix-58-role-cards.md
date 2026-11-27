# Plan: #58 onboarding role cards as compact rows

Requirements: none (bug) · Test cases: #58 tests in tests/e2e/role-cards.spec.js · Issue: #58
Intent: the bug issue · Design: Figma S03 · Onboarding — Role & Level (node 5-477), approved by the Owner on 2026-11-27

## Files
- tests/e2e/role-cards.spec.js — failing test: icon left of the title, radio right, card at most 110 px tall; rows at 375 px
- src/pages/Entry.jsx — the role cards lay out as a row

## Steps
1. Commit the failing test and this plan.
2. Give the role-card buttons in Onboarding1 a row layout (only this screen, as approved).
3. Run `npm run verify` and check the screen at 1440 px and 375 px.

## Risks
- Other pages also use `card row` and render as columns today; changing the shared `.card` rule would restyle about 20
  places that have no approved design. Kept out of scope: a separate follow-up.
- Long descriptions at 375 px: the text column must shrink and wrap; the test checks no sideways scroll.

## Proof
- `npx playwright test -g "#58"` fails before the fix (icon above the title) and passes after, on desktop and at 375 px;
  `npm run verify`; screenshot compared with the Figma frame.
