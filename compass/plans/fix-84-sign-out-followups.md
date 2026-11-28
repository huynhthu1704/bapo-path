# Plan: #84 sign-out follow-ups (data coming back, failed sign-out, feedback on the last save)

Requirements: none (bug, follows #81 / REQ-035 sign-in) · Test cases: #84 tests in tests/e2e/sign-out-live.spec.js · Issue: #84
Intent: the bug issue; the three nits from the independent review of PR #82, which the Owner asked to fix ·
Design: no new screen (one line of text under the Sign out button, in the existing error style)

## Files
- tests/e2e/fake/firebase.js — a fake Google sign-in for tests: the test decides when cloud progress arrives and
  whether saving or signing out fails
- tests/e2e/fake/server.mjs — starts the site (dev server, demo mode) with the fake sign-in used by the store and the
  Profile page only
- tests/e2e/sign-out-live.spec.js — failing tests: sign out while cloud progress loads (data must not come back);
  failed sign-out (message, still signed in); last save before sign-out (loading bar; message when it fails)
- src/store.jsx — `onUser` ignores the result of a sign-in that is no longer current (a counter); `signOut` wraps the
  last save in `track()`, returns whether it failed, and makes any sign-in still loading stale
- src/pages/Profile.jsx — the Sign out button catches a failed sign-out and shows a message; after sign-out, says
  when the last change could not be saved

## Steps
1. Commit the failing tests, the fake sign-in and this plan.
2. Change `src/store.jsx`, then `src/pages/Profile.jsx`.
3. Run `npm test`, `npm run test:first`, `npm run verify`.

## Risks
- Why a fake: demo mode never runs the Google sign-in code (no cloud load, `logOut` cannot fail), so the bugs cannot
  be reproduced there. The fake replaces `src/firebase.js` only for the store and Profile page; the rest of the site
  stays in demo mode. It tests our code's handling of sign-in, not Firebase itself.
- A failed last save does not stop the sign-out: on a shared device, privacy comes first. The person is told the last
  change could not be saved (it is lost, as the account copy is older by that one change).
- A failed sign-out keeps the person signed in and syncing (as before the click).

## Proof
- `npx playwright test -g "#84"` fails before the fix (data comes back; no message; no loading bar) and passes after;
  `npm test`; `npm run verify`.
