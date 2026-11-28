# Intent: Glossary menu opens Learn IT Vocab

Status: Approved (by Christine, 2026-11-28)
Requested: 2026-11-28 by Christine (Owner), in a Claude Code chat

## What we want
Learners who open the Glossary from the BAPO Path menu land on the Learn IT Vocab site (1,000+ IT words with
pronunciation and translations) in one click. Today the menu opens BAPO Path's own Glossary page, which only points
to Learn IT Vocab from a card further down (2 clicks); target: 1 click, for everyone, from the release on.

## Business need
"when open glossary, navigate users to https://huynhthu1704.github.io/learn-it-vocab/#home". In follow-up questions the
Owner chose: the Glossary item in the side menu and the phone bottom bar; open in a **new tab**; **live for everyone on
merge** (no feature flag). Asked about the `#/general` page, the Owner chose to keep it as it is, because it is the only
place that lists the in-site Workplace and Software engineering glossaries.

## Why
The IT vocabulary moved to the sister site Learn IT Vocab; the in-site Glossary page is now mostly a signpost to it.

## Constraints
- Static hosting only; no new services or dependencies.
- The `glossary` feature flag still decides whether the menu item shows at all.
- The `#/general` page, term pages (`#/term/…`), category glossaries (`#/glossary/…`), BABOK & PMBOK, Domain Knowledge and Saved stay in
  BAPO Path and do not change.
- No feature flag (Owner's decision) → recorded as an ADR; e2e tests at desktop and 375 px before merge.

## Success measure
In e2e: the Glossary item in the side menu and in the phone bottom bar is a link to
`https://huynhthu1704.github.io/learn-it-vocab/#home` that opens in a new tab and says so to screen readers; `#/general`
still shows the in-site Glossary page.

## Out of scope
- Moving or deleting term pages, category glossaries or Saved terms.
- Changing the Learn IT Vocab site.
- The two existing "Learn IT Vocab" cards, which keep their `?role=ba` link.

## Requirements
REQ-040 — Glossary menu item opens Learn IT Vocab (#83)
