# Intent: One clear admin area, and every feature behind a feature flag

Status: Draft
Requested: 2026-11-27 by Christine (Owner), in a Claude Code session

## What we want
The Owner and staff manage the whole site from **one admin area** with a clear map (Overview, Content, People,
Releases, Activity), instead of two separate admin areas (*Knowledge admin* and *Prompt admin*) where feature roll-out
is hidden inside Insights. Baseline: 2 admin entry points in the menu, feature settings in Insights, 2 of ~20 learner
features behind a flag. Target, by the end of this work: 1 admin entry point; a **Releases** page that lists every
learner-facing feature with its audience (Owner and staff / Beta testers / Everyone) and can change it; every
learner-facing feature (Learn, Play and You menu items) behind a flag, so any feature can be paused or rolled out in
stages without a code change.

## Business need
"redesign the admin modules for clearer and easier management
made every feature under 'feature flag' for better roll out plan"

## Why
- Today there are two admin areas with different looks and rules: *Knowledge admin* (`#/admin`: publish the knowledge
  base, edit glossary terms) and *Prompt admin* (`#/pw-admin`: prompts, review queue, feedback, taxonomy, staff,
  insights). It is not obvious where a task lives.
- Feature roll-out (REQ-0xx flags, ADR-002) is a card inside *Prompt admin → Insights*, mixed with usage numbers and the
  audit log. A roll-out plan needs its own page.
- Only `prompts` and `googleOnly` have flags. The rest of the site (Roadmap, Glossary, BABOK & PMBOK, Domains, Practice,
  Story Mode, Speed Round, Collection, Study Circle, Job Search, Library, Achievements, References) cannot be paused,
  beta-tested or rolled out in stages.

## Constraints
- **Nothing disappears for learners on release day:** the new flags for features that are already live start at
  audience *Everyone*; only new features start at *Owner and staff* (ADR-002).
- Core pages are not flagged: Landing, sign-up/onboarding, Home, Progress & Profile, and the admin area itself.
- No change to `firestore.rules` and no new roles: the Owner is still `admins/{uid}`, Editors/Reviewers still
  `staff/{uid}.role`. Hiding a menu item is not access control; data access stays as the rules already enforce it.
- Old links (`#/admin`, `#/pw-admin/...`) keep working (redirect).
- Free hosting, Firebase only, no new dependencies. Menus stay English. 375 px with no horizontal scroll.
- ≤ 12 files per PR, so this ships in 2–3 PRs (e.g. 1: flags for every feature + Releases page; 2: one admin shell and
  navigation; 3: Overview page).

## Success measure
- The menu shows one *Admin* entry for staff; each admin task is reachable in ≤ 2 clicks from the Admin overview.
- The Releases page lists every flagged feature; switching one to *Owner and staff* hides it from learners (menu and
  direct link show "Coming soon") and the change is in the audit log.
- e2e tests cover both, at desktop and 375 px.

## Out of scope
- Unifying the two permission systems or adding new roles.
- Per-user beta lists for features other than through the existing beta-tester picker.
- Changing the learning content or the prompt publishing flow (Editor → Reviewer) itself.
- Scheduled / percentage roll-outs (only the three audiences we have).

## Open questions for the Owner
1. Is the proposed admin map right? **Overview** (to-do: prompts waiting for review, new feedback, flags not yet at
   Everyone) · **Content** (Prompts, Review queue, Knowledge base, Taxonomy) · **People** (Staff) · **Releases**
   (feature flags) · **Activity** (Insights and Audit log).
2. Should the knowledge-base tools (publish, edit glossary terms) stay Owner-only? (Today they are.)
3. One flag per menu item (≈ 15 flags), or one flag per menu group (Learn / Play / You)? Proposed: per item.

## Requirements
<filled after approval>
