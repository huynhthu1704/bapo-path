# Plan: #65 onboarding level and domain cards expose their selected state

Requirements: none (bug) · Test cases: #65 tests in tests/e2e/pressed-state.spec.js · Issue: #65
Intent: the bug issue · Design: none: no visual change (accessibility state only)

## Files
- tests/e2e/pressed-state.spec.js — failing test: level and domain cards carry aria-pressed that follows the selection
- src/pages/Entry.jsx — add aria-pressed to the level buttons (step 1) and the domain buttons (step 2)

## Steps
1. Commit the failing test and this plan.
2. Add aria-pressed={selected} to both button groups, as the role and Daily goal cards already have.
3. Run `npm run verify`.

## Risks
- Button names do not change, so existing tests that find these buttons by name keep working.
- No visual change: the selected style already exists.

## Proof
- `npx playwright test -g "#65"` fails before the fix (no aria-pressed) and passes after; `npm run verify`.
