# Plan: REQ-037 Every feature behind its own feature flag (part 1: the flags and every place they apply)

Requirements: REQ-037 · Test cases: TC-037 (b, c, d) · Issue: #57
Intent: compass/intent/2026-11-27-admin-redesign-and-flags.md · Design: compass/design/2026-11-27-admin-redesign-and-flags.md

REQ-037 ships in two PRs because of the 12-file limit. **This PR:** a flag for every feature, checked everywhere the
feature appears; the Owner switches them in today's *Prompt admin → Insights → Features* card, which already lists every
flag in `FLAGS` and writes each change to the audit log. **Next PR:** the dedicated Features page (SCR-5, TC-037a) and
the "Admin › Features" wording in `compass/agent-knowledge.md`. REQ-037 stays *In build* until then.

## Files
- src/data/flags.js — the feature catalogue, Bee There style: `name`, `icon`, `where` (where it appears), `since`,
  default `audience`. Features live before flags default to `everyone`; `prompts`, `googleOnly`, `pmTrack` keep `owner`.
  `ROUTE_FLAGS` maps each path to its feature. Header comment no longer points to "Prompt admin → Insights" only.
- src/components/ui.jsx — `useFeature(key)` (role-aware `can()`); sidebar items, empty groups, rank card, top-bar XP and
  streak, phone bottom bar and search results follow the flags.
- src/pages/PromptGate.jsx — `FlagGate` takes a `flag` (default `prompts`); "Coming soon" names the feature.
- src/App.jsx — every feature route is wrapped in `FlagGate` with its flag.
- src/pages/Home.jsx — rank, streak and quests (`rewards`), "Continue learning" (`roadmap`), due-card button
  (`practice`) and the four Home cards (`circle`, `speed`, `collection`, `story`) follow the flags.
- tests/e2e/features.spec.js — TC-037b, TC-037c, TC-037d.
- compass/spec.json — REQ-037 In build; TC-037 automated (`tests/e2e/features.spec.js`). Views regenerated:
  compass/requirements.md, compass/tests.md, compass/handover.md.

## Steps
1. Write TC-037b–d and check that b and d fail today (no `story` flag, no audit entry for it) and c passes (guards
   today's behaviour).
2. Build the catalogue and `ROUTE_FLAGS`; add `useFeature`; generalise `FlagGate`.
3. Wrap the routes, then the sidebar, phone bar, search, top bar and Home.
4. `npm test`, `npm run verify`, `node compass/check-spec.mjs`, `node compass/check-guardrails.mjs origin/main`.

## Risks
- **Learners losing a feature on release day:** every existing feature defaults to `everyone`; TC-037c opens each
  feature route as a learner with no saved settings and expects no "Coming soon".
- **Flash of a feature that the Owner turned off:** remote settings load after the first paint, so a feature at
  `everyone` by default can show for a moment before it hides. Accepted (same as today's flags); a gated route only
  shows "Coming soon" once the settings have loaded.
- **Links inside pages** (e.g. a term link on a skill page) are not removed in this PR; they open "Coming soon" when the
  feature is off. Removing them needs edits in 6 more page files; done with the REQ-038 navigation work if the Owner wants it.
- **Staff lose sight of features:** `can()` still returns true for any role, so staff see everything.

## Proof
- `npx playwright test -g TC-037` (desktop and 375 px), `npm run verify`, `npm test`, `node compass/check-spec.mjs`.
- Approved design SCR-1 (sidebar without unreleased items) and SCR-3 ("Coming soon").
