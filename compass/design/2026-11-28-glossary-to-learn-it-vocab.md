# Design: Glossary menu item opens Learn IT Vocab

Status: Approved (by Christine, 2026-11-28)
Requirements: REQ-040
Design tool: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca (page "03 · Screens"; the sidebar component "App sidebar ›
Role=Learner" on page "01 · System Design" is updated in place, so every screen that uses it shows the change)

## Approach
No new screens. The Glossary item in the side menu and the phone bottom bar becomes a normal link to
`https://huynhthu1704.github.io/learn-it-vocab/#home` that opens in a new tab (`target="_blank"`, `rel="noreferrer"`).
Same icon (Globe), same label and position. In the side menu a small grey `ExternalLink` icon (14 px, `#94A3B8`) sits
at the right end of the row, as on the existing Learn IT Vocab cards. The item is never shown as "active", because it
leaves the site. The `glossary` feature flag still hides the item when it is off. No new feature flag (ADR-010).

## Screens
### SCR-1 · Learner sidebar (desktop) — REQ-040 (TC-040)
- Purpose: open the IT vocabulary in one click.
- Elements: LEARN › Glossary with the Globe icon, the label and the external-link icon on the right.
- States: default · hover (as the other items) · `glossary` flag off → item hidden (unchanged).
- Accessibility: the link's name is "Glossary (opens Learn IT Vocab in a new tab)".
- Frame: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca?node-id=49-2289

### SCR-2 · Phone menu and bottom bar (375 px) — REQ-040 (TC-040)
- Purpose: the same link in the slide-in drawer and the bottom bar (Home, Roadmap, Glossary, Practice, Me).
- Elements: drawer row as SCR-1. Bottom bar: the Glossary tab looks the same as today (no room for an extra icon); its
  accessible name says it opens in a new tab.
- States: no horizontal scroll at 375 px.
- Frame: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca?node-id=49-2295

### SCR-3 · `#/general` page — REQ-040 (TC-040)
- Unchanged: old links, the Home quest "Learn 2 new terms" and the "Glossary" breadcrumbs on term pages still open the
  in-site Glossary page.
- Frame: none (unchanged).

## Notes
- Menus and buttons stay English.
- The two Learn IT Vocab cards on the `#/general` page keep their `?role=ba` link (out of scope).
