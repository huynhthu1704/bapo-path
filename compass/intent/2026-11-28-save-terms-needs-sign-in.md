# Intent: Saving terms needs sign-in

Status: Approved (by Christine, 2026-11-28)
Requested: 2026-11-28 by Christine (Owner), in a Claude Code chat

## What we want
Visitors who are not signed in cannot save anything: bookmarks, XP, quizzes, flashcards. Today any visitor can save, and
it is kept only in that browser, with no hint that it can be lost. Target: everything saved belongs to a signed-in
account. A visitor who is not signed in and taps a bookmark, or opens **Saved**, is asked to sign in with Google. This
is the existing "Google-only sign-in" flag (`googleOnly`); the Owner rolls it out to everyone.

## Business need
"if user has not logged in, should the screen say user need to login first, similar to the 'My library' or other pages"
(with a screenshot of the Saved page, signed out, showing "No saved terms yet"). Follow-up: "only allow save when user
signs in". In a follow-up question the Owner chose to gate **every** save (the existing `googleOnly` flag), not
bookmarks only.

## Why
My Library and My Job Search already ask signed-out visitors to sign in. Saved terms behave differently: they are kept
in the browser only, can be lost, and do not follow the learner to another device.

## Constraints
- Static hosting and Firebase only; no new services, dependencies or Firestore rule changes (saved terms are already
  part of the learner's progress document).
- Behind the existing `googleOnly` flag (audience `owner` until rollout); with the flag off nothing changes.
- Reuse the existing "Sign in to save" prompt and the sign-in card used on My Library.
- 375 px with no horizontal scroll; real buttons with labels.

## Success measure
With the flag on and signed out: tapping a bookmark opens the sign-in prompt and saves nothing; the Saved page shows a
sign-in card instead of the list; after signing in from the prompt, the term is saved. Signed in: unchanged. Flag off:
unchanged. All covered by e2e tests.

## Out of scope
- Moving terms a visitor saved before the change; they appear again once that visitor signs in.
- Prompt favourites in the Prompt Workbench.

## Requirements
REQ-040 — Saved terms need sign-in (#89)
