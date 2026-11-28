# Plan: #77 Taxonomy phase rows line up

Requirements: none (bug) · Test cases: #77 tests in tests/e2e/taxonomy-alignment.spec.js · Issue: #77
Intent: the bug issue · Design: no new design; the boxes simply line up as a column

## Files
- tests/e2e/taxonomy-alignment.spec.js — failing test: on desktop every phase name box (and description box) starts at
  the same x position; at 375 px the page has no horizontal scroll
- tests/e2e/taxonomy-labels.spec.js — a renamed, longer phase label is not cut off (added after review)
- src/styles.css — one rule: the phase label inside `.tax-row` gets a minimum width so the boxes after it line up

## Steps
1. Commit the failing test and this plan.
2. Add the rule; check the widest label ("Every phase") still fits on one line.
3. Screenshot the Taxonomy page at 1440 px and 375 px; run `npm run verify`.

## Risks
- Only `.tax-row .phase-chip` changes; phase labels elsewhere (library, cards) keep their natural width.
- The label shows the name saved on this page, so the Owner can make it longer. Use `min-width` (not a fixed width):
  default names line up, and a longer name widens its own label instead of being cut off (second test file).

## Proof
- `npx playwright test -g "#77"` fails before the fix and passes after; `npm run verify`; screenshots.
