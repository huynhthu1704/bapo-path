# Plan: #71 cards that are also rows lay out as rows

Requirements: none (bug) · Test cases: #71 tests in tests/e2e/card-rows.spec.js · Issue: #71
Intent: the bug issue · Design: the original Figma screens already show these cards as rows (e.g. S11 · Domain Knowledge, node 5-1304)

## Files
- tests/e2e/card-rows.spec.js — failing test: the "Missing your industry?" (Domains) and "How BA, PO and PM work together"
  (Frameworks) cards are rows on desktop; at 375 px the stack-sm card still stacks
- src/styles.css — one rule: `.card.row { flex-direction: row; }`, placed after `.card` and before the media queries

## Steps
1. Commit the failing test and this plan.
2. Add the rule. The phone rules for `.row.stack-sm` come later in the file, so cards marked to stack on small screens
   still stack there.
3. Compare before/after screenshots of the affected pages at 1440 px and 375 px; run `npm run verify`.

## Risks
- About 20 places change at once. Before/after screenshots at 1440 and 375 px: Domains and Frameworks improve (as in
  Figma); Profile, Library, Admin and Results look the same (they already used a local fix or show other states);
  phone layouts unchanged. The local fixes from #58, #63 and other inline `flexDirection: 'row'` stay; they now agree.
- Answer explanations (quiz, challenge, Story Mode) become icon-beside-text rows, which is what their markup intends.

## Proof
- `npx playwright test -g "#71"` fails before the fix ("column") and passes after; `npm run verify`; screenshots.
