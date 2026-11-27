# Requirements

_Generated from `spec.json` by `node compass/build-views.mjs`; do not edit by hand. REQ-001…025 are the Prompt Workbench baseline (built before Compass, moved here from `docs/requirements/` on 2026-11-26)._

| ID | Title | Feature | Priority | Status | Tests |
|---|---|---|---|---|---|
| REQ-001 | Browse prompts by phase or category | F-001 | Must | Done | TC-001 |
| REQ-002 | Keyword search | F-001 | Must | Done | TC-002 |
| REQ-003 | Filter by role, phase and category | F-001 | Must | Done | TC-003 |
| REQ-004 | Show newly published prompts | F-001 | Should | Done | TC-004 |
| REQ-005 | Prompt detail page | F-001 | Must | Done | TC-005 |
| REQ-006 | One-click copy | F-001 | Must | Done | TC-006 |
| REQ-007 | Fill-in placeholders with live preview | F-001 | Must | Done | TC-007 |
| REQ-008 | Remember filled placeholder values | F-001 | Should | Done | TC-008 |
| REQ-009 | 6-phase workflow view | F-001 | Must | Done | TC-009 |
| REQ-010 | Next prompt suggestion | F-001 | Must | Done | TC-010 |
| REQ-011 | Workflow collections | F-001 | Must | Done | TC-011 |
| REQ-012 | Favorite prompts | F-001 | Must | Done | TC-012 |
| REQ-013 | Recently used prompts | F-001 | Must | Done | TC-013 |
| REQ-014 | Rate a prompt and send private feedback | F-001 | Should | Done | TC-014 |
| REQ-015 | Create and edit prompts | F-001 | Must | Done | TC-015 |
| REQ-016 | Preview before publishing | F-001 | Must | Done | TC-016 |
| REQ-017 | Submit a draft for review | F-001 | Must | Done | TC-017 |
| REQ-018 | Review checklist and publish | F-001 | Must | Done | TC-018 |
| REQ-019 | Unpublish or archive | F-001 | Must | Done | TC-019 |
| REQ-020 | Version history and rollback | F-001 | Must | Done | TC-020 |
| REQ-021 | Manage categories, phases and collections | F-001 | Must | Done | TC-021 |
| REQ-022 | Assign Editor and Reviewer roles | F-001 | Must | Done | TC-022 |
| REQ-023 | Admin audit log | F-001 | Should | Done | TC-023 |
| REQ-024 | Prompt insights | F-001 | Should | Done | TC-024 |
| REQ-025 | Prompt metadata in VI, KO and FR | F-001 | Must | Done | TC-025 |
| REQ-026 | One source of truth for requirements, tests and handover | — | Must | In build | TC-026 |
| REQ-027 | Enforce the guardrails automatically | — | Must | In build | TC-027 |
| REQ-028 | Independent review of every pull request | — | Must | In build | TC-028 |
| REQ-029 | Capture the business need as an intent before requirements | — | Must | In build | TC-029 |
| REQ-030 | Approved design before any code | — | Must | In build | TC-030 |
| REQ-031 | A written plan before code | — | Must | In build | TC-031 |
| REQ-032 | Failing test committed before every bug fix | — | Must | In build | TC-032 |
| REQ-033 | Record decisions as ADRs | — | Must | In build | TC-033 |
| REQ-034 | Shared memory for agents: lessons learned and working knowledge | — | Must | In build | TC-034 |
| REQ-036 | Product Manager role and learning path | — | Should | Done | TC-036 |
| REQ-037 | Every feature behind its own feature flag | — | Must | Approved | TC-037 |
| REQ-038 | Restructured sidebar and one admin area | — | Must | Approved | TC-038 |
| REQ-039 | Admin Overview of what needs attention | — | Should | Approved | TC-039 |

## REQ-001 — Browse prompts by phase or category

Area: Browse (F-01) · Issue: #1 · Sprint: 1 · Flag: `prompts`

As built: grouped by category A–I, because every prompt has its own subcategory (agreed in PR #26).

- Given the library, when I pick "Define", then only Define prompts show, grouped by subcategory, with a count.

## REQ-002 — Keyword search

Area: Browse (F-01) · Issue: #2 · Sprint: 1 · Flag: `prompts`

- Given the query "gherkin", when I search, then prompts matching title, description, tags or body show, title matches first, in under 300 ms.

## REQ-003 — Filter by role, phase and category

Area: Browse (F-01) · Issue: #3 · Sprint: 1 · Flag: `prompts`

- Given role PO and phase Build, when both filters are on, then only matching prompts show and the filters stay in the URL.

## REQ-004 — Show newly published prompts

Area: Browse (F-01) · Issue: #4 · Sprint: 1 · Flag: `prompts`

- Given a prompt published in the last 30 days, when I open the library, then it has a "New" badge and appears in a "New this month" row.

## REQ-005 — Prompt detail page

Area: Detail (F-02) · Issue: #5 · Sprint: 1 · Flag: `prompts`

As built: the same three general tips on every prompt.

- Given a prompt, when I open it, then I see title, category, roles, purpose, when to use, inputs to prepare, placeholders, body, expected output, tips and example.

## REQ-006 — One-click copy

Area: Detail (F-02) · Issue: #6 · Sprint: 1 · Flag: `prompts`

- Given a prompt, when I click Copy, then the full prompt is on my clipboard and "Copied" shows for 2 s. Keyboard Enter does the same, and screen readers announce "Copied".

## REQ-007 — Fill-in placeholders with live preview

Area: Template (F-03) · Issue: #7 · Sprint: 1 · Flag: `prompts`

- Given 3 placeholders, when I type values, then the preview updates live and Copy copies the filled prompt. An empty placeholder stays in [brackets] and is highlighted.

## REQ-008 — Remember filled placeholder values

Area: Template (F-03) · Issue: #8 · Sprint: 1 · Flag: `prompts`

- Given I filled [Business Context], when I open another prompt with the same placeholder, then it is prefilled. Values stay in this browser and can be cleared.

## REQ-009 — 6-phase workflow view

Area: Workbench (F-04) · Issue: #9 · Sprint: 1 · Flag: `prompts`

- The Workbench shows Discover → Define → Design → Build → Release → Monitor with ordered steps; prompts I used are ticked.

## REQ-010 — Next prompt suggestion

Area: Workbench (F-04) · Issue: #10 · Sprint: 1 · Flag: `prompts`

- Given a prompt with next prompts, when I copy it, then a "Next step" panel shows 1–3 linked prompts, one marked Recommended.

## REQ-011 — Workflow collections

Area: Workbench (F-04) · Issue: #11 · Sprint: 1 · Flag: `prompts`

- Launch collections: New Product Discovery, Feature Development, Sprint Management, UAT and Release, Project Kickoff, Post-launch Review — each with ordered prompts, progress and step-through.

## REQ-012 — Favorite prompts

Area: Personal (F-05) · Issue: #12 · Sprint: 1 · Flag: `prompts`

- Tapping the star adds a prompt to My prompts → Favourites. Guests keep favourites in the browser; signed-in users across devices.

## REQ-013 — Recently used prompts

Area: Personal (F-05) · Issue: #13 · Sprint: 1 · Flag: `prompts`

- Given I copied 3 prompts, when I open My prompts, then the last 20 used show, newest first.

## REQ-014 — Rate a prompt and send private feedback

Area: Feedback (F-06) · Issue: #14 · Sprint: 3 · Flag: `prompts`

- Signed in, I give 1–5 stars and optional text: the public average updates and the text goes privately to the admin inbox. I can change my rating; there are no public comments.

## REQ-015 — Create and edit prompts

Area: Editor (F-07) · Issue: #15 · Sprint: 2 · Flag: `prompts`

- Saving makes a draft with my name and time. Placeholders are detected from the body. VI, KO and FR title, description and when-to-use fields are available.

## REQ-016 — Preview before publishing

Area: Editor (F-07) · Issue: #16 · Sprint: 2 · Flag: `prompts`

- Given a draft, Preview shows the learner detail page including the fill-in form.

## REQ-017 — Submit a draft for review

Area: Publishing (F-08) · Issue: #17 · Sprint: 2 · Flag: `prompts`

- Given a complete draft, when I submit, then status = In review and reviewers see it in their queue.

## REQ-018 — Review checklist and publish

Area: Publishing (F-08) · Issue: #18 · Sprint: 2 · Flag: `prompts`

- With completeness, clarity, placeholder match and a test run ticked, a reviewer can Publish or Return with a comment. Publish is blocked if a required field is empty. A reviewer cannot publish their own draft (the Owner can).

## REQ-019 — Unpublish or archive

Area: Publishing (F-08) · Issue: #19 · Sprint: 2 · Flag: `prompts`

- Given a published prompt, when I unpublish, then learners no longer see it and favourites show "No longer available".

## REQ-020 — Version history and rollback

Area: Versions (F-09) · Issue: #20 · Sprint: 2 · Flag: `prompts`

- History shows who changed what and when, and compares two versions. Restoring a version creates a new draft that goes through review.

## REQ-021 — Manage categories, phases and collections

Area: Taxonomy (F-10) · Issue: #21 · Sprint: 2 · Flag: `prompts`

- Adding, renaming or reordering on the taxonomy page updates the library. A category with prompts can't be deleted, only hidden.

## REQ-022 — Assign Editor and Reviewer roles

Area: Staff (F-11) · Issue: #22 · Sprint: 2 · Flag: `prompts`

- The Owner assigns Editor or Reviewer to a user who signed in once; permissions apply immediately and are enforced by Firestore rules, not only the UI.

## REQ-023 — Admin audit log

Area: Staff (F-11) · Issue: #23 · Sprint: 3 · Flag: `prompts`

- Every admin action logs who, what, which prompt and when, and the log is viewable.

## REQ-024 — Prompt insights

Area: Insights (F-12) · Issue: #24 · Sprint: 3 · Flag: `prompts`

- Insights shows copies per prompt, top 10 this month and average rating, with no personal data.

## REQ-025 — Prompt metadata in VI, KO and FR

Area: Translations (F-13) · Issue: #25 · Sprint: 1 · Flag: `prompts`

- With Korean chosen, the Korean title, description and when-to-use show under the English. The prompt text and Copy stay English. A missing translation falls back to English.

## REQ-026 — One source of truth for requirements, tests and handover

As the Owner I want requirements, test cases and decisions in one file with generated views, so that any person or agent can see where the project stands.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given compass/spec.json · When I run node compass/check-spec.mjs · Then it fails if a requirement (not Draft) has no test case, a test case points to an unknown requirement, or an automated test case's file does not carry its TC id
- Given I changed compass/spec.json · When I run node compass/build-views.mjs · Then requirements.md, tests.md, decisions.md and handover.md are regenerated, and check-spec fails in CI while handover.md is stale

## REQ-027 — Enforce the guardrails automatically

As the Owner I want the agent rules enforced by machines, so that protected files, secrets and oversized changes cannot slip through.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given an agent in Claude Code · When it edits a protected or forbidden path in compass/guardrails.json, or writes text that looks like a secret · Then the edit hook stops the edit and asks for the Owner's approval in chat (a reminder: the CI check with the human-approved label is the real gate)
- Given a pull request · When it changes more than 12 files, a forbidden path, or (without the human-approved label) a protected path, a deletion or a dependency · Then the CI guardrails check fails, using main's copy of the check and its rules

## REQ-028 — Independent review of every pull request

As the Owner I want every PR reviewed by an agent that did not write it, so that the author never approves its own work.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given a pull request · When it is ready to merge · Then a fresh reviewer has posted '## Independent review (Claude)' with a verdict and the reviewed commit, as described in compass/REVIEW.md
- Given node compass/merge-pr.mjs <n> · When CI is not green, the latest trusted review is not APPROVE for the head commit, a bug fix's review has no Test-first run that failed, or a protected path, firestore.rules or a deletion has no human-approved label · Then it refuses to merge and says why

## REQ-029 — Capture the business need as an intent before requirements

As the Owner I want my request written down as a measurable intent that I approve, so that the reason behind every requirement stays next to the code.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given a requirement from REQ-026 on · When check-spec runs · Then it fails unless the requirement points to an Approved compass/intent/ file that lists it and keeps the Owner's words under '## Business need'

## REQ-030 — Approved design before any code

As the Owner I want to approve how a change will look before it is built, so that misunderstandings are caught before coding.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given a requirement from REQ-026 on that is not Draft · When check-spec runs · Then it fails unless the requirement has a design file in compass/design/ that mentions it, or 'none: <reason>'
- Given a requirement In build or Done · When its design file is not 'Status: Approved' · Then check-spec fails (no code before the design is approved)

## REQ-031 — A written plan before code

As the Owner I want each code change to start from a short plan, so that the reviewer can check the diff against what was intended.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given a change that touches code · When node compass/plan-file.mjs or merge-pr runs · Then it fails unless the change adds compass/plans/<REQ-ids>-<name>.md with real Files, Steps, Risks and Proof
- Given a pull request that touches code · When the CI guardrails check runs · Then it fails unless the PR body has a '## Plan' with Files, Steps, Risks and Proof filled in

## REQ-032 — Failing test committed before every bug fix

As the Owner I want each bug fix to start with a test that fails, so that we know the fix really fixes the bug.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given a pull request with the bug label · When compass/test-first.mjs runs in CI · Then it fails unless the first commit only adds a test under tests/ (plus its plan file in compass/plans/), later commits do not edit that test, and a node test from the first commit fails at that commit

## REQ-033 — Record decisions as ADRs

As the Owner I want decisions I make in chat recorded with their reasons, so that later sessions do not undo them.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given spec.json decisions · When check-spec runs · Then every ADR has id, date, title, status (Proposed, Accepted, Superseded or Rejected), context, decision and consequences, and links only to known requirements

## REQ-034 — Shared memory for agents: lessons learned and working knowledge

As the Owner I want agents to learn from repeated mistakes, so that I do not correct the same thing twice.

Issue: #41

Intent: [compass/intent/2026-11-26-compass-framework.md](../compass/intent/2026-11-26-compass-framework.md)

Design: none: process change, no UI

- Given CLAUDE.md · When the process tests run · Then it has a 'Lessons learned' section, imports compass/agent-knowledge.md, and stays under one page
- Given the repo skills in .claude/skills/ · When the process tests run · Then each has a 'Use when' description and names the check that enforces it

## REQ-036 — Product Manager role and learning path

As a starter Product Manager I want to choose "Product Manager" when I join and follow a PM skill roadmap from Beginner to Expert, so that I learn the skills for my role and not only BA or PO ones.

Issue: #44

Intent: [compass/intent/2026-11-27-product-manager-path.md](../compass/intent/2026-11-27-product-manager-path.md)

Design: [compass/design/2026-11-27-product-manager-path.md](../compass/design/2026-11-27-product-manager-path.md)

- Given the pmTrack flag is on for me · When I open onboarding step 1 · Then I see three role cards (Business Analyst, Product Owner, Product Manager), and picking Product Manager and a level then Continue saves PM as my track
- Given my track is Product Manager · When I open the Skill Roadmap · Then the Product Manager tab is selected and shows four levels (Beginner → Expert) with 10 · 10 · 8 · 6 skills (full lessons at Beginner) and a 5-scenario challenge at the end of each level (pass 4 of 5), my starting level unlocked
- Given I am on the PM track · When I gain XP · Then my rank uses PM names: Intern → Associate PM → Product Manager → Senior PM → Lead PM
- Given the pmTrack flag is off for me and my track is not Product Manager · When I open onboarding, the Roadmap, search or a term page · Then I see only BA and PO, as today

## REQ-037 — Every feature behind its own feature flag

As the Owner I want every learner feature to have its own flag that hides it everywhere it appears, so that I can pause or roll out any feature in stages without a code change.

Issue: #57

Intent: [compass/intent/2026-11-27-admin-redesign-and-flags.md](../compass/intent/2026-11-27-admin-redesign-and-flags.md)

Design: [compass/design/2026-11-27-admin-redesign-and-flags.md](../compass/design/2026-11-27-admin-redesign-and-flags.md)

- Given the feature catalogue in src/data/flags.js · When the Owner opens Admin → Features · Then every feature is listed with its icon, name, where it appears, since date and status (Owner only, Beta · N people, Everyone), with search and the filters All, Released, Unreleased and Beta
- Given a feature (for example Story Mode) is set to Owner and staff · When a learner uses the site · Then its menu item, Home card and search results are hidden and its direct link shows "Coming soon", while staff still see it
- Given a feature that is live today has no saved setting · When anyone opens the site · Then it is shown as today (released to everyone)
- Given the Owner changes a feature audience · When the change is saved · Then the audit log has an entry naming the feature and its new audience

## REQ-038 — Restructured sidebar and one admin area

As a learner I want the sidebar grouped by what I want to do, and as staff I want one Admin entry with a clear side menu, so that I find things faster.

Issue: #59

Intent: [compass/intent/2026-11-27-admin-redesign-and-flags.md](../compass/intent/2026-11-27-admin-redesign-and-flags.md)

Design: [compass/design/2026-11-27-admin-redesign-and-flags.md](../compass/design/2026-11-27-admin-redesign-and-flags.md)

- Given I am a learner · When I open the sidebar · Then I see Home and the groups Learn, Practise, Progress and My stuff with only the features released to me, and a group with no visible item is hidden
- Given I am staff · When I open the sidebar · Then I see one Admin entry (no separate Knowledge admin or Prompt admin) that opens a side menu Overview, Content, People, Features, Activity showing only the sections my role may use, the knowledge base tools staying Owner only
- Given an old link #/admin or #/pw-admin/… · When I open it · Then I land on the matching page of the new admin area
- Given a 375 px screen · When I open the sidebar or the admin area · Then nothing scrolls sideways

## REQ-039 — Admin Overview of what needs attention

As the Owner or staff I want an Overview of what needs my attention, so that I can act on it in two clicks or fewer.

Issue: #60

Intent: [compass/intent/2026-11-27-admin-redesign-and-flags.md](../compass/intent/2026-11-27-admin-redesign-and-flags.md)

Design: [compass/design/2026-11-27-admin-redesign-and-flags.md](../compass/design/2026-11-27-admin-redesign-and-flags.md)

- Given prompts waiting for review, new feedback or unreleased features · When I open Admin → Overview · Then each is a count card that links to its page
- Given my role · When I open Admin → Overview · Then I see only the cards for sections my role can open
- Given nothing is pending · When I open Admin → Overview · Then I see "Nothing to do right now"
