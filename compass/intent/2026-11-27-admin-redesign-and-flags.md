# Intent: A clearer sidebar and admin area, and every feature behind its own feature flag

Status: Approved (by Christine, 2026-11-27)
Requested: 2026-11-27 by Christine (Owner), in a Claude Code session

## What we want
Learners find their way around BAPO Path from a **sidebar grouped by what they want to do**, and the Owner and staff
manage the whole site from **one admin area** with a clear map, instead of two separate admin areas (*Knowledge admin*
and *Prompt admin*) where feature roll-out is hidden inside Insights. Every **feature** (not every menu item) has its
own flag, as on Bee There (travel-map): when a feature is off, **every place it appears** is hidden — its menu item, its
pages (direct links show "Coming soon"), its cards on Home, its buttons and links on other pages and its search results.

Baseline: 2 admin entry points in the sidebar; feature settings are a card in *Prompt admin → Insights*; 2 features
flagged (`prompts`, `googleOnly`). Target, by the end of this work: 1 *Admin* entry point; a **Features** page in the
admin area that lists every feature (Bee There style: icon, name, where it appears, since, status, search and filters,
"Release to everyone", beta testers); about 17 features flagged; each switch change written to the audit log.

## Business need
"redesign the admin modules for clearer and easier management
made every feature under 'feature flag' for better roll out plan"

Follow-up answers (2026-11-27):
1. On the admin map: "consider restructure the whole sidebar".
2. Knowledge-base tools stay Owner-only: "yes".
3. "one flag for an feature, not a menu. A feature mean any section related to one feature should be hidden under
   feature flag, please refer to how the 'Bee there' website config it".

## Why
- Two admin areas with different looks: *Knowledge admin* (`#/admin`: publish the knowledge base, edit glossary terms)
  and *Prompt admin* (`#/pw-admin`: prompts, review queue, feedback, taxonomy, staff, insights). It is not obvious
  where a task lives.
- The learner sidebar mixes kinds of things: *Saved* sits under LEARN, *References* and *Achievements* under YOU, the
  Prompt Workbench is inserted in the middle of LEARN.
- Only 2 features can be paused or rolled out in stages. Bee There flags every feature in one list
  (`src/data/flags.js`) and checks the same key everywhere that feature shows, which makes a roll-out plan possible.

## Proposed sidebar (to confirm in the design step)
- **Home**
- **LEARN** — Skill Roadmap · Glossary (General Knowledge) · BABOK & PMBOK · Domain Knowledge · References
- **PRACTISE** — Practice (flashcards & quiz) · Speed Round · Story Mode · Prompt Workbench
- **PROGRESS** — Achievements · Collection · Study Circle
- **MY STUFF** — Saved · My Library · My Job Search · Progress & Profile
- **Admin** (staff only, one entry) → admin area with its own side menu:
  **Overview** (to-do: prompts waiting for review, new feedback, features not yet released) ·
  **Content** (Prompts, Review queue, Feedback, Taxonomy, Knowledge base — Owner only) ·
  **People** (Staff — Owner only) · **Features** (Owner only) · **Activity** (Insights and Audit log — Owner only)
- A group with no visible item is hidden. The phone bottom bar shows the first released items of Home, Roadmap,
  Glossary, Practice and Me.

## Proposed features (one flag each; "appears in" is what the flag hides)
| Flag | Feature | Appears in |
|---|---|---|
| `roadmap` | Skill Roadmap | menu, roadmap, skill pages, challenges, Home "next skill" card, skill search results, skill links |
| `glossary` | Glossary | menu, glossary and term pages, term search results; term links elsewhere become plain text |
| `frameworks` | BABOK & PMBOK | menu, framework pages, links from glossary |
| `domains` | Domain Knowledge | menu, domain pages |
| `references` | References | menu, references page, links from other pages |
| `practice` | Practice (flashcards & quiz) | menu, practice setup, flashcards, quiz, results, "practise" buttons on other pages |
| `speed` | Speed Round | menu, page, Home card |
| `story` | Story Mode | menu, page, Home card |
| `prompts` | Prompt Workbench (exists) | as today |
| `achievements` | Achievements | menu, page, sidebar rank card link, Profile link |
| `collection` | Collection | menu, page, Home card |
| `circle` | Study Circle | menu, page, Home card and leaderboard |
| `rewards` | XP, rank, streak and daily quests | top bar pills, sidebar rank card, Home quests and chest |
| `saved` | Saved | menu, page, save buttons |
| `library` | My Library | menu, page |
| `jobs` | My Job Search | menu, page |
| `googleOnly` | Google-only sign-in (exists) | as today |

## Constraints
- **Nothing disappears for learners on release day:** flags for features that are already live start *released to
  everyone*; only features that are new from now on start at *Owner and staff* (ADR-002).
- Not flagged: Landing, sign-up/onboarding, Home itself, Progress & Profile, the admin area.
- Knowledge-base tools (publish, edit glossary terms) stay Owner-only.
- No change to `firestore.rules` and no new roles (Owner = `admins/{uid}`, Editor/Reviewer = `staff/{uid}.role`). A
  flag hides a feature; it is not access control.
- Keep the three audiences we already store (Owner and staff / Beta testers / Everyone) and the `?preview=<flag>` link;
  show them Bee There style ("Owner only", "Beta · N people", "Everyone").
- Old links (`#/admin`, `#/pw-admin/...`) keep working.
- Free hosting, Firebase only, no new dependencies. Menus stay English. 375 px with no horizontal scroll.
- ≤ 12 files per PR, so this ships in about 3 PRs: (1) the feature catalogue, the flag checks in every place and the
  Features page; (2) the new sidebar and the single admin area; (3) the admin Overview.

## Success measure
- Switching any feature to *Owner and staff* hides it from a learner everywhere it appears (checked by an e2e test per
  feature on its menu item and direct link, plus Home cards), and the change is in the audit log.
- The sidebar shows one *Admin* entry for staff; each admin task is ≤ 2 clicks from the Admin overview.
- e2e tests pass at desktop and 375 px.

## Out of scope
- Unifying the two permission systems or adding new roles.
- Bee There's "value" line feeding an About / What's new page (can be a later request).
- Scheduled or percentage roll-outs.
- Changing learning content or the Editor → Reviewer publishing flow.

## Requirements
- REQ-037 — Every feature behind its own feature flag (#57)
- REQ-038 — Restructured sidebar and one admin area (#59); no flag for the sidebar itself (ADR-009)
- REQ-039 — Admin Overview of what needs attention (#60)
