# Plan: REQ-039 Admin Overview of what needs attention

Requirements: REQ-039 · Test cases: TC-039 (a, b, c) · Issue: #60
Intent: compass/intent/2026-11-27-admin-redesign-and-flags.md · Design: compass/design/2026-11-27-admin-redesign-and-flags.md (SCR-4, Figma F03 Owner, F06 Editor, F05 nothing pending)

`#/admin` opens the Overview (until now it redirected to Admin › Prompts). It is the first item of the admin side menu
for every staff role.

## Files
- src/pages/AdminPages.jsx — `Overview`: count cards that link to their page, only for what the role can open
  (design SCR-4):
  - Reviewer and Owner: **Prompts waiting for review** (status `review`) → Review queue; **New feedback** (not done) →
    Feedback.
  - Owner: **Features not released to everyone** (audience ≠ everyone) → Features.
  - Editor: **Your drafts** (drafts they created) and **Sent back for changes** (their drafts with a review note) → Prompts.
  - Cards with 0 are left out; nothing left → "Nothing to do right now". Loading → spinner. Quick links per role
    (New prompt for all; Review queue / Feedback for reviewers; Knowledge base, Staff, Insights for the Owner).
- src/pages/AdminShell.jsx — "Overview" first in the side menu and the drop-down, for every staff role; `/admin` is no
  longer treated as Prompts.
- src/App.jsx — route `/admin` → Overview (the `/admin` → Prompts redirect goes).
- tests/e2e/admin-overview.spec.js (new) — TC-039a (Owner cards and links, with seeded review prompt, feedback and an
  unreleased feature), TC-039b (Reviewer and Editor see only their cards; Editor drafts and sent-back), TC-039c
  ("Nothing to do right now"), at desktop and 375 px.
- tests/e2e/navigation.spec.js — `#/admin` now stays on the Overview; Overview in every role's menu.
- compass/spec.json — REQ-039 Done, TC-039 automated; views compass/requirements.md, compass/tests.md, compass/handover.md.

## Steps
1. admin-overview.spec.js and the navigation.spec.js changes first; check they fail today.
2. Overview page, menu item, route.
3. Spec and views; `npm test`, `npm run verify`, Compass checks.

## Risks
- **Database reads:** the Overview reads prompts, feedback and the flags once per visit (the same lists the Review
  queue and Feedback pages read); no new collections, no rule changes.
- **Roles:** Editors only get prompt counts about their own drafts; feedback and features stay hidden from them, as in
  the side menu. Data access is still enforced by `firestore.rules` (unchanged).
- **Old bookmarks** to `#/admin` (the former Knowledge admin) now open the Overview, which links to the Knowledge base.

## Proof
- `npx playwright test -g TC-039` (desktop and 375 px), `npx playwright test -g TC-038`, `npm run verify`, `npm test`,
  `node compass/check-spec.mjs`.
- Screenshot compared with Figma F03, F05 and F06.
