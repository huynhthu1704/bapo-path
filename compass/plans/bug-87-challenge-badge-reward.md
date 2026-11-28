# Plan: bug #87 Only level-1 challenges promise the Beginner Graduate badge

Requirements: none (bug fix) · Test cases: `#87` e2e test · Issue: #87
Intent: none: bug fix · Design: none: removes one line of text on levels 2–4, no new UI

## Files
- tests/e2e/challenge-rewards.spec.js — new test: a level-2 and a level-4 challenge (PM track, demo mode) show the
  Rewards card without "Badge: Beginner Graduate"; a level-1 challenge (BA) still shows it
- src/pages/Roadmap.jsx — `Challenge`: add the badge reward line only when the level is 1

## Steps
1. Commit 1: this plan and the failing test only; run it and watch the level-2/4 checks fail.
2. Commit 2: build the rewards list so the badge line is included only for level 1.
3. Run `npm test`, `npm run test:first` and `npm run verify`.

## Risks
- The level comes from the URL as a string ("1"), so compare as a number; the level-1 check in the test guards this.
- The other reward lines (unlock, XP, certificate) must stay; the test checks the card still shows "+300 XP".

## Proof
- `npx playwright test -g "#87"` fails at commit 1 and passes after the fix.
- `npm run verify` passes.
