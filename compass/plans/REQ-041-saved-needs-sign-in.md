# Plan: REQ-041 Saved terms need sign-in

Requirements: REQ-041 · Test cases: TC-041 (a, b, c) · Issue: #89
Intent: compass/intent/2026-11-28-save-terms-needs-sign-in.md · Design: compass/design/2026-11-28-save-terms-needs-sign-in.md (SCR-1, Figma S18b)

With the existing **Google-only sign-in** flag (`googleOnly`) on and the visitor not signed in, the Saved page shows a
sign-in card instead of the list. Bookmark buttons already open the "Sign in to save" pop-up (REQ-035), so they stay as
they are. Nothing changes with the flag off or when signed in.

## Files
- src/pages/Knowledge.jsx — `Saved`: when `googleOnly && !signedIn`, show the page header with the sign-in subtitle and
  a card (`Lock` icon, "Sign in to see your saved terms", one sentence, `GoogleButton` "Continue with Google"); no list,
  chips or "Practise saved terms" button.
- tests/e2e/sign-in.spec.js — TC-041a (card, no list, 375 px), TC-041b (sign in from Saved, stay on Saved, see terms),
  TC-041c (flag off → page as today).
- tests/e2e/sign-out.spec.js — #81 expected "No saved terms yet" on Saved after signing out with Google-only sign-in
  on; it now expects the sign-in card (REQ-041). It still checks that the saved terms are wiped from the device.
- compass/spec.json — REQ-041, TC-041; views compass/requirements.md, compass/tests.md, compass/handover.md.
- compass/intent/2026-11-28-save-terms-needs-sign-in.md, compass/design/2026-11-28-save-terms-needs-sign-in.md.

## Steps
1. Tests first; check TC-041a and TC-041b fail today.
2. Change `Saved`.
3. Spec and views; `npm test`, `npm run verify`, Compass checks.

## Risks
- **Rollout scope:** turning the flag on for everyone gates every save (XP, quizzes, flashcards), as the Owner chose.
- **Hidden ≠ protected:** this is a display change only. Saved terms of a signed-in learner are already in their own
  progress document, protected by `firestore.rules` (unchanged); guests' terms stay in their own browser.
- **Terms saved before rollout** stay in the guest's browser and come back after they sign in (progress is merged).

## Proof
- `npx playwright test -g TC-041` (desktop and 375 px), `npx playwright test -g TC-035`, `npm run verify`, `npm test`,
  `node compass/check-spec.mjs`, `node compass/check-guardrails.mjs origin/main`.
