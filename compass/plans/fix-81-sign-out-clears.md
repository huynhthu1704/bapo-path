# Plan: #81 signing out removes the person's learning data from the device

Requirements: none (bug, follows REQ-035 sign-in) · Test cases: #81 test in tests/e2e/sign-out.spec.js · Issue: #81
Intent: the bug issue; scope agreed with the Owner in chat on 2026-11-28 ("Everything": saved terms, XP, streak,
learned terms, results, badges, name and email) · Design: no new screen (the site looks as it does for a new visitor)

## Files
- tests/e2e/sign-out.spec.js — failing test: sign in (demo), save Scrum, sign out; Saved is empty, XP is 0, and the
  browser's stored progress holds no saved terms, also after a reload
- src/store.jsx — `signOut`: first save any change not yet sent to the account, stop syncing, end the session, then
  reset the progress on this device to a fresh visitor's (live site and demo mode)

## Steps
1. Commit the failing test and this plan.
2. Change `signOut` in `src/store.jsx`.
3. Run `npm test`, `npm run verify`.

## Risks
- Cloud copy must never be overwritten by the empty state: syncing stops (`ready` off) before the reset, and the save
  effect only runs for a signed-in user whose progress has loaded. Signing in again loads the cloud copy (a fresh
  device state is not set up, so the cloud copy wins).
- A change made in the last 1.5 s before sign-out (not yet synced) is saved first, so it is not lost.
- With Google-only sign-in on (live), a signed-out visitor browses without setup steps; with it off, they see sign-up.

## Proof
- `npx playwright test -g "#81"` fails before the fix and passes after; `npm run verify`.
