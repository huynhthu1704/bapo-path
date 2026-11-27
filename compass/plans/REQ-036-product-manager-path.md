# Plan: REQ-036 Product Manager role and learning path

Requirements: REQ-036 · Test cases: TC-036 (a–d) · Issue: #44
Intent: compass/intent/2026-11-27-product-manager-path.md · Design: compass/design/2026-11-27-product-manager-path.md

## Files
- src/data/flags.js — new flag `pmTrack` (audience `owner`)
- src/data/skills.js — PM track (ranks, flag key) and its 34 skills: 10 full Beginner lessons, 24 short skills
- src/data/challenges.js — PM-1 … PM-4, 5 scenarios each (answers in mixed positions)
- src/store.jsx — `pmTrack` and `tracks` (the tracks this visitor may see; PM stays visible to anyone already on it)
- src/pages/Entry.jsx — third onboarding card; landing skill count follows the visible tracks
- src/pages/Roadmap.jsx — track tabs from `tracks`; subtitle and challenge hint name the role
- src/pages/Profile.jsx — progress blocks and track switch from `tracks`; PM colour
- src/pages/Knowledge.jsx — "Used in skills" and the Domains subtitle follow the visible tracks
- src/components/ui.jsx — search hides PM skills while the flag is off; sidebar caption
- tests/e2e/pm-track.spec.js — TC-036a–d

## Steps
1. Write TC-036a–d and check they fail (a–c) or guard today's behaviour (d).
2. Add the PM content (skills, challenges) and the flag.
3. Expose the visible tracks from the store and use them in onboarding, roadmap, profile, search and term pages.
4. Run `npm run verify` and the Compass checks.

## Risks
- Learners seeing an unreleased track: every list of tracks or skills goes through `tracks`; TC-036d checks onboarding,
  roadmap, search and a term page as a learner.
- Breaking BA/PO progress: skill ids are per track (`pm-1-1`…), so BA and PO ids do not change; the profile now counts
  ids with the `<track>-` prefix.
- Live site with a published knowledge base: cloud challenges replace the bundled list, so PM challenges could show
  "coming soon" there. Fixed in a separate bug PR before the flag is rolled out.

## Proof
- `npx playwright test -g TC-036` (desktop and 375 px), `npm run verify`, `npm test`, `node compass/check-spec.mjs`.
- Screenshots in the approved design (Figma frames SCR-1 and SCR-2).
