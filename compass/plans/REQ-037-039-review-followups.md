# Plan: REQ-037 / REQ-038 / REQ-039 — follow-up fixes from the independent reviews

Requirements: REQ-037, REQ-038, REQ-039 (all Done; no change to their criteria) · Test cases: TC-037b, TC-038b, TC-039a–c
Issues: #57, #59, #60 · Intent: compass/intent/2026-11-27-admin-redesign-and-flags.md · Design: compass/design/2026-11-27-admin-redesign-and-flags.md

Small fixes the reviews of #69, #70, #73 and #74 listed as nits and that did not fit those PRs. The Owner asked for them
in chat on 2026-11-27 ("then do the follow-up fixes"). The spec does not change.

## Files
- src/pages/AdminPages.jsx — the Knowledge base page moves here from Account.jsx (so the Admin shell leaves the main
  bundle, #70 note 5); in demo mode it says "Publishing works on the live site only" and its Publish / Save / Delete
  buttons are disabled instead of failing with a raw Firebase error (#70 note 2). Overview: an error no longer shows
  together with "Nothing to do right now" (#74 note 1).
- src/pages/Account.jsx — the Knowledge base page is removed (moved), `SignInCard` stays and is exported.
- src/App.jsx — `/admin/knowledge` loads lazily from AdminPages.jsx like the other admin pages.
- src/pages/AdminShell.jsx — the menu counts are cached for 60 seconds instead of re-reading all prompts and feedback
  on every admin page (#70 note 4).
- src/pages/Profile.jsx — with XP, rank and streak off, the stats row uses 3 columns (no empty slot).
- src/pages/Knowledge.jsx — the glossary page and its breadcrumbs are called "Glossary", like the menu (#73 note 3).
- tests/e2e/navigation.spec.js — TC-038b: the demo Knowledge base note and disabled buttons.
- tests/e2e/admin-overview.spec.js — TC-039a: a `beta` feature counts as not released; TC-039b: an Editor sees no
  Features card; TC-039c: the Editor's empty state (#74 notes 3–4).
- tests/e2e/features.spec.js — TC-037b: the Profile stats row has 3 columns with rewards off; the Glossary title.

## Steps
1. Tests first; check the new assertions fail today.
2. Move the Knowledge base page; lazy route; demo note.
3. Count cache, Overview error state, Profile grid, Glossary title.
4. `npm test`, `npm run verify`, Compass checks; compare the main bundle size before and after.

## Risks
- **Moving the Knowledge base page:** code moved unchanged apart from the shell import and the demo guard;
  TC-038b/d open it as Owner, Reviewer and Editor.
- **Stale counts:** a 60-second cache can show an old badge for up to a minute after a review; the Review queue and
  Feedback pages themselves always read fresh data.
- **Renaming the page title to "Glossary":** only the title and breadcrumbs change; the route stays `#/general`.

## Proof
- `npx playwright test -g "TC-037|TC-038|TC-039"` (desktop and 375 px), `npm run verify`, `npm test`,
  `node compass/check-guardrails.mjs origin/main`; main bundle size from `vite build` before and after.
