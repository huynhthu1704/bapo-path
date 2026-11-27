# Plan: REQ-037 Links inside pages follow the feature flags

Requirements: REQ-037 · Test cases: TC-037b · Issue: #57
Intent: compass/intent/2026-11-27-admin-redesign-and-flags.md · Design: compass/design/2026-11-27-admin-redesign-and-flags.md

Part 1 (#67) hid a switched-off feature in the menu, phone bar, top bar, Home and search, and showed "Coming soon" on
its pages. Links to it from *other* pages still showed. The Owner decided on 2026-11-27 ("yes") that those links must
disappear too. This PR does that, plus two review notes from #67 that touch the same files. The Features page (part 2)
follows separately; REQ-037 stays In build and the spec does not change in this PR.

## Files
- src/data/flags.js — `flagOfPath` also resolves `/term/<id>` and `/glossary/<cat>` (BABOK, domains…) and ignores `?query`.
- src/components/ui.jsx — `FeatureLink`: a drop-in for `Link` that renders nothing when the target feature is off for
  this visitor (or its children as plain text with `keep`, where the page needs the content).
- src/pages/Knowledge.jsx — glossary, term, domain and saved pages: category cards, term lists, related terms, "Used in
  skills", References link, "Practise …" buttons (`practice`).
- src/pages/Roadmap.jsx — skill page key terms; "Practise this skill" (`practice`).
- src/pages/Frameworks.jsx — term links, glossary buttons, References link, "Test yourself" (`practice`).
- src/pages/Practice.jsx — "Learn more" / "Open term" links on quiz and results.
- src/pages/Game.jsx — collection cards keep their text but stop linking when the glossary is off; "Collect missing
  cards" (`practice`).
- src/pages/Account.jsx — My Library: Saved / Job search shortcuts and search-history results.
- src/pages/Profile.jsx — glossary strength links (text kept), "See your rank and badges" (`achievements`), streak
  tile and rank tag (`rewards`) — review note 2 of #67.
- src/pages/Home.jsx — quest rows link only to features that are on; no empty right column when "Continue learning" has
  nothing to show — review notes 1 and 2 of #67.
- tests/e2e/features.spec.js — TC-037b: links inside pages disappear; the search check first proves results are shown
  (review note 5 of #67).

## Steps
1. Extend TC-037b and check that it fails today (links still shown).
2. `flagOfPath` for term and glossary paths; `FeatureLink` in ui.jsx.
3. Replace `Link` with `FeatureLink` where the target is another feature; guard the "Practise" buttons.
4. Home and Profile review notes.
5. `npm test`, `npm run verify`, `node compass/check-spec.mjs`, `node compass/check-guardrails.mjs origin/main`.

## Risks
- **Hiding content by mistake:** with every feature on (the default), `FeatureLink` is exactly `Link`; TC-037c and the
  existing e2e tests run with the defaults and must stay green.
- **Pages that become empty** (e.g. Collection with the glossary off): cards keep their text (`keep`), only the link goes.
- **Same-feature links** (a term list on a glossary page) stay plain `Link`: if the page shows, its own feature is on.

## Proof
- `npx playwright test -g TC-037` (desktop and 375 px), `npm run verify`, `npm test`.
