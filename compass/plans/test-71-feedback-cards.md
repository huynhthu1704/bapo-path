# Plan: #71 follow-up — tests for the answer explanation cards

Requirements: none (test coverage for bug #71) · Test cases: #71 tests in tests/e2e/feedback-cards.spec.js · Issue: #71
Intent: the review of PR #72 (nit: the answer-feedback cards had no test) · Design: none: no UI change

## Files
- tests/e2e/feedback-cards.spec.js — after answering, the explanation card in the quiz, the level challenge and Story
  Mode is a row: the lightbulb icon sits left of and beside the explanation; no sideways scroll; desktop and 375 px

## Steps
1. Write the tests and run them on desktop and at 375 px.
2. Check they catch the bug: remove the `.card.row` rule locally, see them fail, restore it.
3. Run `npm run verify`.

## Risks
- Tests that pass without proving anything: checked by removing the fix (they fail with "explanation card direction").
- Flaky selectors: the tests answer with the first option and find the card by its icon, not by answer text.

## Proof
- `npx playwright test feedback-cards` — 6 passed; with the fix removed, they fail; `npm run verify`.
