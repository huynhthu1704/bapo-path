# Design: A clearer sidebar and admin area, and every feature behind its own flag

Status: Draft
Requirements: REQ-037, REQ-038, REQ-039
Design tool: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca (page "03 · Screens", section "F · Sidebar, admin and features"; frames are mockups drawn on the running demo with the site's own styles)

## Approach
No new visual language: the sidebar keeps today's `nav-sec` / `nav-item` styles, the admin pages reuse `card`, `seg`,
`tag`, `list-row`, `btn` and `PageHead` from `src/components/ui.jsx` and `src/styles.css`. Icons stay lucide.

- **Learner sidebar** (REQ-038): Home on top, then LEARN · PRACTISE · PROGRESS · MY STUFF. Each item shows only when its
  feature flag is on for the visitor; a group with no visible item is not drawn. The rank card stays at the bottom
  (hidden when the `rewards` flag is off). Subtitle "BA, PO & PM learning".
- **Staff** see one **Admin** item right under Home (a badge counts the open to-dos), instead of *Prompt admin* and
  *Knowledge admin* at the bottom of the menu. No flag for the new sidebar (ADR-009).
- **Admin area** (REQ-038): every admin page has a second, admin side menu on the left of the content:
  Overview · CONTENT (Prompts, Review queue, Feedback, Taxonomy, Knowledge base) · PEOPLE (Staff) · RELEASES (Features) ·
  ACTIVITY (Insights, Audit log). Items a role cannot use are not shown (Editor: Overview and Prompts; Reviewer: plus
  Review queue and Feedback; Owner: everything). Counts show as amber badges. Header: breadcrumb "Admin › <page>", title,
  one-line purpose, "Signed in as <name> · <role>". At 375 px the admin menu becomes an "Admin section" drop-down above
  the content.
- **Routes:** `#/admin` becomes the Overview; pages live under `#/admin/...` (`/admin/prompts`, `/admin/review`,
  `/admin/feedback`, `/admin/taxonomy`, `/admin/knowledge`, `/admin/staff`, `/admin/features`, `/admin/insights`,
  `/admin/audit`). Old `#/pw-admin/...` links redirect to the matching new page.
- **Feature flags** (REQ-037): one catalogue in `src/data/flags.js`, Bee There style: `key`, `icon`, `name`, `where`
  (where it appears), `since`, default audience. Features live before this change default to *everyone*; new ones to
  *owner*. One helper (`useFeature(key)`) is used by every place a feature appears; a route of a feature that is off
  shows "Coming soon".

## Screens
### SCR-1 · Learner sidebar — REQ-038 (TC-038), REQ-037 (TC-037)
- Purpose: find a learning feature fast.
- Elements: logo; Home; LEARN (Skill Roadmap, Glossary, BABOK & PMBOK, Domain Knowledge, References); PRACTISE
  (Practice, Speed Round, Story Mode, Prompt Workbench); PROGRESS (Achievements, Collection, Study Circle); MY STUFF
  (Saved, My Library, My Job Search, Progress & Profile); rank card.
- States: the mockup shows a learner with Story Mode and the Prompt Workbench not released — both are simply absent ·
  staff → Admin item under Home · group with no released item → group hidden.
- Frame: _to add_

### SCR-2 · Phone menu (375 px) — REQ-038 (TC-038)
- Purpose: the same menu in the slide-in drawer; bottom bar unchanged (Home, Roadmap, Glossary, Practice, Me — each
  hidden when its feature is off).
- Frame: _to add_

### SCR-3 · "Coming soon" for a feature that is off — REQ-037 (TC-037)
- Purpose: a learner opens a direct link (e.g. `#/story`) to a feature not released to them.
- Elements: card "Coming soon", "<Feature> is not available yet. It will open here once it is released.", Back to Home.
- Frame: _to add_

### SCR-4 · Admin → Overview (Owner) — REQ-039 (TC-039), REQ-038
- Purpose: see what needs attention and jump there.
- Elements: admin side menu; count cards that link to their page — Prompts waiting for review, New feedback, Features
  not released to everyone (Owner); Quick links (New prompt, Knowledge base, Staff, Insights).
- States: Owner (3 cards) · Reviewer (review + feedback) · Editor (Your drafts, Sent back for changes; menu shows only
  Overview and Prompts) · nothing pending → "Nothing to do right now" · loading → spinner.
- Frames: _to add_ (Owner, Editor, empty)

### SCR-5 · Admin → Features (Owner) — REQ-037 (TC-037)
- Purpose: decide who sees each feature and roll it out.
- Elements: help line; search; filter All / Released / Unreleased / Beta with counts; one card per feature: icon,
  name, where it appears, "Since <date>" or "Live before flags", status tag (Owner only · Beta · N people · Everyone),
  switch "Released to everyone"; when off: the preview link `?preview=<key>` and the beta-tester picker (people who
  signed in once). Each change → audit log "Feature: <name> → <audience>".
- States: saving (switch disabled) · error (red message) · no match ("No feature matches").
- Frames: _to add_ (desktop, 375 px)

### SCR-6 · Other admin pages — REQ-038
- Prompts, Review queue, Feedback, Taxonomy, Staff, Insights (usage only), Audit log (its own page, moved out of
  Insights) and Knowledge base (today's Knowledge admin, Owner only) keep their current content inside the new admin
  shell.
- Frame: none (content unchanged; same shell as SCR-4).

## Notes
- 375 px: admin menu → drop-down; feature cards stack; filter buttons wrap; no horizontal scroll (checked in the
  mockups and in e2e `@mobile`).
- Accessibility: both menus are `<nav>` with `aria-label` ("Main menu", "Admin"); switches are real checkboxes with
  labels; badges have text equivalents ("3 waiting").
- Menus stay English.
- Delivery: PR 1 = REQ-037 (catalogue, checks, Features page inside today's admin), PR 2 = REQ-038 (sidebar, admin shell,
  routes, redirects), PR 3 = REQ-039 (Overview).
