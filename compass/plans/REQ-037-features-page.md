# Plan: REQ-037 part 2 — the Features page

Requirements: REQ-037 · Test cases: TC-037 (a, d) · Issue: #57
Intent: compass/intent/2026-11-27-admin-redesign-and-flags.md · Design: compass/design/2026-11-27-admin-redesign-and-flags.md (SCR-5, Figma F04 and F08)

Part 1 (#67) gave every feature a flag; #68 hid in-page links. This PR adds the dedicated Features page from the
approved design and closes REQ-037. It lives in today's Prompt admin as a new **Features** tab (Owner only); REQ-038
moves it into the new Admin area as *Admin › Features* and redirects the old link.

## Files
- src/pages/PromptAdmin.jsx — new `Features` page (SCR-5): help line; search; filter All / Released / Unreleased / Beta
  with counts; one card per feature (icon, name, where it appears, "Since …" or "Live before flags", status tag
  Owner only · Beta · N people · Everyone); "Released to everyone" switch; when off, the preview link and the
  beta-tester picker. The Features card leaves Insights (usage numbers and audit log stay). Owner-only tab.
- src/App.jsx — route `/pw-admin/features`; full-screen feature pages (challenge, flashcards, quiz, Speed Round) show
  "Coming soon" inside the normal page frame (review note 3 of #67).
- src/pages/PromptGate.jsx — `FlagGate` `framed` option for those routes.
- src/pages/Knowledge.jsx — review notes 1–2 of #68: Saved subtitle and empty state, "Add to flashcards" (`practice`)
  and "+5 XP" (`rewards`) follow their flags.
- tests/e2e/features.spec.js — TC-037a (Features page, desktop and 375 px); TC-037d uses the new page; Coming soon on a
  full-screen page keeps the menu.
- tests/e2e/sign-in.spec.js — the #45 test switches Google-only sign-in on the new page (the Insights card is gone).
- compass/spec.json — REQ-037 Done, TC-037 Passing; views compass/requirements.md, compass/tests.md, compass/handover.md.
- compass/agent-knowledge.md — §6 points to the Features page.

## Steps
1. TC-037a and the updated TC-037d first; check they fail (no Features page yet).
2. Build the Features page; remove the Insights card; add the tab and route.
3. Framed "Coming soon"; Knowledge review notes.
4. Spec to Done, views, agent-knowledge. `npm test`, `npm run verify`, Compass checks.

## Risks
- **Audience model:** the page keeps the stored three audiences. Switch on → `everyone`; switch off → `beta` when the
  feature has beta testers, else `owner`; ticking testers while off moves between `owner` and `beta`. Every save writes
  `<feature>: <audience>` to the audit log (as today), so TC-037d keeps proving it.
- **Losing the old control:** the #45 test moves to the new page and still checks Google-only sign-in end to end.
- **Non-owners:** the tab shows only for the Owner, and the page says "Only the Owner can change features" for
  others; `settings/site` is already Owner-write in `firestore.rules`.

## Proof
- `npx playwright test -g TC-037` and `-g "#45"` (desktop and 375 px), `npm run verify`, `npm test`, `node compass/check-spec.mjs`.
- Screenshot compared with the approved Figma frames F04 and F08.
