# Plan: #93 the Owner keeps the Admin menu when progress cannot be loaded at sign-in

Requirements: none (bug, follows REQ-035 sign-in) · Test cases: #93 tests in tests/e2e/admin-after-load-error.spec.js ·
Issue: #93 · Intent: the bug issue; the Owner asked for the fix in chat (2026-11-28) · Design: no new screen

## Files
- tests/e2e/fake/firebase.js: the fake sign-in can now make the progress read and the Owner check fail a set number of
  times, and can say the person is the Owner
- tests/e2e/admin-after-load-error.spec.js: failing tests: the Admin menu stays when progress never loads; the site
  tries again and syncs once the server answers
- src/store.jsx: at sign-in, the role (Owner / staff) and the progress are loaded and applied separately; each is
  tried again a few times (after 1 s, 3 s, 8 s) before the site gives up
- src/firebase.js, src/data/promptApi.js: the Owner and staff checks report a network error instead of answering
  "no role", so the store can try again

## Steps
1. Commit the failing tests, the fake changes and this plan.
2. Change `src/firebase.js` and `src/data/promptApi.js`, then `src/store.jsx`.
3. Run `npm test`, `npm run test:first`, `npm run verify`.

## Risks
- Showing the Admin menu is not access: Firestore rules still decide what the Owner can read and write (unchanged).
- If the role check still fails after the retries, the person is treated as having no role, as before.
- Retries stop when the person signs out or another account signs in (the existing sign-in counter).
- Demo mode is unchanged: it never runs this code.

## Proof
- `npx playwright test -g "#93"` fails before the fix (no Admin menu; no retry) and passes after; `npm test`;
  `npm run verify`.
