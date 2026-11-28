# Plan: #77 Taxonomy phase rows line up

Requirements: none (bug) · Test cases: #77 tests in tests/e2e/taxonomy-alignment.spec.js · Issue: #77
Intent: the bug issue · Design: no new design; the boxes simply line up as a column

## Files
- tests/e2e/taxonomy-alignment.spec.js — failing test: on desktop every phase name box (and description box) starts at
  the same x position; at 375 px the page has no horizontal scroll
- src/styles.css — one rule: the phase label inside `.tax-row` gets a fixed width so the boxes after it line up

## Steps
1. Commit the failing test and this plan.
2. Add the rule; check the widest label ("Every phase") still fits on one line.
3. Screenshot the Taxonomy page at 1440 px and 375 px; run `npm run verify`.

## Risks
- Only `.tax-row .phase-chip` changes; phase labels elsewhere (library, cards) keep their natural width.
- A renamed phase does not change the label (the label shows the design-system name), so the width stays enough.

## Proof
- `npx playwright test -g "#77"` fails before the fix and passes after; `npm run verify`; screenshots.
