# Plan: REQ-040 Glossary menu item opens Learn IT Vocab

Requirements: REQ-040 · Test cases: TC-040 · Issue: #83
Intent: compass/intent/2026-11-28-glossary-to-learn-it-vocab.md · Design: compass/design/2026-11-28-glossary-to-learn-it-vocab.md

## Files
- src/data/links.js — new `LEARN_IT_VOCAB_HOME` (`https://huynhthu1704.github.io/learn-it-vocab/#home`, the address the Owner gave).
- src/components/ui.jsx — side menu and phone bottom bar: the Glossary item becomes an `<a target="_blank" rel="noreferrer">`
  with `aria-label="Glossary (opens Learn IT Vocab in a new tab)"`; the side menu row gets a small `ExternalLink` icon.
  It still follows the `glossary` flag.
- src/styles.css — `.nav-ext` for the small icon at the right end of the row.
- tests/e2e/glossary-link.spec.js — TC-040 (desktop and 375 px).
- tests/e2e/features.spec.js — TC-037c looks up the Glossary menu link by its new name.
- compass/spec.json, compass/intent, compass/design, generated views — REQ-040, TC-040, ADR-010.

## Steps
1. Write TC-040 and check that it fails today (the menu item is an in-site link).
2. Add the link constant, change the two menus, add the icon style.
3. Update TC-037c for the new accessible name.
4. `npm test`, `npm run verify`, `node compass/check-spec.mjs`, `node compass/check-guardrails.mjs origin/main`.

## Risks
- **Old links break:** `#/general` is not touched; TC-040 opens it and checks the in-site Glossary page.
- **Menu tests read the item's text:** the visible text stays "Glossary" and the class stays `nav-item`, so TC-038a's
  list of items is unchanged; only the accessible name changes (TC-037c updated).
- **No feature flag (ADR-010):** TC-040 runs at desktop and 375 px (no sideways scroll) before merge; the `glossary`
  flag still hides the item (TC-037b unchanged).
- **Security of a new tab:** `rel="noreferrer"` (implies `noopener`), as on the existing Learn IT Vocab cards.

## Proof
- `npx playwright test -g TC-040` (desktop and 375 px) fails before the change and passes after.
- `npx playwright test -g TC-037`, `npx playwright test -g TC-038`, `npm run verify`, `npm test`.
