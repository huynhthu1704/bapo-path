# Plan: REQ-040 Glossary menu opens the BA / PO / PM word list

Requirements: REQ-040 · Test cases: TC-040 · Issue: #83
Intent: compass/intent/2026-11-28-glossary-to-learn-it-vocab.md · Design: compass/design/2026-11-28-glossary-to-learn-it-vocab.md

Follow-up to #86. The Owner asked on 2026-11-28: "make the link to BA/PO/PM". The Glossary item in the side menu and
the phone bottom bar opens `https://huynhthu1704.github.io/learn-it-vocab/#home?role=ba` (the BA / PO / PM word list)
instead of the site's home page: the same address as the two Learn IT Vocab cards.

## Files
- src/data/links.js — remove `LEARN_IT_VOCAB_HOME`; the menu uses the existing `LEARN_IT_VOCAB`.
- src/components/ui.jsx — side menu and bottom bar use `LEARN_IT_VOCAB`.
- tests/e2e/glossary-link.spec.js — TC-040 expects the `?role=ba` address.
- compass/spec.json, intent, design, generated views — REQ-040's first criterion names the new address.

## Steps
1. Change TC-040 to expect the new address and check that it fails (the menu still opens `#home`).
2. Point both menus at `LEARN_IT_VOCAB` and remove the unused constant.
3. `npm test`, `npm run verify`, `node compass/check-spec.mjs`, `node compass/check-guardrails.mjs origin/main`.

## Risks
- **Cards and menu drift apart again:** both now read one constant, `LEARN_IT_VOCAB`.
- **Nothing else changes:** label, icon, new tab and the `glossary` flag stay as in #86; TC-037 and TC-038 still run.

## Proof
- `npx playwright test -g TC-040` (desktop and 375 px) fails before the change and passes after; `npm run verify`.
