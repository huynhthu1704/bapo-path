# Plan: #79 feature switches reach pages that are already open

Requirements: none (bug, follow-up to REQ-037) · Test cases: #79 test in tests/e2e/live-flags.spec.js · Issue: #79
Intent: the bug issue · Design: no screen change (items disappear as they already do on a fresh page load)

## Files
- tests/e2e/live-flags.spec.js — failing test: a learner's open tab shows My Library and My Job Search; the Owner
  switches both off from another tab; the open tab's menu drops them and the open My Library page shows "Coming soon",
  without a reload
- src/data/promptApi.js — `watchSettings(cb)`: follows settings/site as it changes (Firestore live listener on the site;
  the browser's `storage` event in demo mode, which fires when another tab saves)
- src/main.jsx — use `watchSettings` instead of reading the settings once at start-up

## Steps
1. Commit the failing test and this plan.
2. Add `watchSettings` and switch `main.jsx` to it.
3. Run `npm test` and `npm run verify`.

## Risks
- Firestore: one live listener per open tab on one small document (settings/site, read: everyone). Reads are charged
  once at start and once per Owner change, about the same as today.
- If the listener fails (offline), the code defaults stay, as today.

## Proof
- `npx playwright test -g "#79"` fails before the fix (menu still lists My Library) and passes after; `npm run verify`.
